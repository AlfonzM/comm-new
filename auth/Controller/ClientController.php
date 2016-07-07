<?php

	// Returns 'true' or 'false'
	$app->post('/client/register', function($request){

		$unitOfWork = new UnitOfWork();

		$parsed_object = $request->getParsedBody();

		$client = new Client();

		$client->client_name = $parsed_object['client_name'];
		$client->mail = $parsed_object['mail'];
		$client->number = $parsed_object['number'];
		$client->account_username = $parsed_object['account_username'];
		$client->account_password_string = $parsed_object['account_password_string'];

		$result = $unitOfWork->clientRepository->RegisterAccount($client);

		echo json_encode($result);

	});

	// Returns 'true' or 'false'
	$app->post('/client/login', function($request) {
		$unitOfWork = new UnitOfWork();

		$parsed_object = $request->getParsedBody();

		$result = $unitOfWork->clientRepository->Login($parsed_object['account_username'], $parsed_object['account_password_string']);

		echo json_encode($result);
	});

	// Returns 'true'
	$app->get('/client/logout', function(){

		$unitOfWork = new UnitOfWork();

		$result = $unitOfWork->clientRepository->Logout();

		echo json_encode($result);

	});

?>