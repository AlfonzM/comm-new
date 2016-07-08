<?php

	// require_once('GenericRepository.php');
	// require_once('../Model/Account.php');

class ClientRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('client_tb');
	}

	private function GenerateSalt(){
		$salt = md5(openssl_random_pseudo_bytes(64));
		return $salt;
	}

	private function GeneratePassword($password_string, $salt){
		$password = password_hash($password_string . $salt, PASSWORD_BCRYPT);
		return $password;
	}

		// TO DO:
		//	- username already exist [DONE]
		//	- email already exist
		//	- check email format
		//	- email confirmation

	public function RegisterAccount(Client $client){

		$count = count($this->CheckUserName($client->account_username));

		if($count == 0){
			$client->account_password_salt = $this->GenerateSalt();
			$client->account_password_string = $this->GeneratePassword($client->account_password_string, $client->account_password_salt);
			$client->account_reg = date('Y-m-d H:i:s');
				$client->account_dis = 1; // Change value to 0 when email confirmation function is implemented.

				return $this->Save($client);
			}
			else{
				return "Error. Username already exist.";
			}

		}

		public function CheckEmailExists($email){

			$select_properties = array('`client_id`');
			$arguments = "`mail` = '$email'";

			return $this->GetOne($select_properties, $arguments);
		}

		private function CheckUsername($username){

			$select_properties = array('`client_id`');
			$arguments = "`account_username` = '$username'";

			return $this->GetOne($select_properties, $arguments);

		}

		private function GetUserDetails($username){

			$select_properties = array('`client_id`',
				'`account_password_string`',
				'`account_password_salt`');

			$arguments = "`account_username` = '$username'";

			return $this->GetOne($select_properties, $arguments);

		}

		public function CheckAuthorization($client_session_id){
			session_start();
			$server_session_id = "PHPSESSID=" . $_SESSION['user_session'];
			
			if($client_session_id != "" && $client_session_id == $server_session_id){
				return true;
			}
			else{
				return false;
			} 
		}

		public function Login($username, $password_string){

			$account_details = $this->GetUserDetails($username);

			$count = count($account_details);

			if($count != 0){
				$account_password_salt = $account_details['account_password_salt'];
				$account_password_string = $account_details['account_password_string'];

				$bool = password_verify($password_string . $account_password_salt, $account_password_string);

				// TO DO: apply session to successfully logged in user [DONE]
				if($bool){
					session_start();
					$_SESSION['user_session'] = session_id();
					$_SESSION['user_id'] = $account_details['client_id'];
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}

		public function Logout(){
			session_start();
			session_unset();
			session_destroy();
			return true;
		}

		public function ResetPassword($email, $new_password){
			$resultClient = $this->GetOne([], "`mail` = '$email'");

			$client = new Client();
			$client->client_id = $resultClient['client_id'];
			$client->client_name = $resultClient['client_name'];
			$client->mail = $resultClient['mail'];
			$client->number = $resultClient['number'];
			$client->account_username = $resultClient['account_username'];
			$client->account_reg = $resultClient['account_reg'];
			$client->account_dis = $resultClient['account_dis'];

			$client->account_password_salt = $this->GenerateSalt();
			$client->account_password_string = $this->GeneratePassword($new_password, $client->account_password_salt);

			if($this->Update($client)){
				return $client;
			}

			return false;
		}

		// TO DO: function for Edit view, and Edit proper, if needed.

		// public function Edit($id){

		// 	$account = new Account();

		// 	$account->account_id = $id;
		// 	$account->account_username = "aj";
		// 	$account->account_password_string = "pav5gs";
		// 	$account->account_email = "watattops@gmail.com";
		// 	$account->account_is_active = 1;

		// 	$account->account_password_salt = $this->GenerateSalt();
		// 	$account->account_password_string = $this->GeneratePassword($account->account_password_string, $account->account_password_salt);

		// 	return $this->Update($account);

		// }

	}

	?>