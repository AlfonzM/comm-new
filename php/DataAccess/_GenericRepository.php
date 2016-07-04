<?php 
	require_once('_DbContext.php');

	class GenericRepository{

		protected $account_db;
		protected $communication_db;
		protected $entity;

		public function __construct($entity){
			$context = new DbContext();
			$context->Connect();
			$this->account_db = $context->account_db;
			$this->communication_db = $context->communication_db;
			$this->entity = $entity;
		}

		public function __destruct(){
			$context = new DbContext();
			$this->account_db = null;
			$this->communication_db = null;
			$context->Connect();
		}

		public function GetList(array $select_properties, $arguments = "", $options = ""){
			try{
				$count = count($select_properties);
				
				if($count != 0){
					$properties = implode(", ", $select_properties);

					$query = "SELECT $properties FROM `$this->entity`";
				}
				else{
					$query = "SELECT * FROM `$this->entity`";
				}

				if(!empty($options)){
					$query .= " $options";
				}

				if(!empty($arguments)){
					$query .= " WHERE $arguments";
				}

				$query .= ";";

				// echo $query;
				// echo "\n";

				if($_query = $this->communication_db->prepare($query)){
					$_query->execute();

					$pepperTalk_array = array();

					while($result = $_query->fetch(PDO::FETCH_ASSOC)){
						array_push($pepperTalk_array, $result);
					}

					// var_dump($pepperTalk_array);
					return $pepperTalk_array;
				}
				else{
					throw new Exception("Error. Check parameters");
				}
			}
			catch(Exception $exception){
				die($exception->getMessage());
			}
		}

		public function GetOne(array $select_properties, $arguments = "", $options =""){
			try{
				$count = count($select_properties);
				
				if($count != 0){
					$properties = implode(", ", $select_properties);

					$query = "SELECT $properties FROM `$this->entity`";
				}
				else{
					$query = "SELECT * FROM `$this->entity`";
				}

				if(!empty($options)){
					$query .= " $options";
				}

				if(!empty($arguments)){
					$query .= " WHERE $arguments";
				}

				$query .= " LIMIT 1;";

				// echo $query;
				// echo "\n";

				if($_query = $this->communication_db->prepare($query)){
					$_query->execute();

					while($result = $_query->fetch(PDO::FETCH_ASSOC)){
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

		public function Delete($id = 0){
			try{
				$entity_name = str_replace("_tb", "", $this->entity);

				$query = "UPDATE `$this->entity` SET `" . $entity_name . "_dis` = :" . $entity_name . "_dis WHERE `" . $entity_name . "_id` = :" . $entity_name . "_id;";

				if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
					$parameters = array(":" . $entity_name . "_id" => $id,
										":" . $entity_name . "_dis" => 0);
					return $_query->execute($parameters);
				}
				else{
					throw new Exception('Failed');
				}
			}
			catch(Exception $exception){
				die($exception->getMessage());
			}
		}
	}
?>