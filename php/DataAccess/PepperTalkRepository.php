<?php
require_once('_GenericRepository.php');
require_once('Model/PepperTalk.php');

class PepperTalkRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('pepperTalk_tb');
	}

	public function Save(PepperTalk $pepperTalk){
		try{
			$columns = "`pepperTalk_group`, `pepperTalk_conversation`, `pepperTalk_text`, `pepperTalk_output`, `pepperTalk_dis`";

			$query = "INSERT INTO `$this->entity`($columns) VALUES (:pepperTalk_group, :pepperTalk_conversation, :pepperTalk_text, :pepperTalk_output, :pepperTalk_dis);";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':pepperTalk_group' => $pepperTalk->pepperTalk_group,
					':pepperTalk_conversation' => $pepperTalk->pepperTalk_conversation,
					':pepperTalk_text' => $pepperTalk->pepperTalk_text,
					':pepperTalk_output' => $pepperTalk->pepperTalk_output,
					':pepperTalk_dis' => 1);

				if($_query->execute($parameters)){
					$pepperTalk->pepperTalk_id = $this->communication_db->lastInsertId();
					
					// If peppertalk has group/s, also save them
					if(count($pepperTalk->groups) > 0) {
						$groupRepository = new GroupRepository();

						// Assign pepperTalkParent id for each group and save each
						foreach($pepperTalk->groups as $group){
							$group->group_pepperTalkParent = $pepperTalk->pepperTalk_id;
							$group->group_pepperParentConversation = $pepperTalk->pepperTalk_conversation;
							$groupRepository->Save($group);
						}
					}

					return $pepperTalk;
				} else {
					return false;
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

	public function GetOne(array $select_properties, $arguments = "", $options = ""){
		$result = parent::GetOne($select_properties, $arguments, $options);
		
		$groupRepository = new GroupRepository();
		$groups = $groupRepository->GetListByPepperTalkId($result['pepperTalk_id']);

		foreach($groups as $group){
			$group['pepperTalk'] = $this->GetOneByGroupId($group['group_id'], []);

			$result['groups'][] = $group;
		}

		return $result;
	}

	public function GetOneByGroupId($groupId, $select_properties = [], $arguments = "", $options = "", $nested = true){
		if(isset($groupId)){
			if($arguments != ""){
				$arguments .= " AND ";
			}

			$arguments .= "pepperTalk_group=$groupId";

			$result = $this->GetList($select_properties, $arguments, $options);

			if(count($result) > 0){
				$pepperTalk = $result[0];

				// if($nested){
					$groupRepository = new GroupRepository();
					$groupResults = $groupRepository->GetListByPepperTalkId($pepperTalk['pepperTalk_id']);

					if(count($groupResults > 0)) {
						$pepperTalk['groups'] = $groupResults;
					}
				// }

				return $pepperTalk;
			}
		} else {
			return false;
		}	
	}

	public function Update(PepperTalk $pepperTalk){
		try{
			$query = "UPDATE `$this->entity` SET `pepperTalk_group`= :pepperTalk_group, `pepperTalk_conversation`= :pepperTalk_conversation, `pepperTalk_text`= :pepperTalk_text, `pepperTalk_output`= :pepperTalk_output, `pepperTalk_dis`= :pepperTalk_dis WHERE `pepperTalk_id` = :pepperTalk_id;";

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':pepperTalk_id' => $pepperTalk->pepperTalk_id,
					':pepperTalk_group' => $pepperTalk->pepperTalk_group,
					':pepperTalk_conversation' => $pepperTalk->pepperTalk_conversation,
					':pepperTalk_text' => $pepperTalk->pepperTalk_text,
					':pepperTalk_output' => $pepperTalk->pepperTalk_output,
					':pepperTalk_dis' => $pepperTalk->pepperTalk_dis);

				if($_query->execute($parameters)){
					// If peppertalk has groups, update each group
					if(count($pepperTalk->groups) > 0) {
						$groupRepository = new GroupRepository();

						// Assign pepperTalkParent id for each group and update/save each
						foreach($pepperTalk->groups as $key => $group){
							$group->group_pepperTalkParent = $pepperTalk->pepperTalk_id;
							$group->group_pepperParentConversation = $pepperTalk->pepperTalk_conversation;

							if($group->group_id != -1){
								$groupRepository->Update($group);
							} else {
								$groupRepository->Save($group);
							}

							if($group->group_dis == 0){
								unset($pepperTalk->groups[$key]);
							}
						}
					}

					return $pepperTalk;
				} else {
					return false;
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

}

?>