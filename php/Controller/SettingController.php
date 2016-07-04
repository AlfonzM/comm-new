<?php
require_once('DataAccess/SettingRepository.php');

$app->get('/settings', function ($request) {
	$settingRepository = new SettingRepository();

	$result = [];

	$result = $settingRepository->GetList([], "`setting_dis` = 1");

	pretty_json_encode($result);
});

$app->put('/settings', function($request) {
	$setting = new Setting($request->getParsedBody());

	$settingRepository = new SettingRepository();
	$result = $settingRepository->Update($setting);

	pretty_json_encode($result);
});


// $transaction = $_POST['transaction'];

// if(!empty($transaction)){

// 	$settingRepository = new SettingRepository();

// 	$setting_id = $_POST['setting_id'];
// 	$setting_choose = $_POST['setting_choose'];

// 	if($transaction == "select"){
// 		$select_properties = array('`setting_id`',
// 			'`setting_choose`');

// 		$arguments = "`setting_dis` = 1";

// 		$result = $settingRepository->GetList($select_properties, $arguments);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "insert"){

// 		$setting = new Setting();
// 		$setting->setting_choose = $setting_choose;

// 		$result = $settingRepository->Save($setting);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "update"){

// 		$setting = new Setting();
// 		$setting->setting_id = $setting_id;
// 		$setting->setting_choose = $setting_choose;

// 		$result = $settingRepository->Update($setting);

// 		echo json_encode($result);
// 	}
// 	elseif($transaction == "delete"){

// 		$result = $settingRepository->Delete($setting_id);

// 		echo json_encode($result);
// 	}
// 	else{
// 		echo json_encode("Invalid action!");
// 	}

// }
?>