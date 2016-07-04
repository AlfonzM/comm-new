<?php
class Setting{
	public $setting_id;
	public $setting_choose;
	public $setting_dis;

	public function __construct($props){
		$this->setting_id = $props['setting_id'];
		$this->setting_choose = $props['setting_choose'];
		$this->setting_dis = $props['setting_dis'];
	}
}
?>