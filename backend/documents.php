<?php
// api/documents.php

require_once __DIR__ . '/config.php';

// Authenticate token
$currentUser = authenticateToken();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to format file size
function formatFileSize($bytes) {
    if (!$bytes || is_nan($bytes)) return "-";
    $kb = $bytes / 1024;
    if ($kb < 1024) return number_format($kb, 1) . " KB";
    $mb = $kb / 1024;
    return number_format($mb, 2) . " MB";
}

// Helper to clean up uploaded file on error
function cleanupUploadedFile($filePath) {
    if (!$filePath) return;
    $fullPath = __DIR__ . '/' . ltrim($filePath, '/');
    if (file_exists($fullPath)) {
        @unlink($fullPath);
    }
}

// Ensure columns exists in db
function ensureSoftDeleteColumns($pdo) {
    // Check if columns exist
    $stmt = $pdo->query("SHOW COLUMNS FROM documents");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $columnSet = array_map('strtolower', $columns);
    
    if (!in_array('is_deleted', $columnSet)) {
        $pdo->exec("ALTER TABLE documents ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0");
    }
    if (!in_array('deleted_at', $columnSet)) {
        $pdo->exec("ALTER TABLE documents ADD COLUMN deleted_at DATETIME NULL");
    }
    if (!in_array('uploaded_by', $columnSet)) {
        $pdo->exec("ALTER TABLE documents ADD COLUMN uploaded_by VARCHAR(255) NULL");
    }
}

function ensureDocumentHistoryTable($pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS document_history (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            document_id BIGINT NULL,
            document_name VARCHAR(255) NOT NULL,
            uploaded_by VARCHAR(255) NULL,
            status VARCHAR(20) NOT NULL,
            file_path VARCHAR(255) NULL,
            file_size VARCHAR(50) NULL,
            edit_before TEXT NULL,
            edit_after TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_document_history_created_at (created_at),
            INDEX idx_document_history_status (status)
        )
    ");
}

ensureSoftDeleteColumns($pdo);
ensureDocumentHistoryTable($pdo);

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

// Helper to handle single file upload
function handleFileUpload($fileInput, $allowedMimeTypes) {
    if (!isset($fileInput) || $fileInput['error'] !== UPLOAD_ERR_OK) {
        return ["error" => "Unggah berkas gagal. Silakan periksa apakah ukuran berkas di bawah 30MB."];
    }
    
    // Check file extension just in case mime type is reported incorrectly by browser
    $ext = strtolower(pathinfo($fileInput['name'], PATHINFO_EXTENSION));
    $allowedExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "png", "jpg", "jpeg", "heic", "heif"];
    if (!in_array($ext, $allowedExts) && !in_array($fileInput['type'], $allowedMimeTypes)) {
        return ["error" => "Tipe file tidak didukung."];
    }
    
    if ($fileInput['size'] > 30 * 1024 * 1024) {
        return ["error" => "Ukuran file terlalu besar. Maksimal ukuran file adalah 30MB."];
    }
    
    // Create uploads directory if not exists
    $uploadDir = __DIR__ . '/uploads/documents';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Generate unique name
    $ext = pathinfo($fileInput['name'], PATHINFO_EXTENSION);
    $uniqueSuffix = time() . "-" . rand(100000000, 999999999);
    $filename = "file-" . $uniqueSuffix . "." . $ext;
    $targetPath = $uploadDir . '/' . $filename;
    
    // Move from temp
    // If it's a PUT request, it's not is_uploaded_file, so use rename/copy instead of move_uploaded_file
    if (is_uploaded_file($fileInput['tmp_name'])) {
        if (!move_uploaded_file($fileInput['tmp_name'], $targetPath)) {
            return ["error" => "Gagal menyimpan berkas di server."];
        }
    } else {
        if (!rename($fileInput['tmp_name'], $targetPath)) {
            return ["error" => "Gagal menyimpan berkas di server."];
        }
    }
    
    return ["success" => true, "file_path" => "uploads/documents/" . $filename, "file_size" => $fileInput['size']];
}

