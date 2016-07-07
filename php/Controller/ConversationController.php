<?php
require_once('DataAccess/ConversationRepository.php');

// TODO: check authorization here and get client ID

$app->get('/cookie', function($request){
	session_start();
	var_dump($_COOKIE);
	var_dump($_SESSION);
});

/* Get all conversations */
$app->get('/conversations', function ($request) {
	$conversationRepository = new ConversationRepository();

	$result = [];

	if(isset($_GET['trigger'])) {
		$trigger = $_GET['trigger'];
		$arguments = "`conversation_dis` = 1 AND `conversation_trigger` = $trigger";

		$conversationsWithTrigger = $conversationRepository->GetList(['conversation_id'], $arguments);

		foreach($conversationsWithTrigger as $convo){
			$result[] = $conversationRepository->GetOne([], "conversation_id=" . $convo['conversation_id']);
		}
	}
	else {
		$arguments = "`conversation_client` = {$_SESSION['user_id']} AND `conversation_dis` = 1";

		$complete = 1;
		$select_properties = [];

		if(isset($_GET['complete'])){
			$complete = $_GET['complete'];
		}

		if($complete == 1){
			$result = $conversationRepository->GetCollection([], $arguments);
		} else {
			$select_properties = [
				'`conversation_id`',
				'`conversation_title`',
				'`conversation_trigger`',
				'`conversation_priority`',
				'`conversation_sharp`',
				'`conversation_speed`',
				'`conversation_dialogFile`',
				'`conversation_language`',
				'`conversation_client`'
			];
			$result = $conversationRepository->GetList($select_properties, $arguments);
		}
	}

	pretty_json_encode($result);
})->add($authenticateUser);

/* Get conversation by ID */
$app->get('/conversations/{id}', function($request) {
	$conversationRepository = new ConversationRepository();
	$groupRepository = new GroupRepository();

	$arguments = "`conversation_dis` = 1";

	$conversation_id = $request->getAttribute('id');

	$result = $conversationRepository->GetOne([], "conversation_id=$conversation_id");

	pretty_json_encode($result);
})->add($authenticateUser);

/* Save a conversation */
$app->post('/conversations', function($request) {
	$conversationRepository = new ConversationRepository();

	$conversation = new Conversation($request->getParsedBody());

	$result = $conversationRepository->Save($conversation);

	pretty_json_encode($result);
})->add($authenticateUser);

/* Edit conversation */
$app->put('/conversations/{id}', function($request){
	$conversationRepository = new ConversationRepository();

	$conversation = new Conversation($request->getParsedBody());
	$conversation->conversation_id = $request->getAttribute('id');

	$result = $conversationRepository->Update($conversation);

	pretty_json_encode($conversation);
})->add($authenticateUser);

/* Delete conversation */
$app->delete('/conversations/{id}', function($request) {
	$conversationRepository = new ConversationRepository();
	$conversation_id = $request->getAttribute('id');
	$result = $conversationRepository->Delete($conversation_id);

	pretty_json_encode($result);
})->add($authenticateUser);

?>