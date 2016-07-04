<?php
require_once('_GenericRepository.php');
require_once('Model/Trigger.php');

class TriggerRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('trigger_tb');
	}

	public function Save(Trigger $trigger){
		try{
			$columns = "`trigger_name`, `trigger_dis`";

			$query = "INSERT INTO `$this->entity`($columns) VALUES (:trigger_name, :trigger_dis);";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':trigger_name' => $trigger->trigger_answer,
					':trigger_dis' => 1);
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

	public function Update(Trigger $trigger){
		try{
			$query = "UPDATE `$this->entity` SET `trigger_name`= :trigger_name WHERE `trigger_id` = :trigger_id;";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':trigger_id' => $trigger->trigger_id,
					':trigger_name' => $trigger->trigger_name);
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