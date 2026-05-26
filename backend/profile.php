<?php
// api/profile.php

require_once __DIR__ . '/config.php';

// 1. Authenticate Token (All roles are allowed)
$currentUser = authenticateToken();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(["message" => "Metode request tidak diizinkan. Gunakan POST atau PUT."]);
    exit();
}

// Read input data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$username = isset($input['username']) ? trim(strval($input['username'])) : '';
$password = isset($input['password']) ? strval($input['password']) : '';

if (!$username) {
    http_response_code(400);
    echo json_encode(["message" => "Nama pengguna wajib diisi"]);
    exit();
}

try {
    // Check if username is already taken by another user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id <> ?");
    $stmt->execute([$username, $currentUser['id']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["message" => "Nama pengguna sudah digunakan"]);
        exit();
    }

    // Update DB
    if ($password !== '') {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $updateStmt = $pdo->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?");
        $updateStmt->execute([$username, $hashedPassword, $currentUser['id']]);
    } else {
        $updateStmt = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
        $updateStmt->execute([$username, $currentUser['id']]);
    }

    // Generate new token with updated username
    $payload = [
        "id" => $currentUser['id'],
        "username" => $username,
        "role" => $currentUser['role']
    ];
    $newToken = JWT::sign($payload, $jwt_secret, 1);

    echo json_encode([
        "message" => "Profil berhasil diperbarui",
        "token" => $newToken,
        "user" => [
            "id" => $currentUser['id'],
            "username" => $username,
            "role" => $currentUser['role']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Gagal memperbarui profil: " . $e->getMessage()]);
}
