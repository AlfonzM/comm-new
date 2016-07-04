<?php
require_once('DataAccess/PepperTalkRepository.php');

/* Get all pepper talks of conversation ID */
$app->get('/conversations/{id}/peppertalks', function($request){
	$pepperTalkRepository = new PepperTalkRepository();

	$conversation_id = $request->getAttribute('id');

	$result = $pepperTalkRepository->GetList([], "pepperTalk_conversation=$conversation_id");

	pretty_json_encode($result);
});

/* Get a pepper talk by id */
$app->get('/peppertalks/{id}', function($request) {
	$pepperTalkRepository = new PepperTalkRepository();

	$pepperTalkId = $request->getAttribute('id');

	$pepperTalk = $pepperTalkRepository->GetOne([], "pepperTalk_id=$pepperTalkId");

	$groupRepository = new GroupRepository();

	$pepperTalk['groups'] = $groupRepository->GetListByPepperTalkId($pepperTalk['pepperTalk_id']);

	pretty_json_encode($pepperTalk);
});

/* Edit a pepper talk */
$app->put('/peppertalks/{id}', function($request){
	$pepperTalkRepository = new PepperTalkRepository();

	$pepperTalk = new PepperTalk();

	$pepperTalk->$peppeTalk_id = $request->getAttribute('id');
	$pepperTalk->pepperTalk_group = $request->getParsedBody()['pepperTalk_group'];
	$pepperTalk->pepperTalk_text = $request->getParsedBody()['pepperTalk_text'];
	$pepperTalk->pepperTalk_output = $request->getParsedBody()['pepperTalk_output'];
	$pepperTalk->pepperTalk_dis = $request->getParsedBody()['pepperTalk_dis'];

	$peppertalkId = $request->getAttribute('id');
	$result = $pepperTalkRepository->Update($pepperTalk);

	pretty_json_encode($result);
});

/* Delete a peppertalk */
$app->delete('/peppertalks/{id}', function($request) {
	$pepperTalkRepository = new PepperTalkRepository();

	$peppertalkId = $request->getAttribute('id');
	$result = $pepperTalkRepository->Delete($peppertalkId);

	pretty_json_encode($result);
});

?>