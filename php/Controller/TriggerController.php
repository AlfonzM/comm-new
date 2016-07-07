<?php
require_once('DataAccess/TriggerRepository.php');

$app->get('/triggers', function ($request) {
	$triggerRepository = new TriggerRepository();

	$result = [];

	$result = $triggerRepository->GetList([], "`trigger_dis` = 1");

	pretty_json_encode($result);
})->add($authenticateUser);

$app->get('/triggers/{id}', function($request){
	$triggerRepository = new TriggerRepository();

	$result = [];

	$arguments = "`trigger_dis` = 1 AND `trigger_id`=" . $request->getAttribute('id');

	$result = $triggerRepository->GetOne([], $arguments);

	pretty_json_encode($result);
})->add($authenticateUser);

?>