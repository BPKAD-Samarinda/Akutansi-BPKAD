<?php
// api/config.php

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type, Accept, Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Fallback for getallheaders() if not available
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

// Load Environment Variables from .env files
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        if (strpos($line, '=') === false) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Check both local root env and backend env
loadEnv(dirname(__DIR__) . '/.env');
loadEnv(dirname(__DIR__) . '/backend/.env');

// Get env values with default fallbacks
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
$db_name = getenv('DB_DATABASE') ?: 'akuntansi_bpkad';
$jwt_secret = getenv('JWT_SECRET') ?: 'replace-with-strong-random-secret';

// Initialize Database Connection (PDO)
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// JWT Helper Class (HS256)
class JWT {
    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }

    public static function sign($payload, $secret, $expiryDays = 1) {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload['exp'] = time() + ($expiryDays * 24 * 60 * 60);
        
        $header_b64 = self::base64UrlEncode($header);
        $payload_b64 = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', "$header_b64.$payload_b64", $secret, true);
        $signature_b64 = self::base64UrlEncode($signature);
        
        return "$header_b64.$payload_b64.$signature_b64";
    }

    public static function verify($token, $secret) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        list($header_b64, $payload_b64, $signature_b64) = $parts;
        
        $signature = self::base64UrlDecode($signature_b64);
        $expected_signature = hash_hmac('sha256', "$header_b64.$payload_b64", $secret, true);
        
        if (!hash_equals($signature, $expected_signature)) {
            return false;
        }
        
        $payload = json_decode(self::base64UrlDecode($payload_b64), true);
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false; // Expired
        }
        
        return $payload;
    }
}

// Token Authentication Middleware
function authenticateToken() {
    global $jwt_secret;
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    if (!$authHeader && isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
    
    if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
        http_response_code(401);
        echo json_encode(["message" => "Akses ditolak. Token tidak ditemukan."]);
        exit();
    }
    
    $token = substr($authHeader, 7);
    $decoded = JWT::verify($token, $jwt_secret);
    
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["message" => "Token tidak valid atau kedaluwarsa."]);
        exit();
    }
    
    return $decoded; // payload: ['id', 'username', 'role']
}

// Role Authorization Middleware
function authorizeRoles($user, ...$allowedRoles) {
    $userRole = isset($user['role']) ? $user['role'] : '';
    
    $normalizedUserRole = strtolower(trim($userRole));
    
    foreach ($allowedRoles as $role) {
        if (strtolower(trim($role)) === $normalizedUserRole) {
            return; // Role matches, authorization succeeds
        }
    }
    
    http_response_code(403);
    echo json_encode(["message" => "Anda tidak memiliki hak akses untuk aksi ini."]);
    exit();
}

// Parse multipart/form-data for PUT requests
function parseMultipartPut() {
    $input = file_get_contents('php://input');
    if (empty($input)) {
        return ['post' => [], 'files' => []];
    }
    
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (!$contentType && isset($_SERVER['HTTP_CONTENT_TYPE'])) {
        $contentType = $_SERVER['HTTP_CONTENT_TYPE'];
    }
    
    if (strpos($contentType, 'multipart/form-data') === false) {
        // Not multipart, maybe raw json or urlencoded
        return ['post' => json_decode($input, true) ?: [], 'files' => []];
    }
    
    // Find boundary
    preg_match('/boundary=(.*)$/', $contentType, $matches);
    if (empty($matches)) {
        return ['post' => [], 'files' => []];
    }
    $boundary = $matches[1];
    
    // Split content by boundary
    $blocks = preg_split("/-+" . preg_quote($boundary, '/') . "/", $input);
    array_pop($blocks); // Remove last empty block
    
    $post = [];
    $files = [];
    
    foreach ($blocks as $block) {
        if (empty(trim($block))) continue;
        
        // Separate headers and content
        list($headers, $body) = explode("\r\n\r\n", $block, 2);
        $body = substr($body, 0, strlen($body) - 2); // remove trailing \r\n
        
        // Parse headers
        preg_match('/name="([^"]*)"/', $headers, $matchName);
        if (empty($matchName)) continue;
        $name = $matchName[1];
        
        if (strpos($headers, 'filename=') !== false) {
            // It's a file
            preg_match('/filename="([^"]*)"/', $headers, $matchFile);
            preg_match('/Content-Type:\s*(.*)$/mi', $headers, $matchType);
            
            $filename = isset($matchFile[1]) ? $matchFile[1] : 'unknown';
            $mimeType = isset($matchType[1]) ? trim($matchType[1]) : 'application/octet-stream';
            
            // Create a temp file
            $tmpPath = tempnam(sys_get_temp_dir(), 'php_put_');
            file_put_contents($tmpPath, $body);
            
            $files[$name] = [
                'name' => $filename,
                'type' => $mimeType,
                'tmp_name' => $tmpPath,
                'error' => 0,
                'size' => strlen($body)
            ];
        } else {
            // It's a post field
            $post[$name] = $body;
        }
    }
    
    return ['post' => $post, 'files' => $files];
}

