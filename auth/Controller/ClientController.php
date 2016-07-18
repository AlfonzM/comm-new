<?php
require_once('DataAccess/PasswordResetRepository.php');
require_once('MailController.php');

// Returns 'true' or 'false'
$app->post('/client/register', function($request){

	$unitOfWork = new UnitOfWork();

	$parsed_object = $request->getParsedBody();

	$client = new Client();

	$client->client_name = $parsed_object['client_name'];
	$client->mail = $parsed_object['mail'];
	$client->number = $parsed_object['number'];
	$client->account_username = $parsed_object['account_username'];
	$client->account_password_string = $parsed_object['account_password_string'];

	$result = $unitOfWork->clientRepository->RegisterAccount($client);

	echo json_encode($result);

});

// Returns 'true' or 'false'
$app->post('/client/login', function($request) {
	$unitOfWork = new UnitOfWork();

	$parsed_object = $request->getParsedBody();

	$result = $unitOfWork->clientRepository->Login($parsed_object['account_username'], $parsed_object['account_password_string']);

	echo json_encode($result);
});

// Returns 'true'
$app->get('/client/logout', function(){

	$unitOfWork = new UnitOfWork();

	$result = $unitOfWork->clientRepository->Logout();

	echo json_encode($result);

});

// Returns 'true' or 'false'
$app->post('/client/forgot', function($request){
	$email = $request->getParsedBody()['email'];

	// check if email exists
	$unitOfWork = new UnitOfWork();
	$user = $unitOfWork->clientRepository->CheckEmailExists($email);

	if(!$user){
		// Email is not registered.
		// Still return true to prevent giving malicious attackers information about registered email addresses.
		echo json_encode(true);
		return;
	}

	// generate token and save to DB
	$passwordResetRepository = new PasswordResetRepository();
	$passwordResetToken = $passwordResetRepository->GeneratePasswordResetToken($email);

	// send email with link+token to email
	$host = $_SERVER['HTTP_HOST'];
	$dir = dirname(dirname(dirname($_SERVER['REQUEST_URI'])));
	$tokenUrl = "http://{$host}{$dir}/reset.php?token=$passwordResetToken";

	$subject = "Password Reset";
	$message = "Hi {$user['client_name']}, ";
	$message .= "<p>To reset your password, click the following link: </p>";
	$message .= "<p>$tokenUrl</p>";
	$message .= "Thanks,<br/>Communication App Team";

	// Send e-mail with token url. Print true or false
	$result = send_email($email, $subject, $message);
	echo json_encode($result);
});

// Returns true or false
$app->post('/client/reset', function($request){
	$token = $request->getParsedBody()['token'];
	$pass = $request->getParsedBody()['password'];
	$confirmPass = $request->getParsedBody()['confirm_password'];

	if($pass != $confirmPass){
		echo json_encode(false);
		return;
	}

	// Validate if token is correct
	$passwordResetRepository = new PasswordResetRepository();
	$result = $passwordResetRepository->ValidateToken($token);

	$resetResult = false;

	if($result){
		$unitOfWork = new UnitOfWork();
		$resetResult = $unitOfWork->clientRepository->ResetPassword($result['mail'], $pass);

		if($resetResult){
			session_start();
			$_SESSION['user_session'] = session_id();
			$_SESSION['user_id'] = $resetResult->client_id;
			echo json_encode(true);
			return;
		}
	}

	echo json_encode($result);
});

?>