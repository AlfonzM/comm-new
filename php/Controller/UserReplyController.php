<?php
require_once('DataAccess/UserReplyRepository.php');

// $transaction = $_POST['transaction'];

// if(!empty($transaction)){

// 	$userReplyRepository = new UserReplyRepository();

// 	$userReply_id = $_POST['userReply_id'];
// 	$userReply_group = $_POST['userReply_group'];
// 	$userReply_answer = $_POST['userReply_answer'];

// 	if($transaction == "select"){
// 		$select_properties = array('`userReply_id`',
// 			'`userReply_group`',
// 			'`userReply_answer`');

// 		$arguments = "`userReply_dis` = 1";

// 		$result = $userReplyRepository->GetList($select_properties, $arguments);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "insert"){

// 		$userReply = new UserReply();
// 		$userReply->userReply_group = $userReply_group;
// 		$userReply->userReply_answer = $userReply_answer;

// 		$result = $userReplyRepository->Save($userReply);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "update"){

// 		$userReply = new UserReply();
// 		$userReply->userReply_id = $userReply_id;
// 		$userReply->userReply_group = $userReply_group;
// 		$userReply->userReply_answer = $userReply_answer;

// 		$result = $userReplyRepository->Update($userReply);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "delete"){

// 		$result = $userReplyRepository->Delete($userReply_id);

// 		echo json_encode($result);
// 	}
// 	else{
// 		echo json_encode("Invalid action!");
// 	}

// }
?>