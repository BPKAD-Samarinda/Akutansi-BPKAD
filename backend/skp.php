<?php
// api/skp.php

require_once __DIR__ . '/config.php';

// Authenticate token
$currentUser = authenticateToken();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to clean up uploaded file on error
function cleanupSkpFile($filePath) {
    if (!$filePath) return;
    $fullPath = __DIR__ . '/' . ltrim($filePath, '/');
    if (file_exists($fullPath)) {
        @unlink($fullPath);
    }
}

// Ensure columns and history table exist in database
function ensureSkpDbStructure($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS skp_documents (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            nama_skp VARCHAR(255) NOT NULL,
            triwulan TINYINT NOT NULL,
            tahun INT NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            uploaded_by VARCHAR(255) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    $stmt = $pdo->query("SHOW COLUMNS FROM skp_documents");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $columnSet = array_map('strtolower', $columns);
    
    if (!in_array('is_deleted', $columnSet)) {
        $pdo->exec("ALTER TABLE skp_documents ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0");
    }
    if (!in_array('deleted_at', $columnSet)) {
        $pdo->exec("ALTER TABLE skp_documents ADD COLUMN deleted_at DATETIME NULL");
    }
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS skp_history (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            skp_document_id BIGINT NULL,
            action_type VARCHAR(20) NOT NULL,
            actor_username VARCHAR(255) NULL,
            actor_role VARCHAR(50) NULL,
            target_uploaded_by VARCHAR(255) NULL,
            before_data TEXT NULL,
            after_data TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_skp_history_action_type (action_type),
            INDEX idx_skp_history_actor_username (actor_username),
            INDEX idx_skp_history_target_uploaded_by (target_uploaded_by),
            INDEX idx_skp_history_created_at (created_at)
        )
    ");
}

ensureSkpDbStructure($pdo);

$allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif"
];

// Helper to handle SKP file upload
function handleSkpUpload($fileInput, $allowedMimeTypes) {
    if (!isset($fileInput) || $fileInput['error'] !== UPLOAD_ERR_OK) {
        return ["error" => "Unggah berkas gagal. Silakan periksa apakah ukuran berkas di bawah 30MB."];
    }
    
    // Validate size first
    if ($fileInput['size'] > 30 * 1024 * 1024) {
        return ["error" => "Ukuran file terlalu besar. Maksimal ukuran file adalah 30MB."];
    }
    
    // Check extension
    $ext = strtolower(pathinfo($fileInput['name'], PATHINFO_EXTENSION));
    $allowedExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "png", "jpg", "jpeg", "heic", "heif"];
    if (!in_array($ext, $allowedExts)) {
        return ["error" => "Tipe file tidak didukung. Hanya PDF, Word, Excel, PowerPoint, dan gambar yang diizinkan."];
    }
    
    // Verify ACTUAL MIME type from file magic bytes (prevents malicious file rename attacks)
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $realMime = finfo_file($finfo, $fileInput['tmp_name']);
        finfo_close($finfo);
        if (!in_array($realMime, $allowedMimeTypes)) {
            return ["error" => "Tipe file tidak valid."];
        }
    }
    
    $uploadDir = __DIR__ . '/uploads/skp';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $uniqueSuffix = time() . "-" . bin2hex(random_bytes(8));
    $filename = "file-" . $uniqueSuffix . "." . $ext;
    $targetPath = $uploadDir . '/' . $filename;
    
    if (is_uploaded_file($fileInput['tmp_name'])) {
        if (!move_uploaded_file($fileInput['tmp_name'], $targetPath)) {
            return ["error" => "Gagal menyimpan berkas di server."];
        }
    } else {
        if (!rename($fileInput['tmp_name'], $targetPath)) {
            return ["error" => "Gagal menyimpan berkas di server."];
        }
    }
    
    return ["success" => true, "file_path" => "uploads/skp/" . $filename];
}

