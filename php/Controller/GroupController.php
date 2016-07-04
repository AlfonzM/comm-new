<?php
require_once('DataAccess/GroupRepository.php');

/* Get groups of conversations */
$app->get('/conversations/{id}/groups', function($request){
	$groupRepository = new GroupRepository();

	$select_properties = [
		'`group_id`',
		'`group_pepperTalkParent`',
		'`pepperTalk_text`',
		'`pepperTalk_conversation`'
	];

	$arguments = "`group_dis` = 1";

	$conversationId = $request->getAttribute('id');

	$result = $groupRepository->GetListByConversationId($conversationId, $select_properties, $arguments, null);

	pretty_json_encode($result);
});

/* Get groups of by pepper talk ID */
$app->get('/peppertalks/{id}/groups', function($request){
	$pepperTalkId = $request->getAttribute('id');
	$groupRepository = new GroupRepository();

	$result = $groupRepository->GetListByPepperTalkId($pepperTalkId);

	pretty_json_encode($result);
});

?>