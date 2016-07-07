<?php 

	// require_once('DatabaseContext.php');

	class GenericRepository{

		protected $db;
		protected $entity;

		public function __construct($entity){

			$context = new DatabaseContext();
			$context->Connect();
			$this->db = $context->db;
			$this->entity = $entity;

		}

		public function __destruct(){

			$context = new DatabaseContext();
			$this->db = null;
			$context->Disconnect();

		}

		public function GetList(array $select_properties, $arguments = "", $options = ""){

			try{
				$count = count($select_properties);
				
				if($count != 0){
					$properties = implode(", ", $select_properties);

					$query_string = "SELECT $properties FROM `$this->entity`";
				}
				else{
					$query_string = "SELECT * FROM `$this->entity`";
				}

				if(!empty($options)){
					$query_string .= " $options";
				}

				if(!empty($arguments)){
					$query_string .= " WHERE $arguments";
				}

				$query_string .= ";";

				if($query = $this->db->prepare($query_string)){
					$query->execute();

					$array = array();

					while($result = $query->fetch(PDO::FETCH_ASSOC)){
						array_push($array, $result);
					}

					return $array;
				}
				else{
					throw new Exception("Error. Check parameters");
				}
			}
			catch(Exception $exception){
				die($exception->getMessage());
			}

		}

		public function GetOne(array $select_properties, $arguments = ""){

			try{

				$count = count($select_properties);
				
				if($count != 0){
					$properties = implode(", ", $select_properties);
					$query_string = "SELECT $properties FROM `$this->entity`";
				}
				else{
					$query_string = "SELECT * FROM `$this->entity`";
				}

				if(!empty($arguments)){
					$query_string .= " WHERE $arguments";
				}

				$query_string .= " LIMIT 1;";

				if($query = $this->db->prepare($query_string)){
					$query->execute();

					while($result = $query->fetch(PDO::FETCH_ASSOC)){
						return $result;
					}

					return [];

				}
				else{
					throw new Exception("Error. Check parameters");
				}
			}
			catch(Exception $exception){
				die($exception->getMessage());
			}

		}

		public function Save($tentity){

			try{

				if($this->IsEntity($tentity)){

					$data_bundle = $this->GenerateQueryString($tentity, "save");
					$query = $data_bundle['query'];
					$parameters = $data_bundle['parameters'];

					if($_query = $this->db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){

						return $_query->execute($parameters);

					}
					else{

						throw new Exception('Failed');

					}

				}
				else{
					throw new Exception("Error. Invalid parameter type.");
				}

			}
			catch(Exception $exception){
				die($exception->getMessage());
			}
			
		}

		public function Update($tentity){

			try{

				if($this->IsEntity($tentity)){

					$data_bundle = $this->GenerateQueryString($tentity, "update");
					$query = $data_bundle['query'];
					$parameters = $data_bundle['parameters'];

					if($_query = $this->db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){

						return $_query->execute($parameters);

					}
					else{

						throw new Exception('Failed');

					}

				}
				else{
					throw new Exception("Error. Invalid parameter type.");
				}

			}
			catch(Exception $exception){
				die($exception->getMessage());
			}
			
		}

		public function Delete($id = 0){

			try{
				$entity_name = str_replace("_tb", "", $this->entity);

				$query_string = "UPDATE `$this->entity` SET `" . $entity_name . "_dis` = :" . $entity_name . "_dis WHERE `" . $entity_name . "_id` = :" . $entity_name . "_id;";

				if($query = $this->db->prepare($query_string, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
					$parameters = array(":" . $entity_name . "_id" => $id,
										":" . $entity_name . "_dis" => 0);
					return $query->execute($parameters);
				}
				else{
					throw new Exception('Failed');
				}
			}
			catch(Exception $exception){
				die($exception->getMessage());
			}

		}

		private function IsEntity($tentity){

			$type = gettype($tentity);

			if($type == 'object'){
				return true;
			}
			else{
				return false;
			}

		}

		private function GenerateQueryString($tentity, $transaction){

			$data_bundle = array();

			$columns = "";
			$argument = ""; // for update
			$values = ""; // for save
			$parameters = array();

			if($transaction == "save"){

				foreach($tentity as $key => $value){

					$columns .= "`$key`, ";
					$values .= ":$key, ";
					$parameters[":$key"] = $value;
					
				}

				$columns = substr($columns, 0, -2);
				$values = substr($values, 0, -2);

				$query = "INSERT INTO `$this->entity`($columns) VALUES ($values);";

			}
			elseif($transaction == "update"){

				$index = 0;

				foreach($tentity as $key => $value){

					if($index != 0){

						$columns .= "`$key` = :$key, ";
						$parameters[":$key"] = $value;

					}
					else{

						$argument = "`$key` = :$key";
						$parameters[":$key"] = $value;
						$index++;

					}
					
				}

				$columns = substr($columns, 0, -2);

				$query = "UPDATE `$this->entity` SET $columns WHERE $argument;";

			}

			$data_bundle['query'] = $query;
			$data_bundle['parameters'] = $parameters;

			return $data_bundle;


		}
		
	}
	
?>