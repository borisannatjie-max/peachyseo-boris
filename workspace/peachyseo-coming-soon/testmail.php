<?php
$result = mail('dwdventer@gmail.com', 'Test from PeachySEO', 'This is a test email from PeachySEO server.');
echo $result ? "Mail sent OK" : "Mail FAILED";
echo "\n";
echo "Error: " . error_get_last()['message'] ?? "none";
?>