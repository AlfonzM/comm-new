$(document).ready(function() {

});

function testData(){
  var conversation = new Conversation();
  var dialogue = conversation.addDialogue();
  dialogue.changeText("text1");

  var dialogue2 = conversation.addDialogue();
  dialogue2.changeText("text2");

  displayFamily(conversation.dialogues);
}

function displayFamily(dialogue){
  for(i = 0; i < dialogue.length; i++){
    var d = dialogue[i];
  }
}

function viewDialogueReply(conversation, response){
  var $dialogueListElem = $("#dialogue-list");
  var parentDialogue = currentDialogue;
  var $pepperQuestionField = $( "input[name='pepper-question']" );
  var currentPepperTalkParent = response.localPepperTalkParent;

  $dialogueListElem.empty();

  if(response.child == -1){
    var newDialogue = conversation.addDialogue();
    newDialogue.parent = response.localPepperTalkParent;
    newDialogue.pepperText = response.pepperResponse;
    response.child = newDialogue.localID;
    currentDialogue = newDialogue.localID;
    $pepperQuestionField.val(response.pepperResponse).change();
  }
  else{
    currentDialogue = response.child;
    viewPepperTalk(conversation, conversation.pepperTalks[response.child]);
  }

  if(currentPepperTalkParent == -1){
    $pepperQuestionField.prop("readonly", false);
  }
  else{
    $pepperQuestionField.prop("readonly", true);
  }

  // Breadcrumbs
  displayBreadcrumbs(conversation);
}

function displayBreadcrumbs(conversation){
  var $questionBreadcrumbList = $("#question-breadcrumb-list");
  $questionBreadcrumbList.empty();

  // Display Breadcrumbs
  for(parent = conversation.pepperTalks[currentDialogue].localID; parent > -1;
    parent = conversation.pepperTalks[parent].parent){
    var pepperQuestion = conversation.pepperTalks[parent].pepperText;
    $questionBreadcrumbList.prepend(
      '<div class="breadcrumb" data-peppertalk-link="'+conversation.pepperTalks[parent].localID+'"><span>'+ pepperQuestion +'</span></div>'
    );
  }

  // Bind Breadcrumbs
  $(".breadcrumb:not(:last-of-type)").on("click", function(){
    var pepperTalkLink = $(this).data("peppertalk-link");

    // Before navigating via breadcrumbs, check if user response and pepper reply fields arent empty
    for(index in conversation.pepperTalks[currentDialogue].groups){
      var group = conversation.pepperTalks[currentDialogue].groups[index];
      if(!validateGroupFields(group)){
        return;
      }
    }

    viewPepperTalk(conversation, conversation.pepperTalks[pepperTalkLink]);
  });
}

function viewPepperTalk(conversation, pepperTalk){
  var $pepperQuestionField = $( "input[name='pepper-question']" );

  currentDialogue = pepperTalk.localID;
  displayBreadcrumbs(conversation);
  $("#dialogue-list").empty();

  $pepperQuestionField.val(pepperTalk.pepperText);

  if(pepperTalk.parent == -1){
    $pepperQuestionField.prop("readonly", false);
  }
  else{
    $pepperQuestionField.prop("readonly", true);
  }


  for(ctr = 0; ctr < pepperTalk.groups.length; ctr++){
    if(pepperTalk.groups[ctr].dis == 1){
      addResponseGroup(conversation, pepperTalk.groups[ctr]);
      for(ctr2 = 0; ctr2 < pepperTalk.groups[ctr].userReplies.length; ctr2++){
        if(pepperTalk.groups[ctr].userReplies[ctr2].dis == 1){
          var $responseGroupElem = $("#response-group-"+pepperTalk.groups[ctr].localID);
          var $userResponseList = $responseGroupElem.find("#user-response-list");
          appendUserResponse($userResponseList, pepperTalk.groups[ctr], pepperTalk.groups[ctr].userReplies[ctr2]);
        }
      }

    }
  }
}

function confirmModal(message, callback){
  $("body").prepend(
    '<div class="modal-wrapper">'+
      '<div class="modal confirm">'+
        '<div class="modal-header">'+
          '<span class="modal-title">Confirm</span>'+
        '</div>'+
        '<div class="modal-content">'+
          '<i class="material-icons">&#xE002;</i>'+
          '<span class="modal-message">'+ message +'</span>'+
        '</div>'+
        '<div class="modal-buttons button-container side-container">'+
          '<div class="button-wrapper">'+
            '<div id="confirm-action" class="button">はい</div>'+
          '</div>'+
          '<div class="button-wrapper">'+
            '<div id="cancel-action" class="button delete">いいえ</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'
  ).addClass("modal-open");

  $modalElem = $(".modal-wrapper");

  $modalElem.find("#confirm-action").on("click", function(){
    callback();
    $modalElem.remove();
    $("body").removeClass("modal-open");
  });

  $modalElem.find("#cancel-action").on("click", function(){
    $modalElem.remove();
    $("body").removeClass("modal-open");
  });
}

function statusNotification(message, error = false, callback){
  $(".status-notify").remove();
  var iconDiv = '<i class="material-icons">&#xE5CA;</i>';
  // Status Icon
  if(error){
    iconDiv = '<i class="material-icons">&#xE000;</i>';
  }

  $("body").append(
    '<div class="status-notify">'+
      '<span>'+
        iconDiv +
        String(message) +
      '</span>'+
    '</div>'
  );

  var $statusElem = $(".status-notify");

  if(error){
    $statusElem.addClass("error");
  }

  callback();

  setTimeout(function(){
    $statusElem.addClass("remove");
    $statusElem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
      function(e) {
        $statusElem.remove();
      }
    );
  }, 2500);
}
