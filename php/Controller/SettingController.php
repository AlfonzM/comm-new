<?php
require_once('DataAccess/SettingRepository.php');

$app->get('/settings', function ($request) {
	$settingRepository = new SettingRepository();

	$result = [];

	$result = $settingRepository->GetList([], "`setting_dis` = 1");

	pretty_json_encode($result);
})->add($authenticateUser);

$app->put('/settings', function($request) {
	$setting = new Setting($request->getParsedBody());

	$settingRepository = new SettingRepository();
	$result = $settingRepository->Update($setting);

	pretty_json_encode($result);
})->add($authenticateUser);

?>