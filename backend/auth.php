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
    if (strpos($roleLower, "magang") !== false) return "Anak Magang";
    if (strpos($roleLower, "pkl") !== false) return "Anak PKL";
    
    return "Staff";
}

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);
$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? $input['password'] : '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "Nama pengguna dan kata sandi harus diisi"]);
    exit();
}

try {
    // 1. Fetch user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user) {
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
    http_response_code(500);
    echo json_encode(["message" => "Terjadi kesalahan pada server: " . $e->getMessage()]);
}
