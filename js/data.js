var apiUrl = 'php/conversations';
var baseUrl = '/communication';

$(document).ready(function() {	
	fetchConversations();	
});

function fetchConversations(){
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'json',
		timeout: 60000,
		success: function(data) {
			if(data.error){
				if(data.error.status_code == 401){
					window.location.replace('signin.php');
				}
			} else {
				createConversationCollectionFromJson(data);
			}
		},
		error: function(jqxhr, status, error) {
			alertModal("Sorry, there was a problem getting the data from the database. Please try again.");
		}
	});
}

// Returns array of Conversation
function createConversationCollectionFromJson(conversations){
	for(var index in conversations){
		var newConversationObject = createConversationObjectFromJson(conversations[index]);
		addConversation(newConversationObject);
	}
}

// Returns Conversation object
function createConversationObjectFromJson(conversationProps){
	var convoProps = conversationProps;
	var newConvo = new Conversation(convoProps);

	if(convoProps.pepperTalks && convoProps.pepperTalks.length > 0){
		var currentPepperTalk = convoProps.pepperTalks[0];
		currentPepperTalk = addPepperTalk(currentPepperTalk, newConvo);
	}

	return newConvo;
}

function addPepperTalk(currentPepperTalk, newConvo){
	var newPepperTalk = newConvo.addDialogue(new PepperTalk(currentPepperTalk));

	if(currentPepperTalk.parent){
		newPepperTalk.parent = currentPepperTalk.parent;
	}

	if(currentPepperTalk.groups.length == 0){
		return newPepperTalk;
	} else {
		// Each group in current pepper talk
		for(var index in currentPepperTalk.groups){
			var groupProps = currentPepperTalk.groups[index];
			var newGroup = newPepperTalk.addResponse(new Group(groupProps));

			if(groupProps.pepperTalk){
				newGroup.pepperResponse = groupProps.pepperTalk.pepperTalk_text;
				newGroup.output = groupProps.pepperTalk.pepperTalk_output;
				
				var newlyAddedPepperTalk = addPepperTalk(groupProps.pepperTalk, newConvo);
				newGroup.child = newlyAddedPepperTalk.localID;
				newlyAddedPepperTalk.parent = newGroup.localPepperTalkParent;
			}

			// Each user reply of group
			for(var index in groupProps.userReplies){
				var userReplyProps = groupProps.userReplies[index];
				var newUserReply = newGroup.addUserResponse(new UserReply(userReplyProps));
			}
		}

		return newPepperTalk;
	}   
}

function saveConversation(conversation){
	$("#save-conversation").addClass("is-loading");

	// return;
	$.ajax({
		url: apiUrl,
		data: JSON.stringify(conversation.toJson()),
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		timeout: 60000,
		success: function(data) {
			data.localID = conversation.localID;

			var conversationObjectFromJson = createConversationObjectFromJson(data);

			// Update temp to conversation collection
			conversationCollection[conversation.localID] = conversationObjectFromJson;
			currentConversation = Clone(conversationObjectFromJson);

			var gotoThisDialogue = currentDialogue;

			viewConversation(conversationObjectFromJson.localID, conversationObjectFromJson);
			viewPepperTalk(conversationObjectFromJson, conversationObjectFromJson.pepperTalks[gotoThisDialogue]);

			statusNotification("Saved successfully...", null, function(){
				$("#save-conversation").removeClass("is-loading");
			});
		},
		error: function(e) {
			$("#save-conversation").removeClass("is-loading");
			alertModal("Sorry, there was a problem saving the conversation. Please try again.");
		}
	});
}

function updateConversation(conversation){
	$("#save-conversation").addClass("is-loading");

	$.ajax({
		url: apiUrl + '/' + conversation.id,
		data: JSON.stringify(conversation.toJson()),
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		timeout: 60000,
		success: function(data) {
			data.localID = conversation.localID;
			var conversationObjectFromJson = createConversationObjectFromJson(data);

			conversationCollection[conversation.localID] = conversationObjectFromJson;
			currentConversation = Clone(conversationObjectFromJson);

			var gotoThisDialogue = currentDialogue;

			viewConversation(conversationObjectFromJson.localID, conversationObjectFromJson);
			viewPepperTalk(conversationObjectFromJson, conversationObjectFromJson.pepperTalks[gotoThisDialogue]);

			statusNotification("Saved successfully...", null, function(){
				$("#save-conversation").removeClass("is-loading");
			});
		},
		error: function(e) {
			$("#save-conversation").removeClass("is-loading");
			alertModal("Sorry, there was a problem saving the conversation. Please try again.");
		}
	});
}

function deleteConversation(conversationId){
	$.ajax({
		url: apiUrl + '/' + conversationId,
		type: 'DELETE',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		timeout: 60000,
		success: function(data) {
		},
		error: function(e) {
			$("#save-conversation").removeClass("is-loading");
			alertModal("Sorry there was a problem deleting the conversation. Please try again.");
		}
	});

}

function saveSetting(setting){
	var data = {'setting_id':1, 'setting_choose':setting, 'setting_dis':1};
	$.ajax({
		url: 'php/settings',
		type: 'PUT',
		data: JSON.stringify(data),
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		timeout: 60000,
		success: function(data) {
		},
		error: function(e) {
			alertModal("Sorry, there was a problem saving the settings. Please try again.");
		}
	});
}

function getSetting(){
	$.ajax({
		url: 'php/settings',
		type: 'GET',
		dataType: 'json',
		timeout: 60000,
		success: function(data) {
			var boxSetting = data[0].setting_choose;
			viewAppSettings(boxSetting);
		},
		error: function(e) {
			alertModal("Sorry, there was a problem getting the settings from the database. Please try again.");
		}
	});
}

function logoutSession(){
	account.Logout(function(result){
		if(result){
			window.location.replace('/signin.php');
		} else {
			alertModal("There was a problem logging out your account. Please try again.");
		}
	});
}