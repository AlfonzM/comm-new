<?php
require_once('_GenericRepository.php');
require_once('Model/Conversation.php');

class ConversationRepository extends GenericRepository{

	public function __construct(){
		parent::__construct('conversation_tb');
	}

	public function Save(Conversation $conversation){
		try{
			$columns = "`conversation_title`, `conversation_trigger`, `conversation_priority`, `conversation_sharp`, `conversation_speed`, `conversation_client`, `conversation_dialogFile`, `conversation_language`, `conversation_dis`";
			$query = "INSERT INTO `$this->entity`($columns) VALUES (:conversation_title, :conversation_trigger, :conversation_priority, :conversation_sharp, :conversation_speed, :conversation_client, :conversation_dialogFile, :conversation_language, :conversation_dis);";

			$conversation->generateDialog();

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':conversation_title' => $conversation->conversation_title,
					':conversation_trigger' => $conversation->conversation_trigger,
					':conversation_priority' => $conversation->conversation_priority,
					':conversation_sharp' => $conversation->conversation_sharp,
					':conversation_speed' => $conversation->conversation_speed,
					':conversation_client' => $conversation->conversation_client,
					':conversation_dialogFile' => $conversation->conversation_dialogFile,
					':conversation_language' => $conversation->conversation_language,
					':conversation_dis' => 1);
				if($_query->execute($parameters)){
					$conversation->conversation_id = $this->communication_db->lastInsertId();

					if(count($conversation->pepperTalks) < 1){
						return $conversation;
					}

					$pepperTalkRepository = new PepperTalkRepository();

					foreach($conversation->pepperTalks as $pepperTalk){
						$pepperTalk->pepperTalk_conversation = $conversation->conversation_id;
						$result = $pepperTalkRepository->Save($pepperTalk);
					}

					// Save the first peppertalk (set pepperTalk_group=0, and parent conversation id to the newly saved convo)
					// $conversation->pepperTalks[0]->pepperTalk_conversation = $conversation->conversation_id;
					// $conversation->pepperTalks[0]->pepperTalk_group = 0;
					// $result = $pepperTalkRepository->Save($conversation->pepperTalks[0]);

					if(!$result){
						echo "Error saving pepperTalk of conversation ID " . $conversation->conversation_id;
						return false;
					} else {
						return $conversation;
					}
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

	public function GetCollection(array $select_properties, $arguments = "", $options = ""){
		$conversationsResult = $this->GetList($select_properties, $arguments, $options);

		$conversations = [];

		foreach($conversationsResult as $conversation){
			$newConvo = new Conversation($conversation);
			$newConvo->getPepperTalks();

			$conversations[] = $newConvo;
		}

		return $conversations;
	}

	public function GetOne(array $select_properties, $arguments = "", $options = ""){
		$conversation = new Conversation(parent::GetOne($select_properties, $arguments, $options));

		$conversation->getPepperTalks();

		// $pepperTalkRepository = new PepperTalkRepository();

		// $conversation['pepperTalk'] = $pepperTalkRepository->GetOneByGroupId(0, [], "pepperTalk_conversation=" . $conversation['conversation_id']);

		return $conversation;
	}

	public function Update(Conversation $conversation){
		try{
			$query = "UPDATE `$this->entity` SET `conversation_title`= :conversation_title, `conversation_trigger`= :conversation_trigger, `conversation_priority`= :conversation_priority, `conversation_sharp`= :conversation_sharp, `conversation_language`= :conversation_language, `conversation_dialogFile`= :conversation_dialogFile, `conversation_speed`= :conversation_speed WHERE `conversation_id` = :conversation_id;";

			$conversation->generateDialog();

			if($_query = $this->communication_db->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY))){
				$parameters = array(':conversation_id' => $conversation->conversation_id,
					':conversation_title' => $conversation->conversation_title,
					':conversation_trigger' => $conversation->conversation_trigger,
					':conversation_priority' => $conversation->conversation_priority,
					':conversation_sharp' => $conversation->conversation_sharp,
					':conversation_speed' => $conversation->conversation_speed,
					':conversation_language' => $conversation->conversation_language,
					':conversation_dialogFile' => $conversation->conversation_dialogFile
					);

				if($_query->execute($parameters)){
					if(!isset($conversation->pepperTalks)){
						return $conversation;
					}

					$pepperTalkRepository = new PepperTalkRepository();

					// Update each pepperTalk in the pepperTalks array
					foreach($conversation->pepperTalks as $pepperTalk){
						if($pepperTalk->pepperTalk_id != -1){
							$result = $pepperTalkRepository->Update($pepperTalk);
						}

						if(!$result){
							echo "Error saving pepperTalk of conversation ID " . $conversation->conversation_id;
							return false;
						}
					}

					return $conversation;

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