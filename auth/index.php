<?php

	require 'vendor/autoload.php';
	
	require_once('DataAccess/UnitOfWork.php');

	$settings =  [
		'settings' => [
			'displayErrorDetails' => true,
		],
	];

	$app = new Slim\App($settings);

	require 'Controller/ClientController.php';

	$app->run();

?>