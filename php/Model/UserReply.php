<?php
class UserReply{
	public $userReply_id;
	public $userReply_group;
	public $userReply_answer;
	public $userReply_dis;

	public function __construct($props){
		$this->userReply_id = $props['userReply_id'];
		$this->userReply_group = $props['userReply_group'];
		$this->userReply_answer = $props['userReply_answer'];
		$this->userReply_dis = $props['userReply_dis'];
	}
}
?>