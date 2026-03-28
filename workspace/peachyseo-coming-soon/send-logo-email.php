<?php
$to = 'dwdventer@gmail.com';
$subject = '🍑 PeachySEO Logo';
$svg_content = file_get_contents(__DIR__ . '/peachseo-logo.svg');

$boundary = md5(time());
$headers = "From: hello@peachyseo.com\r\n";
$headers .= "Reply-To: hello@peachyseo.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$message = "--$boundary\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
$message .= "<html><body style='font-family: Arial, sans-serif;'>";
$message .= "<h2 style='color: #FF6B35;'>🍑 Your PeachySEO Logo</h2>";
$message .= "<p>Hey David!</p>";
$message .= "<p>Here's your PeachySEO logo as requested. It's an SVG file which means it can scale to any size without losing quality.</p>";
$message .= "<p><strong>Files attached:</strong></p>";
$message .= "<ul>";
$message .= "<li>peachseo-logo.svg - The main logo file</li>";
$message .= "<li>peachseo-logo.png - A PNG version for easy use</li>";
$message .= "<li>logo-preview.html - Full preview page</li>";
$message .= "</ul>";
$message .= "<p>You can open the SVG in any browser and right-click to save it.</p>";
$message .= "<p>Stay peachy! 🍑<br>~ Boris</p>";
$message .= "</body></html>\r\n";

$message .= "--$boundary\r\n";
$message .= "Content-Type: image/svg+xml; name=\"peachseo-logo.svg\"\r\n";
$message .= "Content-Disposition: attachment; filename=\"peachseo-logo.svg\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n\r\n";
$message .= chunk_split(base64_encode($svg_content)) . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Email failed.";
}
?>