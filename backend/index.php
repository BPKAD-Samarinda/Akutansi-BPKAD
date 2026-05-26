<?php
// api/index.php

require_once __DIR__ . '/config.php';

// Parse the route path
$request_uri = $_SERVER['REQUEST_URI'];
if (($pos = strpos($request_uri, '?')) !== false) {
    $request_uri = substr($request_uri, 0, $pos);
}

// Extract route path after '/backend' or '/api'
$backend_pos = strpos($request_uri, '/backend');
$api_pos = strpos($request_uri, '/api');

if ($backend_pos !== false) {
    $route = substr($request_uri, $backend_pos + 8);
} elseif ($api_pos !== false) {
    $route = substr($request_uri, $api_pos + 4);
} else {
    $route = $request_uri;
}

// Ensure clean format without trailing slash (unless it is just '/')
if ($route !== '/' && substr($route, -1) === '/') {
    $route = substr($route, 0, -1);
}

// Route mapping
if ($route === '/auth/login') {
    require_once __DIR__ . '/auth.php';
} elseif ($route === '/auth/profile') {
    require_once __DIR__ . '/profile.php';
} elseif (strpos($route, '/users') === 0) {
    require_once __DIR__ . '/users.php';
} elseif (strpos($route, '/documents') === 0) {
    require_once __DIR__ . '/documents.php';
} elseif (strpos($route, '/skp') === 0) {
    require_once __DIR__ . '/skp.php';
} elseif ($route === '/dashboard/analytics') {
    require_once __DIR__ . '/dashboard.php';
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint tidak ditemukan."]);
}
