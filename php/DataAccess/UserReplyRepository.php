<?php
require_once('_GenericRepository.php');
require_once('Model/UserReply.php');

class UserReplyRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('userReply_tb');
	}

	public function Save(UserReply $userReply){
		try{
			$columns = "`userReply_group`, `userReply_answer`, `userReply_dis`";

			$query = "INSERT INTO `$this->entity`($columns) VALUES (:userReply_group, :userReply_answer, :userReply_dis);";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':userReply_group' => $userReply->userReply_group,
					':userReply_answer' => $userReply->userReply_answer,
					':userReply_dis' => 1);
				if($_query->execute($parameters)){
					$userReply->userReply_id = $this->communication_db->lastInsertId();

					return $userReply;
				}
			}
			else{
				throw new Exception('Failed');
			}
		}
		catch(Exception $exception){
			die($exception->getMessage());
		}
	}

	public function Update(UserReply $userReply){
		try{
			$query = "UPDATE `$this->entity` SET `userReply_group`= :userReply_group, `userReply_answer`= :userReply_answer, `userReply_dis`= :userReply_dis WHERE `userReply_id` = :userReply_id;";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':userReply_id' => $userReply->userReply_id,
					':userReply_group' => $userReply->userReply_group,
					':userReply_answer' => $userReply->userReply_answer,
					':userReply_dis' => $userReply->userReply_dis
					);
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