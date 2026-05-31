<?php
// api/heartbeat.php

require_once __DIR__ . '/config.php';

$currentUser = authenticateToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Metode request tidak diizinkan"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$status = isset($input['status']) ? trim($input['status']) : 'online';
$username = $currentUser['username'];

$filePath = sys_get_temp_dir() . '/bpkad_online_users.json';

// Simple file locking to prevent race conditions
$lockPath = $filePath . '.lock';
$lockFile = @fopen($lockPath, 'c');
if ($lockFile) {
    @flock($lockFile, LOCK_EX);
}

$onlineUsers = [];
if (file_exists($filePath)) {
    $content = @file_get_contents($filePath);
    $onlineUsers = json_decode($content, true) ?: [];
}

$now = time();

if ($status === 'offline') {
    if (isset($onlineUsers[$username])) {
        unset($onlineUsers[$username]);
    }
} else {
    $onlineUsers[$username] = $now;
}

// Clean up expired users (inactive for more than 25 seconds)
foreach ($onlineUsers as $user => $lastPing) {
    if ($now - $lastPing > 25) {
        unset($onlineUsers[$user]);
    }
}

@file_put_contents($filePath, json_encode($onlineUsers), LOCK_EX);

if ($lockFile) {
    @flock($lockFile, LOCK_UN);
    @fclose($lockFile);
    @unlink($lockPath);
}

echo json_encode(["status" => "success", "online" => array_keys($onlineUsers)]);