// Router for SKP
if ($route === '/skp') {
    if ($method === 'GET') {
        authorizeRoles($currentUser, "Admin", "Staff", "Anak PKL", "Admin Akuntansi", "Staff Akuntansi");
        
        $triwulan = isset($_GET['triwulan']) ? intval($_GET['triwulan']) : null;
        $tahun = isset($_GET['tahun']) ? intval($_GET['tahun']) : null;
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $uploader_name = isset($_GET['uploader_name']) ? trim($_GET['uploader_name']) : '';
        
        $isAdminRole = ($currentUser['role'] === 'Admin' || $currentUser['role'] === 'Admin Akuntansi');
        $actorName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : '-');
        
        try {
            $sql = "SELECT id, nama_skp, triwulan, tahun, file_path, uploaded_by, created_at FROM skp_documents WHERE is_deleted = 0";
            $params = [];
            
            if (!$isAdminRole) {
                $sql .= " AND uploaded_by = ?";
                $params[] = $actorName;
            }
            
            if ($triwulan !== null && $triwulan > 0) {
                $sql .= " AND triwulan = ?";
                $params[] = $triwulan;
            }
            
            if ($tahun !== null && $tahun > 0) {
                $sql .= " AND tahun = ?";
                $params[] = $tahun;
            }
            
            if ($search !== '') {
                $sql .= " AND LOWER(nama_skp) LIKE ?";
                $params[] = '%' . strtolower($search) . '%';
            }
            
            if ($uploader_name !== '' && $isAdminRole) {
                $sql .= " AND LOWER(uploaded_by) LIKE ?";
                $params[] = '%' . strtolower($uploader_name) . '%';
            }
            
            $sql .= " ORDER BY created_at DESC, id DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll());
            
        } catch (PDOException $e) {
            serverError($e);
        }
        
    } elseif ($method === 'POST') {
        authorizeRoles($currentUser, "Admin", "Staff", "Anak PKL", "Admin Akuntansi", "Staff Akuntansi");
        
        $nama_skp = isset($_POST['nama_skp']) ? trim($_POST['nama_skp']) : '';
        $triwulan = isset($_POST['triwulan']) ? intval($_POST['triwulan']) : 0;
        $tahun = isset($_POST['tahun']) ? intval($_POST['tahun']) : 0;
        $target_user = isset($_POST['target_user']) ? trim($_POST['target_user']) : '';
        
        $actorName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        $actorRole = isset($currentUser['role']) ? $currentUser['role'] : '';
        $isAdminRole = ($currentUser['role'] === 'Admin' || $currentUser['role'] === 'Admin Akuntansi');
        
        $finalUploadedBy = $actorName;
        if ($isAdminRole && !empty($target_user)) {
            $finalUploadedBy = $target_user;
        }
        
        if (empty($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(["message" => "Berkas wajib diunggah."]);
            exit();
        }
        
        $uploadResult = handleSkpUpload($_FILES['file'], $allowedMimeTypes);
        if (isset($uploadResult['error'])) {
            http_response_code(400);
            echo json_encode(["message" => $uploadResult['error']]);
            exit();
        }
        
        $file_path = $uploadResult['file_path'];
        
        if (!$nama_skp || !$triwulan || !$tahun) {
            cleanupSkpFile($file_path);
            http_response_code(400);
            echo json_encode(["message" => "Nama SKP, triwulan, dan tahun wajib diisi."]);
            exit();
        }
        
        try {
            $stmt = $pdo->prepare("INSERT INTO skp_documents (nama_skp, triwulan, tahun, file_path, uploaded_by) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$nama_skp, $triwulan, $tahun, $file_path, $finalUploadedBy]);
            $skpId = $pdo->lastInsertId();
            
            // Log history
            $afterData = [
                "id" => $skpId,
                "nama_skp" => $nama_skp,
                "triwulan" => $triwulan,
                "tahun" => $tahun,
                "file_path" => $file_path,
                "uploaded_by" => $finalUploadedBy
            ];
            
            $histStmt = $pdo->prepare("INSERT INTO skp_history (skp_document_id, action_type, actor_username, actor_role, target_uploaded_by, after_data) VALUES (?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $skpId,
                "upload",
                $actorName,
                $actorRole,
                $finalUploadedBy,
                json_encode($afterData)
            ]);
            
            echo json_encode(["message" => "SKP Document created successfully"]);
            
        } catch (PDOException $e) {
            cleanupSkpFile($file_path);
            serverError($e);
        }
    }
} elseif ($route === '/skp/history') {
    if ($method === 'GET') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        $action = isset($_GET['action']) ? trim($_GET['action']) : '';
        $staff = isset($_GET['staff']) ? trim($_GET['staff']) : '';
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $startDate = isset($_GET['startDate']) ? trim($_GET['startDate']) : '';
        $endDate = isset($_GET['endDate']) ? trim($_GET['endDate']) : '';
        
        try {
            $sql = "SELECT * FROM skp_history WHERE 1=1";
            $params = [];
            
            if ($action !== '') {
                $sql .= " AND action_type = ?";
                $params[] = $action;
            }
            
            if ($staff !== '') {
                $sql .= " AND actor_username = ?";
                $params[] = $staff;
            }
            
            if ($startDate !== '') {
                $sql .= " AND created_at >= ?";
                $params[] = $startDate . " 00:00:00";
            }
            
            if ($endDate !== '') {
                $sql .= " AND created_at <= ?";
                $params[] = $endDate . " 23:59:59";
            }
            
            $sql .= " ORDER BY created_at DESC, id DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();
            
            // Post filter search inside JSON
            if ($search !== '') {
                $rows = array_filter($rows, function($row) use ($search) {
                    $before = json_decode($row['before_data'] ?? '', true);
                    $after = json_decode($row['after_data'] ?? '', true);
                    $name = isset($after['nama_skp']) ? $after['nama_skp'] : (isset($before['nama_skp']) ? $before['nama_skp'] : '');
                    return strpos(strtolower($name), strtolower($search)) !== false;
                });
                $rows = array_values($rows);
            }
            
            echo json_encode($rows);
            
        } catch (PDOException $e) {
            serverError($e);
        }
    }
} elseif (preg_match('#^/skp/(\d+)$#', $route, $matches)) {
    $id = $matches[1];
    
    if ($method === 'PUT') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        $putData = parseMultipartPut();
        $post = $putData['post'];
        $files = $putData['files'];
        
        $nama_skp = isset($post['nama_skp']) ? trim($post['nama_skp']) : '';
        $triwulan = isset($post['triwulan']) ? intval($post['triwulan']) : 0;
        $tahun = isset($post['tahun']) ? intval($post['tahun']) : 0;
        $target_user = isset($post['target_user']) ? trim($post['target_user']) : '';
        
        $actorName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        $actorRole = isset($currentUser['role']) ? $currentUser['role'] : '';
        $isAdminRole = ($currentUser['role'] === 'Admin' || $currentUser['role'] === 'Admin Akuntansi');
        
        if (!$nama_skp || !$triwulan || !$tahun) {
            http_response_code(400);
            echo json_encode(["message" => "Nama SKP, triwulan, dan tahun wajib diisi."]);
            exit();
        }
        
        try {
            // Get existing
            $stmt = $pdo->prepare("SELECT * FROM skp_documents WHERE id = ? AND is_deleted = 0");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["message" => "SKP Document not found"]);
                exit();
            }
            
            $newFilePath = null;
            if (!empty($files['file'])) {
                $uploadResult = handleSkpUpload($files['file'], $allowedMimeTypes);
                if (isset($uploadResult['error'])) {
                    http_response_code(400);
                    echo json_encode(["message" => $uploadResult['error']]);
                    exit();
                }
                $newFilePath = $uploadResult['file_path'];
                
                // Delete old file
                if ($existing['file_path']) {
                    $oldFullPath = __DIR__ . '/' . ltrim($existing['file_path'], '/');
                    if (file_exists($oldFullPath)) {
                        @unlink($oldFullPath);
                    }
                }
            }
            
            $finalUploadedBy = $existing['uploaded_by'];
            if ($isAdminRole && !empty($target_user)) {
                $finalUploadedBy = $target_user;
            }
            
            // Update
            if ($newFilePath) {
                $updateStmt = $pdo->prepare("UPDATE skp_documents SET nama_skp = ?, triwulan = ?, tahun = ?, file_path = ?, uploaded_by = ? WHERE id = ?");
                $updateStmt->execute([$nama_skp, $triwulan, $tahun, $newFilePath, $finalUploadedBy, $id]);
            } else {
                $updateStmt = $pdo->prepare("UPDATE skp_documents SET nama_skp = ?, triwulan = ?, tahun = ?, uploaded_by = ? WHERE id = ?");
                $updateStmt->execute([$nama_skp, $triwulan, $tahun, $finalUploadedBy, $id]);
            }
            
            $finalFilePath = $newFilePath ?: $existing['file_path'];
            
            $beforeData = $existing;
            $afterData = [
                "id" => $id,
                "nama_skp" => $nama_skp,
                "triwulan" => $triwulan,
                "tahun" => $tahun,
                "file_path" => $finalFilePath,
                "uploaded_by" => $finalUploadedBy
            ];
            
            // Log history
            $histStmt = $pdo->prepare("INSERT INTO skp_history (skp_document_id, action_type, actor_username, actor_role, target_uploaded_by, before_data, after_data) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $id,
                "edit",
                $actorName,
                $actorRole,
                $finalUploadedBy,
                json_encode($beforeData),
                json_encode($afterData)
            ]);
            
            echo json_encode(["message" => "SKP Document updated successfully"]);
            
        } catch (PDOException $e) {
            if ($newFilePath) {
                cleanupSkpFile($newFilePath);
            }
            serverError($e);
        }
        
    } elseif ($method === 'DELETE') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        $actorName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        $actorRole = isset($currentUser['role']) ? $currentUser['role'] : '';
        
        try {
            $stmt = $pdo->prepare("SELECT * FROM skp_documents WHERE id = ? AND is_deleted = 0");
            $stmt->execute([$id]);
            $doc = $stmt->fetch();
            
            if (!$doc) {
                http_response_code(404);
                echo json_encode(["message" => "SKP Document not found"]);
                exit();
            }
            
            // Update to deleted
            $delStmt = $pdo->prepare("UPDATE skp_documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?");
            $delStmt->execute([$id]);
            
            // Log history
            $histStmt = $pdo->prepare("INSERT INTO skp_history (skp_document_id, action_type, actor_username, actor_role, target_uploaded_by, before_data) VALUES (?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $id,
                "delete",
                $actorName,
                $actorRole,
                $doc['uploaded_by'],
                json_encode($doc)
            ]);
            
            echo json_encode(["message" => "SKP Document deleted successfully"]);
            
        } catch (PDOException $e) {
            serverError($e);
        }
    }
}
