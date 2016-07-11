<?php
	class DatabaseContext{
		public $db;

		public function Connect(){
			try{
				
				// $host = 'localhost'; $username = 'root'; $password = 'root';
				$host = '139.162.25.179'; $username = 'alfonz'; $password = '22cput';
				$database = 'communication_db';

				$this->db = new PDO("mysql:host=$host;dbname=$database", 
					$username, $password, 
					array(PDO::ATTR_PERSISTENT => true));

				$this->db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

				if ($this->db){  
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
			$this->user_profile_db = null;
		}
	}
?>