<?php
require_once('_GenericRepository.php');
require_once('Model/Setting.php');

class SettingRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('setting_tb');
	}

	public function Save(Setting $setting){
		try{
			$columns = "`setting_choose`, `setting_dis`";

			$query = "INSERT INTO `$this->entity`($columns) VALUES (:setting_choose, :setting_dis);";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':setting_choose' => $setting->setting_group,
					':setting_dis' => 1);
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

	public function Update(Setting $setting){
		try{
			$query = "UPDATE `$this->entity` SET `setting_choose`= :setting_choose WHERE `setting_id` = :setting_id;";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':setting_id' => $setting->setting_id,
					':setting_choose' => $setting->setting_choose);
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