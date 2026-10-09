<?php
/**
 * Selwyn Rail Road contact form handler.
 * Sends each enquiry by email using the server's PHP mail().
 *
 * SETTINGS — change these two lines only.
 */
$TO_EMAIL   = 'RECIPIENT_EMAIL_HERE';                  // where enquiries are delivered
$FROM_EMAIL = 'noreply@selwynrailroadgroup.com';       // must be on this domain for good delivery

// ---------------------------------------------------------------------------

header('X-Robots-Tag: noindex');
$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function finish($ok, $message, $wantsJson) {
    if ($wantsJson) {
        http_response_code($ok ? 200 : 400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: /contact.html?' . ($ok ? 'sent=1' : 'error=1') . '#contact-form', true, 303);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact.html', true, 303);
    exit;
}

if (strpos($TO_EMAIL, '@') === false) {
    finish(false, 'The contact form is not set up yet. Please call +1 (407) 760-8000.', $wantsJson);
}

// Spam traps: hidden field must be empty, and the form must not be submitted instantly.
if (!empty($_POST['website_url'])) {
    finish(true, 'Thanks. Your message has been sent.', $wantsJson); // silently drop bots
}
$started = isset($_POST['started']) ? (int) $_POST['started'] : 0;
if ($started > 0 && (time() - (int) ($started / 1000)) < 3) {
    finish(true, 'Thanks. Your message has been sent.', $wantsJson);
}

function field($name, $max = 200) {
    $v = isset($_POST[$name]) ? trim((string) $_POST[$name]) : '';
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // no header injection
    return mb_substr($v, 0, $max);
}

$first   = field('first_name', 80);
$last    = field('last_name', 80);
$company = field('company', 120);
$title   = field('title', 120);
$email   = field('email', 160);
$phone   = field('phone', 40);
$service = field('service', 80);
$message = isset($_POST['message']) ? mb_substr(trim((string) $_POST['message']), 0, 5000) : '';

if ($first === '' || $last === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 'Please fill in your name, a valid email address and a message.', $wantsJson);
}

$subject = 'Website enquiry' . ($service !== '' ? ': ' . $service : '') . ' — ' . $first . ' ' . $last;
$body  = "New enquiry from selwynrailroadgroup.com\n\n";
$body .= "Name:     $first $last\n";
$body .= "Company:  " . ($company ?: '-') . "\n";
$body .= "Title:    " . ($title ?: '-') . "\n";
$body .= "Email:    $email\n";
$body .= "Phone:    " . ($phone ?: '-') . "\n";
$body .= "Service:  " . ($service ?: '-') . "\n\n";
$body .= "Message:\n$message\n\n";
$body .= "---\nSent " . gmdate('Y-m-d H:i') . " UTC from " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown IP') . "\n";

$headers  = "From: Selwyn Rail Road Website <$FROM_EMAIL>\r\n";
$headers .= "Reply-To: $first $last <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . $FROM_EMAIL);

if ($sent) {
    finish(true, 'Thanks. Your message has been sent. We will reply during business hours. For anything urgent, call +1 (407) 760-8000.', $wantsJson);
}
finish(false, 'Your message could not be sent. Please call +1 (407) 760-8000.', $wantsJson);
