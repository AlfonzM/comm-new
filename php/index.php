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

// Authenticate middleware function
$authenticateUser = function($request, $response, $next){
	session_start();

	if(isset($_COOKIE['PHPSESSID']) && isset($_SESSION['user_session'])) {
		$client_session_id = $_COOKIE['PHPSESSID'];
		$server_session_id = $_SESSION['user_session'];
		$isAuthenticated = $client_session_id != "" && $client_session_id == $server_session_id;
	} else {
		$isAuthenticated = false;
	}

	if(!$isAuthenticated){
		// Return 401 response
		return $response->withJson(["error" => ["message" => "Not authorized.", "status_code" => 401]], 401);;
	} else {
		// Proceed
		$response = $next($request, $response);

		return $response;
	}
};

$app = new Slim\App($settings);

require 'Controller/PepperTalkController.php';
require 'Controller/ConversationController.php';
require 'Controller/GroupController.php';
require 'Controller/UserReplyController.php';
require 'Controller/TriggerController.php';
require 'Controller/SettingController.php';

$app->run();

?>