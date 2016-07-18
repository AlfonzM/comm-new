<?php

// HELPER FUNCTIONS

function send_email($email, $subject, $message){
	$mail = new PHPMailer;

	// $mail->SMTPDebug = 1;                               // Enable verbose debug output

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'alfonz.mailer@gmail.com';                 // SMTP username
	$mail->Password = 'helloworld123';                           // SMTP password
	$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 587;                                    // TCP port to connect to

	$mail->setFrom('alfonz.mailer@gmail.com', 'Alfonz Mailer');
	$mail->addAddress($email, 'Alfonz Montelibano');     // Add a recipient

	// $mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = $subject;
	$mail->Body    = $message;
	$mail->AltBody = $message;

	// if(!$mail->send()) {
	// 	echo 'Message could not be sent.';
	// 	echo 'Mailer Error: ' . $mail->ErrorInfo;
	// } else {
	// 	echo 'Message has been sent';
	// }

	return $mail->send();
}