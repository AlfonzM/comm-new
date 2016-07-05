<?php

if (!ini_get('display_errors')) {
    ini_set('display_errors', '1');
}


class DbContext{
	public $account_db;
	public $communication_db;

	public function Connect(){
		try{
			$host = 'localhost'; $username = 'root'; $password = 'root';
			// $host = '139.162.25.179'; $username = 'alfonz'; $password = '22cput';

			$this->account_db = new PDO("mysql:host=$host;dbname=analysis_db", 
				$username, $password, 
				array(PDO::ATTR_PERSISTENT => true));

			$this->communication_db = new PDO("mysql:host=$host;dbname=communication_db;charset=utf8", 
				$username, $password, 
				array(PDO::ATTR_PERSISTENT => true));

			// Enable this line to print errors of last operation
			// Use:	$this->communication_db->errorInfo()
			$this->communication_db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

			if ($this->account_db && $this->communication_db){  
				date_default_timezone_set('Asia/Tokyo');
			}
			else{
				throw new Exception('Unable to connect to server.');
			}
		}
		catch(PDOException $e){
			die($e->getMessage());
		}
	}

	public function Disconnect(){
		$this->account_db = null;
		$this->communication_db = null;
	}
}
?>