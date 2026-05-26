<?php
// api/auth.php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Metode request tidak diizinkan"]);
    exit();
}

// Helper to normalize roles
function normalizeRole($value) {
    $role = trim(strval($value ?? ""));
    $roleLower = strtolower($role);
    
    if (!$role) return "Staff";
    if (strpos($roleLower, "admin akuntansi") !== false) return "Admin";
    if (strpos($roleLower, "staff akuntansi") !== false) return "Staff";
    if (strpos($roleLower, "admin") !== false) return "Admin";
    if (strpos($roleLower, "staff") !== false) return "Staff";
    if (strpos($roleLower, "pkl") !== false) return "Anak PKL";
    
    return "Staff";
}

// ---- Rate Limiting: max 10 failed login attempts per IP per 15 minutes ----
function checkLoginRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $cacheKey = 'login_attempts_' . md5($ip);
    $maxAttempts = 10;
    $windowSeconds = 15 * 60; // 15 menit
    
    // Use APCu if available (faster), fallback to file-based
    if (function_exists('apcu_fetch')) {
        $data = apcu_fetch($cacheKey, $success);
        if (!$success) $data = ['count' => 0, 'first' => time()];
        if (time() - $data['first'] > $windowSeconds) {
            $data = ['count' => 0, 'first' => time()];
        }
        if ($data['count'] >= $maxAttempts) {
            $remaining = $windowSeconds - (time() - $data['first']);
            http_response_code(429);
            echo json_encode(["message" => "Terlalu banyak percobaan login. Coba lagi dalam " . ceil($remaining/60) . " menit."]);
            exit();
        }
        return function() use ($cacheKey, $data, $windowSeconds) {
            $data['count']++;
            apcu_store($cacheKey, $data, $windowSeconds);
        };
    }
    
    // File-based fallback
    $lockDir = sys_get_temp_dir();
    $lockFile = $lockDir . '/bpkad_ratelimit_' . md5($ip) . '.json';
    $data = ['count' => 0, 'first' => time()];
    if (file_exists($lockFile)) {
        $saved = json_decode(file_get_contents($lockFile), true);
        if ($saved && (time() - $saved['first']) <= $windowSeconds) {
            $data = $saved;
        }
    }
    if ($data['count'] >= $maxAttempts) {
        $remaining = $windowSeconds - (time() - $data['first']);
        http_response_code(429);
        echo json_encode(["message" => "Terlalu banyak percobaan login. Coba lagi dalam " . ceil($remaining/60) . " menit."]);
        exit();
    }
    return function() use ($lockFile, $data) {
        $data['count']++;
        file_put_contents($lockFile, json_encode($data), LOCK_EX);
    };
}

$recordFailedAttempt = checkLoginRateLimit();

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);
$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? $input['password'] : '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "Nama pengguna dan kata sandi harus diisi"]);
    exit();
}

// Input length limits (prevent abuse)
if (strlen($username) > 100 || strlen($password) > 255) {
    http_response_code(400);
    echo json_encode(["message" => "Input tidak valid."]);
    exit();
}

try {
    // 1. Fetch user
    $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user) {
        $recordFailedAttempt(); // Count as failed attempt
        http_response_code(401);
        echo json_encode(["message" => "Kombinasi nama pengguna dan kata sandi salah"]);
        exit();
    }
    
    // 2. Verify password
    $storedPassword = $user['password'];
    // Detect if stored password is a bcrypt hash (starts with $2y$, $2b$, or $2a$)
    $isBcrypt = preg_match('/^\$2[ayb]\$\d{2}\$/', $storedPassword);
    
    $isPasswordMatch = false;
    if ($isBcrypt) {
        $isPasswordMatch = password_verify($password, $storedPassword);
    } else {
        // Transitional path for legacy plaintext passwords
        $isPasswordMatch = ($password === $storedPassword);
        if ($isPasswordMatch) {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $updateStmt->execute([$hashedPassword, $user['id']]);
        }
    }
    
    if (!$isPasswordMatch) {
        $recordFailedAttempt(); // Count as failed attempt
        http_response_code(401);
        echo json_encode(["message" => "Kombinasi nama pengguna dan kata sandi salah"]);
        exit();
    }
    
    // 3. Normalize user role if needed
    $normalizedRole = normalizeRole($user['role']);
    if ($normalizedRole !== $user['role']) {
        $updateRoleStmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $updateRoleStmt->execute([$normalizedRole, $user['id']]);
    }
    
    // 4. Generate JWT Token
    $payload = [
        "id" => $user['id'],
        "username" => $user['username'],
        "role" => $normalizedRole
    ];
    
    $token = JWT::sign($payload, $jwt_secret, 1);
    
    // 5. Log activity in login_activities
    $logStmt = $pdo->prepare("INSERT INTO login_activities (user_id, username, role, login_at) VALUES (?, ?, ?, NOW())");
    $logStmt->execute([$user['id'], $user['username'], $normalizedRole]);
    
    // 6. Return response
    echo json_encode([
        "message" => "Login berhasil",
        "token" => $token
    ]);
    
} catch (PDOException $e) {
    serverError($e);
}
