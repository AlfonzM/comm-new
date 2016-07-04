<?php
class PepperTalk{
	public $pepperTalk_id;
	public $pepperTalk_group;
	public $pepperTalk_conversation;
	public $pepperTalk_text;
	public $pepperTalk_output;
	public $pepperTalk_dis;

	public $groups;

	public function __construct($props){
		$this->pepperTalk_id = $props['pepperTalk_id'];
		$this->pepperTalk_group = $props['pepperTalk_group'];
		$this->pepperTalk_conversation = $props['pepperTalk_conversation'];
		$this->pepperTalk_text = $props['pepperTalk_text'];
		$this->pepperTalk_output = $props['pepperTalk_output'];
		$this->pepperTalk_dis = $props['pepperTalk_dis'];

		$this->groups = [];

		if(isset($props['groups'])){
			foreach($props['groups'] as $group) {
				$this->groups[] = new Group($group);
			}
		}
	}

	public function getGroups() {
		$groupRepository = new GroupRepository();

		$this->groups = $groupRepository->GetListByPepperTalkId($this->pepperTalk_id);

		return $this->groups;
	}
}
?>