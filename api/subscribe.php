<?php
/**
 * Email Subscription Endpoint
 *
 * Receives: POST { email, guide }
 * Actions: Adds contact to mailing list + sends guide email
 * Returns: JSON { success, message }
 */

header('Content-Type: application/json; charset=utf-8');

// ── Load config ──
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Configuration missing.']);
    exit;
}
$config = require $configFile;

// ── CORS ──
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Parse input ──
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$guide = isset($input['guide']) ? trim($input['guide']) : '';

// ── Validate email ──
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// ── Guide mapping ──
// Add your downloadable resources here
$guides = [
    'example' => [
        'pdf'     => '/assets/pdf/example-guide.pdf',
        'subject' => 'Your guide is ready',
        'title'   => 'Example Guide',
    ],
];

$guideInfo = isset($guides[$guide]) ? $guides[$guide] : null;

// ── Rate limiting (simple file-based) ──
$rateLimitDir = __DIR__ . '/rate-limit';
if (!is_dir($rateLimitDir)) {
    mkdir($rateLimitDir, 0755, true);
}

$ipHash = md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateLimitFile = $rateLimitDir . '/' . $ipHash;
$now = time();

if (file_exists($rateLimitFile)) {
    $lastRequest = (int) file_get_contents($rateLimitFile);
    if ($now - $lastRequest < 10) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Please wait before trying again.']);
        exit;
    }
}
file_put_contents($rateLimitFile, $now);

// ── Step 1: Add contact to mailing service ──
$contactResult = brevoRequest('POST', 'https://api.brevo.com/v3/contacts', $config['api_key'], [
    'email'            => $email,
    'listIds'          => [$config['list_id']],
    'updateEnabled'    => true,
    'attributes'       => [
        'GUIDE_REQUESTED' => $guide ?: 'general',
        'SOURCE'          => 'guide_popup',
    ],
]);

// Contact might already exist (duplicate) — that's fine
if ($contactResult['code'] !== 201 && $contactResult['code'] !== 204) {
    // Check if it's a "contact already exists" error — still OK
    $body = json_decode($contactResult['body'], true);
    if (!isset($body['id']) && strpos($contactResult['body'], 'Contact already exist') === false) {
        error_log('Contact creation failed: ' . $contactResult['body']);
    }
}

// ── Step 2: Send guide email (if guide exists) ──
if ($guideInfo) {
    $downloadUrl = $config['site_url'] . $guideInfo['pdf'];

    $emailHtml = buildGuideEmail($guideInfo['title'], $downloadUrl, $config['site_url']);

    $emailResult = brevoRequest('POST', 'https://api.brevo.com/v3/smtp/email', $config['api_key'], [
        'sender'      => [
            'name'  => $config['sender_name'],
            'email' => $config['sender_email'],
        ],
        'to'          => [['email' => $email]],
        'subject'     => $guideInfo['subject'],
        'htmlContent' => $emailHtml,
        'tags'        => ['guide', $guide],
    ]);

    if ($emailResult['code'] !== 201) {
        error_log('Email send failed: ' . $emailResult['body']);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Send error. Please try again.']);
        exit;
    }
}

// ── Success ──
echo json_encode(['success' => true, 'message' => 'Guide sent successfully.']);
exit;


// ══════════════════════════════════════════════════
//  Helper functions
// ══════════════════════════════════════════════════

function brevoRequest($method, $url, $apiKey, $data = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'api-key: ' . $apiKey,
    ]);
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $code, 'body' => $body];
}


function buildGuideEmail($guideTitle, $downloadUrl, $siteUrl) {
    return '<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="580" cellpadding="0" cellspacing="0" style="background:#FFFFFF;max-width:580px;width:100%;">

<!-- Header -->
<tr><td style="padding:32px 40px 24px;border-bottom:2px solid #800020;">
  <span style="font-size:20px;font-weight:600;color:#1C1917;letter-spacing:0.02em;">Your Business Name</span>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px;">
  <p style="margin:0 0 24px;font-size:15px;color:#6B6560;line-height:1.6;">
    Hello,
  </p>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#1C1917;line-height:1.3;">
    Your guide is ready.
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:#6B6560;line-height:1.6;">
    You will find the essential information to make an informed decision, at your own pace.
  </p>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0">
  <tr><td style="background:#800020;padding:14px 32px;">
    <a href="' . htmlspecialchars($downloadUrl) . '" target="_blank" style="color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;">
      Download the guide
    </a>
  </td></tr>
  </table>

  <p style="margin:28px 0 0;font-size:15px;color:#6B6560;line-height:1.6;">
    If you have any questions after reading, our team is available to help. You can reach us by phone or via our website.
  </p>

  <p style="margin:24px 0 0;font-size:15px;color:#6B6560;line-height:1.6;">
    Best regards,<br>
    <strong style="color:#1C1917;">The Team</strong>
  </p>

  <p style="margin:28px 0 0;font-size:13px;color:#A8A09A;line-height:1.5;">
    If the button does not work, copy this link:<br>
    <a href="' . htmlspecialchars($downloadUrl) . '" style="color:#800020;word-break:break-all;">' . htmlspecialchars($downloadUrl) . '</a>
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid #E5E1DE;background:#F8F7F4;">
  <p style="margin:0;font-size:12px;color:#A8A09A;line-height:1.5;">
    Your Business Name<br>
    Your Address<br>
    <a href="' . htmlspecialchars($siteUrl) . '" style="color:#800020;text-decoration:none;">yourdomain.com</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>';
}