// Router for documents
if ($route === '/documents') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query("SELECT * FROM documents WHERE is_deleted = 0 ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll());
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Terjadi kesalahan pada server: " . $e->getMessage()]);
        }
    } elseif ($method === 'POST') {
        // Only Admin, Staff, Anak PKL, Admin Akuntansi, Staff Akuntansi
        authorizeRoles($currentUser, "Admin", "Staff", "Anak PKL", "Admin Akuntansi", "Staff Akuntansi");
        
        $nama_sppd = isset($_POST['nama_sppd']) ? trim($_POST['nama_sppd']) : '';
        $tanggal_sppd = isset($_POST['tanggal_sppd']) ? trim($_POST['tanggal_sppd']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $uploaderName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        
        if (empty($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(["message" => "Berkas dokumen wajib diunggah."]);
            exit();
        }
        
        $uploadResult = handleFileUpload($_FILES['file'], $allowedMimeTypes);
        if (isset($uploadResult['error'])) {
            http_response_code(400);
            echo json_encode(["message" => $uploadResult['error']]);
            exit();
        }
        
        $file_path = $uploadResult['file_path'];
        
        if (!$nama_sppd || !$tanggal_sppd || !$kategori) {
            cleanupUploadedFile($file_path);
            http_response_code(400);
            echo json_encode(["message" => "Seluruh kolom teks wajib diisi."]);
            exit();
        }
        
        try {
            // Check duplicates
            $stmt = $pdo->prepare("SELECT id FROM documents WHERE nama_sppd = ? AND tanggal_sppd = ? AND is_deleted = 0 LIMIT 1");
            $stmt->execute([$nama_sppd, $tanggal_sppd]);
            if ($stmt->fetch()) {
                cleanupUploadedFile($file_path);
                http_response_code(409);
                echo json_encode(["message" => "Dokumen dengan nama dan tanggal yang sama sudah ada."]);
                exit();
            }
            
            // Insert
            $insertStmt = $pdo->prepare("INSERT INTO documents (nama_sppd, tanggal_sppd, kategori, file_path, uploaded_by) VALUES (?, ?, ?, ?, ?)");
            $insertStmt->execute([$nama_sppd, $tanggal_sppd, $kategori, $file_path, $uploaderName]);
            $documentId = $pdo->lastInsertId();
            
            // Log history
            $histStmt = $pdo->prepare("INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size) VALUES (?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $documentId,
                $nama_sppd,
                $uploaderName,
                "diunggah",
                $file_path,
                formatFileSize($uploadResult['file_size'])
            ]);
            
            http_response_code(201);
            echo json_encode(["message" => "Document created successfully", "data" => ["insertId" => $documentId]]);
            
        } catch (PDOException $e) {
            cleanupUploadedFile($file_path);
            http_response_code(500);
            echo json_encode(["message" => "Gagal mengunggah dokumen: " . $e->getMessage()]);
        }
    }
} elseif (preg_match('#^/documents/(\d+)$#', $route, $matches)) {
    $id = $matches[1];
    
    if ($method === 'PUT') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        // Parse Multipart PUT
        $putData = parseMultipartPut();
        $post = $putData['post'];
        $files = $putData['files'];
        
        $nama_sppd = isset($post['nama_sppd']) ? trim($post['nama_sppd']) : '';
        $tanggal_sppd = isset($post['tanggal_sppd']) ? trim($post['tanggal_sppd']) : '';
        $kategori = isset($post['kategori']) ? trim($post['kategori']) : '';
        $uploaderName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        
        if (!$nama_sppd || !$tanggal_sppd || !$kategori) {
            http_response_code(400);
            echo json_encode(["message" => "Semua kolom teks wajib diisi."]);
            exit();
        }
        
        try {
            // Get existing document
            $stmt = $pdo->prepare("SELECT id, nama_sppd, kategori, tanggal_sppd, file_path FROM documents WHERE id = ? AND is_deleted = 0");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["message" => "Document not found"]);
                exit();
            }
            
            $newFilePath = null;
            $fileSize = null;
            
            if (!empty($files['file'])) {
                $uploadResult = handleFileUpload($files['file'], $allowedMimeTypes);
                if (isset($uploadResult['error'])) {
                    http_response_code(400);
                    echo json_encode(["message" => $uploadResult['error']]);
                    exit();
                }
                
                $newFilePath = $uploadResult['file_path'];
                $fileSize = $uploadResult['file_size'];
                
                // Delete old file
                if ($existing['file_path']) {
                    $oldFullPath = __DIR__ . '/' . ltrim($existing['file_path'], '/');
                    if (file_exists($oldFullPath)) {
                        @unlink($oldFullPath);
                    }
                }
            }
            
            // Update
            if ($newFilePath) {
                $updateStmt = $pdo->prepare("UPDATE documents SET nama_sppd = ?, tanggal_sppd = ?, kategori = ?, file_path = ? WHERE id = ? AND is_deleted = 0");
                $updateStmt->execute([$nama_sppd, $tanggal_sppd, $kategori, $newFilePath, $id]);
            } else {
                $updateStmt = $pdo->prepare("UPDATE documents SET nama_sppd = ?, tanggal_sppd = ?, kategori = ? WHERE id = ? AND is_deleted = 0");
                $updateStmt->execute([$nama_sppd, $tanggal_sppd, $kategori, $id]);
            }
            
            $finalFilePath = $newFilePath ?: $existing['file_path'];
            
            // Log edit history
            $editBefore = [
                "nama_sppd" => $existing['nama_sppd'] ?? "",
                "kategori" => $existing['kategori'] ?? "",
                "tanggal_sppd" => $existing['tanggal_sppd'] ?? "",
                "file_path" => $existing['file_path'] ?? ""
            ];
            $editAfter = [
                "nama_sppd" => $nama_sppd,
                "kategori" => $kategori,
                "tanggal_sppd" => $tanggal_sppd,
                "file_path" => $finalFilePath
            ];
            
            $histStmt = $pdo->prepare("INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size, edit_before, edit_after) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $id,
                $nama_sppd,
                $uploaderName,
                "diedit",
                $newFilePath,
                $fileSize ? formatFileSize($fileSize) : "-",
                json_encode($editBefore),
                json_encode($editAfter)
            ]);
            
            echo json_encode(["message" => "Document updated successfully"]);
            
        } catch (PDOException $e) {
            if ($newFilePath) {
                cleanupUploadedFile($newFilePath);
            }
            http_response_code(500);
            echo json_encode(["message" => "Gagal memperbarui dokumen: " . $e->getMessage()]);
        }
        
    } elseif ($method === 'DELETE') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        $actorName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : null);
        
        try {
            $stmt = $pdo->prepare("SELECT id, is_deleted, nama_sppd, file_path FROM documents WHERE id = ?");
            $stmt->execute([$id]);
            $doc = $stmt->fetch();
            
            if (!$doc) {
                http_response_code(404);
                echo json_encode(["message" => "Document not found"]);
                exit();
            }
            
            if ($doc['is_deleted'] == 1) {
                echo json_encode(["message" => "Document already deleted"]);
                exit();
            }
            
            // Insert history deleted
            $histStmt = $pdo->prepare("INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size) VALUES (?, ?, ?, ?, ?, ?)");
            $histStmt->execute([
                $id,
                $doc['nama_sppd'] ?: "Dokumen #" . $id,
                $actorName,
                "dihapus",
                $doc['file_path'],
                "-"
            ]);
            
            // Update to deleted
            $delStmt = $pdo->prepare("UPDATE documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?");
            $delStmt->execute([$id]);
            
            echo json_encode(["message" => "Document moved to upload history"]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal menghapus dokumen: " . $e->getMessage()]);
        }
    }
} elseif ($route === '/documents/history') {
    if ($method === 'GET') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        $page = isset($_GET['page']) ? max(intval($_GET['page']), 1) : 1;
        $limit = isset($_GET['limit']) ? max(intval($_GET['limit']), 1) : 10;
        $search = isset($_GET['search']) ? strtolower(trim($_GET['search'])) : '';
        $status = isset($_GET['status']) ? strtolower(trim($_GET['status'])) : 'all';
        
        try {
            // Ensure SKP history table exists
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
            
            // Fetch document history
            $stmt = $pdo->query("
                SELECT h.id, h.document_id, h.document_name, h.uploaded_by, h.status, h.file_path, h.file_size, h.created_at, h.edit_before, h.edit_after, d.tanggal_sppd 
                FROM document_history h
                LEFT JOIN documents d ON h.document_id = d.id
                ORDER BY h.created_at DESC, h.id DESC
            ");
            $docHist = $stmt->fetchAll();
            
            $mappedDocHist = [];
            foreach ($docHist as $row) {
                $docDate = $row['tanggal_sppd'] ?: null;
                if (!$docDate && $row['edit_after']) {
                    $after = json_decode($row['edit_after'], true);
                    $docDate = isset($after['tanggal_sppd']) ? $after['tanggal_sppd'] : null;
                }
                if (!$docDate && $row['edit_before']) {
                    $before = json_decode($row['edit_before'], true);
                    $docDate = isset($before['tanggal_sppd']) ? $before['tanggal_sppd'] : null;
                }

                $mappedDocHist[] = [
                    "id" => $row['id'],
                    "document_name" => $row['document_name'],
                    "uploaded_at" => $row['created_at'],
                    "uploaded_by" => $row['uploaded_by'] ?: "-",
                    "file_size" => $row['file_size'] ?: "-",
                    "file_path" => $row['file_path'] ?: "",
                    "status" => $row['status'] ?: "diunggah",
                    "edit_before" => $row['edit_before'],
                    "edit_after" => $row['edit_after'],
                    "isDeleted" => (strtolower($row['status']) === 'dihapus'),
                    "source" => "document",
                    "canRestore" => (strtolower($row['status']) === 'dihapus'),
                    "document_date" => $docDate
                ];
            }
            
            // Fetch SKP history
            $uploaderName = isset($currentUser['username']) ? $currentUser['username'] : (isset($currentUser['role']) ? $currentUser['role'] : '-');
            $isAdminRole = ($currentUser['role'] === 'Admin' || $currentUser['role'] === 'Admin Akuntansi');
            
            if ($isAdminRole) {
                $skpStmt = $pdo->query("SELECT id, skp_document_id, action_type, actor_username, target_uploaded_by, before_data, after_data, created_at FROM skp_history ORDER BY created_at DESC, id DESC");
            } else {
                $skpStmt = $pdo->prepare("SELECT id, skp_document_id, action_type, actor_username, target_uploaded_by, before_data, after_data, created_at FROM skp_history WHERE target_uploaded_by = ? ORDER BY created_at DESC, id DESC");
                $skpStmt->execute([$uploaderName]);
            }
            $skpHist = $skpStmt->fetchAll();
            
            $mappedSkpHist = [];
            foreach ($skpHist as $row) {
                $before = json_decode($row['before_data'] ?? '', true);
                $after = json_decode($row['after_data'] ?? '', true);
                
                $action = strtolower($row['action_type']);
                $statusValue = 'diunggah';
                if ($action === 'edit') $statusValue = 'diedit';
                if ($action === 'delete') $statusValue = 'dihapus';
                
                $skpName = isset($after['nama_skp']) ? $after['nama_skp'] : (isset($before['nama_skp']) ? $before['nama_skp'] : "Dokumen SKP #" . ($row['skp_document_id'] ?: $row['id']));
                $filePath = isset($after['file_path']) ? $after['file_path'] : (isset($before['file_path']) ? $before['file_path'] : "");
                
                $triwulan = isset($after['triwulan']) ? $after['triwulan'] : (isset($before['triwulan']) ? $before['triwulan'] : null);
                $docDate = $triwulan ? "Triwulan {$triwulan}" : null;

                $mappedSkpHist[] = [
                    "id" => "skp-" . $row['id'],
                    "document_name" => $skpName,
                    "uploaded_at" => $row['created_at'],
                    "uploaded_by" => $row['actor_username'] ?: ($row['target_uploaded_by'] ?: "-"),
                    "file_size" => "-",
                    "file_path" => $filePath,
                    "status" => $statusValue,
                    "edit_before" => $row['before_data'],
                    "edit_after" => $row['after_data'],
                    "isDeleted" => ($statusValue === 'dihapus'),
                    "source" => "skp",
                    "canRestore" => ($statusValue === 'dihapus'),
                    "document_date" => $docDate
                ];
            }
            
            // Merge & sort
            $merged = array_merge($mappedDocHist, $mappedSkpHist);
            usort($merged, function($a, $b) {
                $timeA = strtotime($a['uploaded_at']);
                $timeB = strtotime($b['uploaded_at']);
                if ($timeA === $timeB) {
                    return strcmp($b['id'], $a['id']);
                }
                return $timeB - $timeA;
            });
            
            // Status filter
            if ($status !== 'all') {
                $merged = array_filter($merged, function($item) use ($status) {
                    return strtolower($item['status']) === $status;
                });
            }
            
            // Search filter
            if ($search !== '') {
                $merged = array_filter($merged, function($item) use ($search) {
                    return strpos(strtolower($item['document_name']), $search) !== false;
                });
            }
            
            // Re-index array
            $merged = array_values($merged);
            
            // Pagination
            $total = count($merged);
            $start = ($page - 1) * $limit;
            $items = array_slice($merged, $start, $limit);
            
            echo json_encode([
                "items" => $items,
                "total" => $total,
                "page" => $page,
                "limit" => $limit
            ]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal mengambil riwayat: " . $e->getMessage()]);
        }
    }
} elseif (preg_match('#^/documents/history/([^/]+)/restore$#', $route, $matches)) {
    $id = $matches[1];
    
    if ($method === 'POST') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        try {
            if (strpos($id, 'skp-') === 0) {
                $historyId = substr($id, 4);
                $stmt = $pdo->prepare("SELECT * FROM skp_history WHERE id = ?");
                $stmt->execute([$historyId]);
                $history = $stmt->fetch();
                
                if (!$history) {
                    http_response_code(404);
                    echo json_encode(["message" => "History item not found"]);
                    exit();
                }
                
                if (strtolower($history['action_type']) !== 'delete') {
                    http_response_code(400);
                    echo json_encode(["message" => "Document is not in history"]);
                    exit();
                }
                
                $skpStmt = $pdo->prepare("UPDATE skp_documents SET is_deleted = 0, deleted_at = NULL WHERE id = ?");
                $skpStmt->execute([$history['skp_document_id']]);
                
                // Delete history log
                $delHist = $pdo->prepare("DELETE FROM skp_history WHERE id = ?");
                $delHist->execute([$historyId]);
                
                echo json_encode(["message" => "SKP Document restored successfully"]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM document_history WHERE id = ?");
                $stmt->execute([$id]);
                $history = $stmt->fetch();
                
                if (!$history) {
                    http_response_code(404);
                    echo json_encode(["message" => "History item not found"]);
                    exit();
                }
                
                if (strtolower($history['status']) !== 'dihapus') {
                    http_response_code(400);
                    echo json_encode(["message" => "Document is not in history"]);
                    exit();
                }
                
                $docId = $history['document_id'];
                if (!$docId) {
                    http_response_code(404);
                    echo json_encode(["message" => "Document not found"]);
                    exit();
                }
                
                $restoreStmt = $pdo->prepare("UPDATE documents SET is_deleted = 0, deleted_at = NULL WHERE id = ?");
                $restoreStmt->execute([$docId]);
                
                $updateHist = $pdo->prepare("DELETE FROM document_history WHERE id = ?");
                $updateHist->execute([$id]);
                
                echo json_encode(["message" => "Document restored successfully"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal merestorasi dokumen: " . $e->getMessage()]);
        }
    }
} elseif (preg_match('#^/documents/history/([^/]+)$#', $route, $matches)) {
    $id = $matches[1];
    
    if ($method === 'DELETE') {
        authorizeRoles($currentUser, "Admin", "Admin Akuntansi");
        
        try {
            if (strpos($id, 'skp-') === 0) {
                $historyId = substr($id, 4);
                $stmt = $pdo->prepare("SELECT * FROM skp_history WHERE id = ?");
                $stmt->execute([$historyId]);
                $history = $stmt->fetch();
                
                if (!$history) {
                    http_response_code(404);
                    echo json_encode(["message" => "History item not found"]);
                    exit();
                }
                
                $skpDocId = $history['skp_document_id'];
                $filePath = null;
                
                if ($skpDocId) {
                    $skpStmt = $pdo->prepare("SELECT file_path FROM skp_documents WHERE id = ?");
                    $skpStmt->execute([$skpDocId]);
                    $skpDoc = $skpStmt->fetch();
                    if ($skpDoc) {
                        $filePath = $skpDoc['file_path'];
                    }
                }
                
                if (!$filePath && $history['before_data']) {
                    $before = json_decode($history['before_data'], true);
                    $filePath = isset($before['file_path']) ? $before['file_path'] : null;
                }
                
                // Delete physical file
                if ($filePath) {
                    cleanupUploadedFile($filePath);
                }
                
                if ($skpDocId) {
                    $delDoc = $pdo->prepare("DELETE FROM skp_documents WHERE id = ? AND is_deleted = 1");
                    $delDoc->execute([$skpDocId]);
                    
                    $delHist = $pdo->prepare("DELETE FROM skp_history WHERE skp_document_id = ?");
                    $delHist->execute([$skpDocId]);
                } else {
                    $delHist = $pdo->prepare("DELETE FROM skp_history WHERE id = ?");
                    $delHist->execute([$historyId]);
                }
                
                echo json_encode(["message" => "SKP Document permanently deleted successfully"]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM document_history WHERE id = ?");
                $stmt->execute([$id]);
                $history = $stmt->fetch();
                
                if (!$history) {
                    http_response_code(404);
                    echo json_encode(["message" => "History item not found"]);
                    exit();
                }
                
                if (strtolower($history['status']) !== 'dihapus') {
                    http_response_code(400);
                    echo json_encode(["message" => "Document must be in history before permanent delete"]);
                    exit();
                }
                
                $docId = $history['document_id'];
                $filePath = $history['file_path'];
                
                // Delete file
                if ($filePath) {
                    cleanupUploadedFile($filePath);
                }
                
                if ($docId) {
                    $delDoc = $pdo->prepare("DELETE FROM documents WHERE id = ? AND is_deleted = 1");
                    $delDoc->execute([$docId]);
                    
                    $delHist = $pdo->prepare("DELETE FROM document_history WHERE document_id = ?");
                    $delHist->execute([$docId]);
                } else {
                    $delHist = $pdo->prepare("DELETE FROM document_history WHERE id = ?");
                    $delHist->execute([$id]);
                }
                
                echo json_encode(["message" => "Document permanently deleted successfully"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Gagal menghapus permanen: " . $e->getMessage()]);
        }
    }
}
