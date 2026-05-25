<?php
// api/dashboard.php

require_once __DIR__ . '/config.php';

$currentUser = authenticateToken();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Metode request tidak diizinkan"]);
    exit();
}

authorizeRoles($currentUser, "Admin", "Staff", "Anak PKL", "Admin Akuntansi", "Staff Akuntansi");

try {
    // 1. Get documents where is_deleted = 0
    $docStmt = $pdo->query("SELECT id, nama_sppd, kategori, tanggal_sppd, created_at, uploaded_by FROM documents WHERE is_deleted = 0 ORDER BY created_at DESC, id DESC");
    $documents = $docStmt->fetchAll();
    
    // 2. Get SKP documents
    $isAdminRole = ($currentUser['role'] === 'Admin' || $currentUser['role'] === 'Admin Akuntansi');
    $uploaderName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : '-');
    
    if ($isAdminRole) {
        $skpStmt = $pdo->query("SELECT id, nama_skp, triwulan, tahun, created_at, uploaded_by FROM skp_documents WHERE is_deleted = 0 ORDER BY created_at DESC, id DESC");
        $skpDocuments = $skpStmt->fetchAll();
    } else {
        $skpStmt = $pdo->prepare("SELECT id, nama_skp, triwulan, tahun, created_at, uploaded_by FROM skp_documents WHERE uploaded_by = ? AND is_deleted = 0 ORDER BY created_at DESC, id DESC");
        $skpStmt->execute([$uploaderName]);
        $skpDocuments = $skpStmt->fetchAll();
    }
    
    // 3. Get login activities if admin
    $loginActivities = [];
    if ($isAdminRole) {
        try {
            $loginStmt = $pdo->query("SELECT id, username, role, login_at FROM login_activities ORDER BY login_at DESC, id DESC LIMIT 1000");
            $loginActivities = $loginStmt->fetchAll();
        } catch (PDOException $e) {
            // Ignore if table does not exist or fetch fails
        }
    }
    
    // 4. Get total users count
    $userCountStmt = $pdo->query("SELECT COUNT(id) as total FROM users");
    $userCountRow = $userCountStmt->fetch();
    $totalUsers = isset($userCountRow['total']) ? intval($userCountRow['total']) : 0;
    
    echo json_encode([
        "documents" => $documents,
        "skpDocuments" => $skpDocuments,
        "loginActivities" => $loginActivities,
        "totalUsers" => $totalUsers
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Internal server error: " . $e->getMessage()]);
}
