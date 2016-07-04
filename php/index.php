<?php

require 'vendor/autoload.php';
require_once('DataAccess/_DbContext.php');

$settings =  [
'settings' => [
'displayErrorDetails' => true,
],
];

function pretty_json_encode($data){
	echo json_encode($data, JSON_PRETTY_PRINT);
}

$app = new Slim\App($settings);

require 'Controller/PepperTalkController.php';
require 'Controller/ConversationController.php';
require 'Controller/GroupController.php';
require 'Controller/UserReplyController.php';
require 'Controller/TriggerController.php';
require 'Controller/SettingController.php';

$app->run();

?>