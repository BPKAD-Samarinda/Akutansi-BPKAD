<?php
// api/users.php

require_once __DIR__ . '/config.php';

// 1. Authenticate Token
$currentUser = authenticateToken();

// 2. Authorize Roles (Only Admin / Admin Akuntansi allowed)
authorizeRoles($currentUser, "Admin", "Admin Akuntansi");

$method = $_SERVER['REQUEST_METHOD'];

// Helper to normalize role
function normalizeUserRole($value) {
    $raw = strtolower(trim(strval($value ?? "")));
    if (!$raw) return "";
    if (strpos($raw, "admin") !== false) return "Admin";
    if (strpos($raw, "staff") !== false) return "Staff";
    if (strpos($raw, "pkl") !== false) return "Anak PKL";
    return "";
}

// Helper to map role output
function mapRoleOutput($role) {
    $roleLower = strtolower(trim(strval($role ?? "")));
    if ($role === 'Admin Akuntansi') return 'Admin';
    if ($role === 'Staff Akuntansi') return 'Staff';
    if (strpos($roleLower, 'pkl') !== false) return 'Anak PKL';
    if (!$role) return 'Staff';
    return $role;
}

// Routing inside users.php
// $route is defined in index.php (e.g. /users or /users/123)
if ($route === '/users') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC, id DESC");
            $users = $stmt->fetchAll();
            
            // Map roles
            foreach ($users as &$user) {
                $user['role'] = mapRoleOutput($user['role']);
            }
            
            echo json_encode($users);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal mengambil data pengguna: " . $e->getMessage()]);
        }
        
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $username = isset($input['username']) ? trim($input['username']) : '';
        $password = isset($input['password']) ? $input['password'] : '';
        $role = isset($input['role']) ? trim($input['role']) : '';
        
        $normalizedRole = normalizeUserRole($role);
        
        if (!$username || !$password || !$normalizedRole) {
            http_response_code(400);
            echo json_encode(["message" => "Nama pengguna, kata sandi, dan peran wajib diisi"]);
            exit();
        }
        
        $allowedRoles = ["Admin", "Staff", "Anak PKL"];
        if (!in_array($normalizedRole, $allowedRoles)) {
            http_response_code(400);
            echo json_encode(["message" => "Peran tidak valid"]);
            exit();
        }
        
        try {
            // Check existing username
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["message" => "Nama pengguna sudah digunakan"]);
                exit();
            }
            
            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            
            // Insert user
            $insertStmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
            $insertStmt->execute([$username, $hashedPassword, $normalizedRole]);
            
            http_response_code(201);
            echo json_encode(["message" => "Pengguna berhasil ditambahkan"]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal menambahkan pengguna: " . $e->getMessage()]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Metode request tidak diizinkan"]);
    }
} elseif (preg_match('#^/users/(\d+)$#', $route, $matches)) {
    $id = $matches[1];
    
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $username = isset($input['username']) ? trim($input['username']) : '';
        $role = isset($input['role']) ? trim($input['role']) : '';
        $password = isset($input['password']) ? $input['password'] : '';
        
        $normalizedRole = normalizeUserRole($role);
        
        if (!$username || !$normalizedRole) {
            http_response_code(400);
            echo json_encode(["message" => "Nama pengguna dan peran wajib diisi"]);
            exit();
        }
        
        $allowedRoles = ["Admin", "Staff", "Anak PKL"];
        if (!in_array($normalizedRole, $allowedRoles)) {
            http_response_code(400);
            echo json_encode(["message" => "Peran tidak valid"]);
            exit();
        }
        
        try {
            // Check username conflict excluding current id
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id <> ?");
            $stmt->execute([$username, $id]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["message" => "Nama pengguna sudah digunakan"]);
                exit();
            }
            
            if ($password) {
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $updateStmt = $pdo->prepare("UPDATE users SET username = ?, role = ?, password = ? WHERE id = ?");
                $updateStmt->execute([$username, $normalizedRole, $hashedPassword, $id]);
            } else {
                $updateStmt = $pdo->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
                $updateStmt->execute([$username, $normalizedRole, $id]);
            }
            
            // Get updated user data
            $fetchStmt = $pdo->prepare("SELECT id, username, role, created_at FROM users WHERE id = ? LIMIT 1");
            $fetchStmt->execute([$id]);
            $updatedUser = $fetchStmt->fetch();
            
            if ($updatedUser) {
                $updatedUser['role'] = mapRoleOutput($updatedUser['role']);
            }
            
            echo json_encode([
                "message" => "Pengguna berhasil diperbarui",
                "user" => $updatedUser
            ]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal memperbarui pengguna: " . $e->getMessage()]);
        }
        
    } elseif ($method === 'DELETE') {
        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Pengguna berhasil dihapus"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal menghapus pengguna: " . $e->getMessage()]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Metode request tidak diizinkan"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "Route tidak ditemukan"]);
}
