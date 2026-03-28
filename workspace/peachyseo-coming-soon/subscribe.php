<?php
header('Content-Type: application/json');

// Configuration
$leads_file = __DIR__ . '/leads.json';
$notify_email = 'hello@peachyseo.com';
$site_name = 'PeachySEO';
$from_email = 'hello@peachyseo.com';

// Get POST data
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : null;

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

// Load existing leads
$leads = [];
if (file_exists($leads_file)) {
    $leads = json_decode(file_get_contents($leads_file), true) ?? [];
}

// Check for duplicate
$emails = array_column($leads, 'email');
if (in_array($email, $emails)) {
    echo json_encode(['success' => true, 'message' => "You're already on the list! 🍑"]);
    exit;
}

// Add new lead
$lead = [
    'email' => $email,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'timestamp' => date('Y-m-d H:i:s')
];
$leads[] = $lead;
file_put_contents($leads_file, json_encode($leads, JSON_PRETTY_PRINT));

// Send notification to David
$subject = "🍑 New PeachySEO Lead: $email";
$message = "Hey David!\n\nSomeone just signed up for updates:\n\nEmail: $email\nTime: {$lead['timestamp']}\nIP: {$lead['ip']}\n\nTotal leads: " . count($leads) . "\n\n- PeachySEO Bot";
mail($notify_email, $subject, $message, "From: $from_email");

// Send funny auto-reply to subscriber
$auto_reply_subject = "You're on the list! 🍑 - PeachySEO";
$auto_reply_message = <<<EOT
Hey there, future SEO peach! 🍑

Thanks for joining the PeachySEO party! 🎉

You're officially on the list and will be among the first to know when we launch.

In the meantime, here's a PeachySEO promise:

"We guarantee your rankings will improve by at least 10%... 
of a peach being perfectly ripe. Which, let's be honest, 
is actually pretty good."

Now go tell your friends about us. Because sharing is caring. 
And also because I can't afford advertising yet.

Stay peachy,
The PeachySEO Team 🍑

P.S. If this email was a mistake, please reply with "I hate peaches" 
and we'll pretend this never happened.
EOT;

mail($email, $auto_reply_subject, $auto_reply_message, 
    "From: $from_email\r\n".
    "Reply-To: $notify_email\r\n".
    "Content-Type: text/plain; charset=UTF-8"
);

echo json_encode(['success' => true, 'message' => "You're on the list! 🍑 Check your inbox for a welcome message."]);
?>