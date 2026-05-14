<?php
// ============================================================
//  mailer.php — Lightweight SMTP Client
// ============================================================

function sendSMTPEmail(string $to, string $subject, string $message): bool {
    // Try Port 465 (SSL) first, then Port 587 (TLS) if it fails
    $configs = [
        ['host' => 'ssl://smtp.gmail.com', 'port' => 465, 'encryption' => 'ssl'],
        ['host' => 'tcp://smtp.gmail.com', 'port' => 587, 'encryption' => 'tls']
    ];

    $user = EMAIL_USER;
    $pass = EMAIL_PASS;

    if (empty($user) || empty($pass)) {
        error_log("SMTP Error: EMAIL_USER or EMAIL_PASS not configured in .env");
        return false;
    }

    foreach ($configs as $cfg) {
        try {
            error_log("SMTP Debug: Attempting connection to {$cfg['host']}:{$cfg['port']}...");
            $socket = @fsockopen($cfg['host'], $cfg['port'], $errno, $errstr, 10);
            if (!$socket) {
                error_log("SMTP Debug: Connection failed: $errstr ($errno)");
                continue;
            }

            $read = function($socket) {
                $data = "";
                while($str = fgets($socket, 515)) {
                    $data .= $str;
                    if(substr($str, 3, 1) == " ") break;
                }
                return $data;
            };

            $write = function($socket, $data) {
                fputs($socket, $data . "\r\n");
            };

            $res = $read($socket);
            error_log("SMTP Debug: Greeting: " . trim($res));

            $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
            $write($socket, "EHLO " . $serverName);
            $res = $read($socket);
            error_log("SMTP Debug: EHLO Response: " . trim(explode("\n", $res)[0]));

            if ($cfg['encryption'] === 'tls') {
                $write($socket, "STARTTLS");
                $res = $read($socket);
                error_log("SMTP Debug: STARTTLS Response: " . trim($res));
                if (!str_starts_with($res, '220')) continue;
                stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
                $write($socket, "EHLO " . $serverName);
                $read($socket);
            }

            $write($socket, "AUTH LOGIN");
            $read($socket);

            $write($socket, base64_encode($user));
            $read($socket);

            $write($socket, base64_encode($pass));
            $res = $read($socket);
            error_log("SMTP Debug: Auth Result: " . trim($res));

            if (!str_starts_with($res, '235')) {
                error_log("SMTP Error: Auth failed for $user. Check App Password.");
                fclose($socket);
                continue;
            }

            $write($socket, "MAIL FROM: <$user>");
            $read($socket);

            $write($socket, "RCPT TO: <$to>");
            $read($socket);

            $write($socket, "DATA");
            $read($socket);

            $headers = "To: $to\r\n" .
                       "From: Resort Booking <$user>\r\n" .
                       "Subject: $subject\r\n" .
                       "Content-Type: text/plain; charset=UTF-8\r\n" .
                       "MIME-Version: 1.0\r\n\r\n";

            $write($socket, $headers . $message . "\r\n.");
            $read($socket);

            $write($socket, "QUIT");
            fclose($socket);

            error_log("SMTP Success: Email sent to $to via {$cfg['port']}");
            return true;
        } catch (Exception $e) {
            error_log("SMTP Error Trace: " . $e->getMessage());
            if (isset($socket)) fclose($socket);
        }
    }

    error_log("SMTP Fatal: All connection attempts failed.");
    return false;
}
