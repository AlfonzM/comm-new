<?php
require_once('Model/PasswordReset.php');

class PasswordResetRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('password_resets_tb');
	}

	public function GetValidToken($email){
		$result = $this->GetOne([], "`mail` = '$email' AND expiry_date > NOW() AND password_resets_dis = 1");
		return $result;
	}

	public function ValidateToken($token){
		$token = md5($token);
		$result = $this->GetOne([], "`token` = '$token' AND expiry_date > NOW() AND password_resets_dis = 1");

		if(!empty($result)){
			$this->Delete($result['password_resets_id']);
			return $result;
		}

		return false;
	}

	// Returns generated token
	public function GeneratePasswordResetToken($email){
		// Generate random token
		$token = bin2hex(random_bytes(78));

		// Check if there is an existing valid token for this email
		$result = $this->GetValidToken($email);

		$passwordReset = new PasswordReset();

		if($result){
			$passwordReset->password_resets_id = $result['password_resets_id'];
		}

		$passwordReset->mail = $email;
		$passwordReset->token = md5($token);
		$passwordReset->expiry_date = date('Y-m-d H:i:s', time() + 86400); // Token expires after 24 hrs
		$passwordReset->password_resets_dis = 1;

		// insert token to forgot_password table
		if(isset($passwordReset->password_resets_id)){
			$result = $this->Update($passwordReset);
		} else {
			$result = $this->Save($passwordReset);
		}

		return $token;
	}
}

?>