$(document).ready(function() {
	fetchConversations();
});

function fetchConversations(){
	$.ajax({
		url: '/communication_web/php/conversations',
		type: 'GET',
		dataType: 'json',
		success: function(conversations) {
			createConversationCollectionFromJson(conversations);
		},
		error: function(e) {
			alert("ERROR");
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

	// console.log(newConvo);
	// console.log(JSON.stringify(newConvo));

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
				// currentPepperTalk = groupProps.pepperTalk;
				
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
	// console.log("THE COLLECTION BEFORE SAVE: " + JSON.stringify(conversationCollection));
	console.log("SAVE THIS: " + JSON.stringify(conversation));
	// console.log("SAVE THIS JSON: " + JSON.stringify(conversation.toJson()));

	// return;

	$.ajax({
		url: '/communication_web/php/conversations',
		data: JSON.stringify(conversation.toJson()),
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		success: function(data) {
			console.log("data after ajax: " + JSON.stringify(data));

			data.localID = conversation.localID;

			var conversationObjectFromJson = createConversationObjectFromJson(data);

			// console.log(JSON.stringify(c));
			
			// Update temp to conversation collection
			conversationCollection[conversation.localID] = conversationObjectFromJson;
			currentConversation = Clone(conversationObjectFromJson);
			console.log("current conversation: ");
			console.log(currentConversation);

			var gotoThisDialogue = currentDialogue;

			viewConversation(conversation.localID, currentConversation);
			viewPepperTalk(currentConversation, conversation.pepperTalks[gotoThisDialogue]);

			// console.log("THE COLLECTION AFTER SAVE: " + JSON.stringify(conversationCollection));
		},
		error: function(e) {
			console.log(e);
			alert("ERROR");
		}
	});
}

function updateConversation(conversation){
	console.log('update');
	console.log(JSON.stringify(conversation.toJson()));
	console.log(JSON.stringify(conversation));

	$.ajax({
		url: '/communication_web/php/conversations/' + conversation.id,
		data: JSON.stringify(conversation.toJson()),
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		processData: false,
		success: function(data) {
			console.log("data after ajax " + data);

			data.localID = conversation.localID;
			var conversationObjectFromJson = createConversationObjectFromJson(data);

			conversationCollection[conversation.localID] = conversationObjectFromJson;
			currentConversation = Clone(conversationObjectFromJson);

			var gotoThisDialogue = currentDialogue;

			viewConversation(conversation.localID, currentConversation);
			viewPepperTalk(currentConversation, conversation.pepperTalks[gotoThisDialogue]);

			console.log("current conversation after update:");
			console.log(currentConversation);
		},
		error: function(e) {
			console.log(e);
			alert("ERROR");
		}
	});
}