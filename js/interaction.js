var currentDialogue = -1;
var currentConversation = null;

$(document).ready(function() {
  optionBox();
  toolBox();
  clickBubbleOption();
  navigateButton();
  $("#add-conversation").on("click", function(){
    addConversation();
  });
  clearConversation();
  toggleHide();

  $("#logout-button").on("click", function(){
    confirmModal('Are you sure you want to log-out?', function(){
      logoutSession();
    });
  });

  $("#view-app-settings").on("click", function(){
    getSetting();
    // viewAppSettings();
  });
});

function optionBox(){
  $(".drop-select li").on("click", function(){
    $optionBox = $(this).closest(".option-box");
    $selectInputText = $optionBox.find("input[name='option-input']");
    $selectInputValue = $optionBox.find("input[name='select-option']");
    newText = $(this).find("span").text();
    newVal = $(this).find("input[name='option-val']").val();
    $selectInputText.val(newText);
    $selectInputValue.val(newVal).change();
  });
}

function toolBox(){
  $(".tool").on("click", function(e){
    $tool = $(this);
    $dropOption = $(this).find(".bubble-dropdown");
    $dropOption.addClass("show");

    $(document).one("mouseup", function(e){
      $dropOption.removeClass("show");
    });

  });
}

function detectFocusOut($container, callback){
  $(document).one("mouseup", function(e){
    if (!$container.is(e.target) && $container.has(e.target).length === 0){
      callback();
      // $(this).unbind();
    }
  });
}

function clickBubbleOption(){
  $(".bubble-option").on("click", function(e){
    e.stopPropagation();
  });
}

function navigateButton(){
  $(".nav-button").unbind().on("click", function(){
    var $button = $(this);
    if(JSON.stringify(currentConversation) === JSON.stringify(conversationCollection[currentConversation.localID])){
      pageID = $button.attr("for");
      $(".nav-button.select").removeClass("select");
      $button.addClass("select");
      $(".page.select").removeClass("select");
      $("#"+pageID).addClass("select");
    }
    else{
      confirmModal("You haven't saved your changes yet.</br>Are you sure you want to leave this page?",
        function(){
          pageID = $button.attr("for");
          $(".nav-button.select").removeClass("select");
          $button.addClass("select");
          $(".page.select").removeClass("select");
          $("#"+pageID).addClass("select");
        });
    }
  });
}

function addConversation(conversation){
  var conversation_Obj = conversation || new Conversation();
  var conversation_ID = "conversation-"+conversation_Obj.localID;
  conversationCollection.push(conversation_Obj);

  $("#conversation-list").prepend(
    '<li id="' + conversation_ID + '" class="list-elem">'+
    '<i class="icon material-icons">&#xE0E0;</i>'+
    '<div class="detail-wrapper">'+
    '<div>'+
    '<span class="list-title">' + conversation_Obj.title + '</span>'+
    '</div>'+
    '<div>'+
    '<span class="list-sub-detail">'+
    'Priority number:'+
    '<span class="priority-number">' + conversation_Obj.priority + '<span>'+
    '</span>'+
    '</div>'+
    '</div>'+
    '<div class="trigger-update">'+
    '<span class="trigger">' + conversation_Obj.triggerName() + '</span>'+
    '</div>'+
    '<i id="remove-button" class="list-tool icon material-icons">&#xE872;</i>'+
    '</li>'
    );

  var $listElement = $("#"+conversation_ID);
  var $removeButton = $listElement.find("#remove-button");

  $listElement.unbind().on("click", function(){
    var temp_conversation = conversation_Obj || new Conversation();
    temp_conversation = Clone(conversationCollection[conversation_Obj.localID]);
    currentConversation = temp_conversation;
    viewConversation($listElement.attr('id').replace(/\D/g,''), temp_conversation);

    $(".page.select").removeClass("select");
    $("#conversation-page").addClass("select");
    $(".toggle-hide-container").addClass("show");
  });

  $removeButton.on("click", function(e){
    e.stopPropagation()
    var message = "Are you sure you want to remove this conversation?</br>You cannot undo this action.";
    confirmModal(message, function(){
      var temp_conversation = conversation_Obj || new Conversation();
      temp_conversation.dis = 0;
      deleteConversation(temp_conversation.id);
      $listElement.remove();
    });
  })

  $listElement.on("hover", function(){
    $listContainer = $(this).closest("ul");
    $listContainer.find(".list-element-focus").removeClass("list-element-focus");
    $(this).addClass("list-element-focus");
  });
}

function viewConversation(id, conversationObj){
  // Conversation Settings
  var $conversationNameField = $( "input[name='conversation-name']" );
  var $conversationTrigger = $( "#trigger-option-container" );
  var $conversationLanguage = $( "#language-option-container" );
  var $conversationSharp = $( "input[name='sharp-number']" );
  var $conversationPriority = $( "input[name='priority-number']" );
  var $conversationSpeed = $( "input[name='speed-number']" );

  $conversationNameField.val(conversationObj.title).change();
  $conversationTrigger.find("input[name='option-val'][value='"+conversationObj.trigger+"']").closest("li").click();
  $conversationLanguage.find("input[name='option-val'][value='"+conversationObj.language+"']").closest("li").click();
  // $conversationTrigger.find(".drop-select > li").eq(conversationObj.trigger - 1).click();
  // $conversationLanguage.find(".drop-select > li").eq(conversationObj.language - 1).click();
  $conversationPriority.val(conversationObj.priority);
  $conversationSharp.val(conversationObj.sharp);
  $conversationSpeed.val(conversationObj.speed);

  // Conversation Reponse List
  var $pepperQuestionField = $( "input[name='pepper-question']" );
  var $questionBreadcrumbList = $( "#question-breadcrumb-list" );
  var $dialogueList = $( "#dialogue-list" );
  var pepperQuestion = "";

  $pepperQuestionField.prop("readonly", false);

  pepperQuestion = conversationObj.pepperTalks[0].pepperText;
  currentDialogue = conversationObj.pepperTalks[0].localID;

  $pepperQuestionField.val(pepperQuestion);
  $dialogueList.empty();
  $questionBreadcrumbList.empty();
  $questionBreadcrumbList.append(
    '<div class="breadcrumb"><span>'+ $pepperQuestionField.val() +'</span></div>'
    );

  $conversationNameField.unbind().on("change keydown paste input", function(){
    conversationObj.title = $(this).val();
    // Bind Conversation Title to Conversation Title Input
    $('#conversation-title').text($(this).val());
  });
  $conversationTrigger.find("input[name='select-option']").unbind().on("change", function(){
    // If trigger == 4, or "Talk", disable first pepper question
    if($(this).val() == 4){
      $('#conversation-form-header').addClass('hide');
    } else {
      $('#conversation-form-header').removeClass('hide');
    }
    conversationObj.trigger = $(this).val();
  });
  $conversationLanguage.find("input[name='select-option']").unbind().on("change", function(){
    conversationObj.language = $(this).val();
  });
  $conversationPriority.unbind().on("change", function(){
    conversationObj.priority = $(this).val();
  });
  $conversationSharp.unbind().on("change", function(){
    conversationObj.sharp = $(this).val();
  });
  $conversationSpeed.unbind().on("change", function(){
    conversationObj.speed = $(this).val();
  });

  // Bind Pepper Question
  $pepperQuestionField.unbind().on("change keydown paste input", function(){
    conversationObj.pepperTalks[currentDialogue].pepperText = $(this).val();
    // Bind Pepper Question to Pepper Question Input
    $(".breadcrumb:last-child").find("span").text($(this).val());
  });

  // Populate
  if(conversationObj.pepperTalks.length > 0){
    viewPepperTalk(conversationObj, conversationObj.pepperTalks[0]);
  }

  // Add Response
  $("#add-response-group").unbind().on("click", function(){
    var response = conversationObj.pepperTalks[currentDialogue].addResponse();
    addResponseGroup(conversationObj, response);
  });

  // Save Conversation
  $("#save-conversation").unbind().on("click", function(){
    // Validate Conversation fields
    if(!validateRequiredField($conversationNameField, "Conversation Name cannot be empty.")){
      return;
    }
    if(!validateRequiredField($conversationSharp, "Sharp cannot be empty.")){
      return;
    }
    if(!validateRequiredField($conversationSpeed, "Speed cannot be empty.")){
      return;
    }
    if(!validateRequiredField($conversationPriority, "Priority number cannot be empty.")){
      return;
    }
    if(!validateRequiredField($pepperQuestionField, "Pepper Question cannot be empty.")){
      return;
    }

    // Validate current pepper talk group fields
    for(index in conversationObj.pepperTalks[currentDialogue].groups){
      var group = conversationObj.pepperTalks[currentDialogue].groups[index];
      if(!validateGroupFields(group)){
        return;
      }
    }

    var conversationListElem = $("#conversation-"+id);

    // Update temp to conversation collection
    conversationCollection[conversationObj.localID] =  conversationObj;
    currentConversation = Clone(conversationObj);

    // Save Home Page Info
    conversationObj.title = $conversationNameField.val();
    conversationListElem.find(".list-title").text($conversationNameField.val());
    conversationObj.trigger = $("#trigger-option-container").find("input[name='select-option']").val();
    conversationListElem.find(".trigger").text($("#option").val());
    conversationObj.priority = $conversationPriority.val();
    conversationListElem.find(".priority-number").text($conversationPriority.val());

    if(currentConversation.id <= 0){
      saveConversation(conversationObj);
    } else {
      updateConversation(conversationObj);
    }
  });

  // Change conversation title
  $conversationNameField.val(conversationObj.title).change();

  // Show/Hide first pepper question field if trigger == 4 or "Talk"
  if(conversationObj.trigger == 4){
    $('#conversation-form-header').addClass('hide');
  }
}

function clearConversation(){
  $("#conversation-list-container").find("#remove-item").on("click",
    function(){
      for(i = 0; i < conversationCollection.length; i++){
        conversationCollection[i].dis = 0;
        $("#conversation-"+conversationCollection[i].localID).remove();
      }
    });
}

function toggleHide(){
  $(".toggle-hide").on("click", function(){
    $(this).closest(".toggle-hide-container").toggleClass("show");
  });
}

function validateRequiredField($elem, errorMessage = ""){
  if($elem.val().trim() == ""){
    invalidizeField($elem);

    if(errorMessage){
      alertModal(errorMessage);
    }

    return false;
  }

  return true;
}

function invalidizeField($elem){
  $elem.addClass('invalid');

  $elem.on("keypress", function(){
    if($(this).val().trim() != ""){
      $(this).removeClass('invalid');
    }
  });
}

function validateGroupFields(response){
  var $pepperQuestionField = $( "input[name='pepper-question']" );
  var $responseGroupElem = $('#response-group-'+response.localID);
  var $userResponseList = $responseGroupElem.find("#user-response-list");

  // Check if first pepper question
  var $pepperQuestionField = $( "input[name='pepper-question']" );
  if($pepperQuestionField.val().trim() == ""){
    invalidizeField($pepperQuestionField);
    alertModal("Pepper Question cannot be empty.");
    return false;
  }

  var hasEmpty = false;

  // Check if there is an empty user response
  $userResponseList.children('li').each(function(){
    $userResponseInputField = $(this).find("input[name='user-response']");
    if($userResponseInputField.val().trim() == ""){
      invalidizeField($userResponseInputField);
      alertModal("User Responses cannot be empty.");
      hasEmpty = true;
    }
  });

  if(hasEmpty){ return false; }

  // Check if pepper reply is empty
  if(response.pepperResponse.replace(/ /g,'')){
    return true;
  }
  else{
    invalidizeField($responseGroupElem.find("input[name='pepper-reply']"));
    alertModal("Pepper Reply should not be empty.");
    return false;
  }
}

function addResponseGroup(conversationObj, response){
  var currDialogue = conversationObj.pepperTalks[currentDialogue];
  var responseID = "response-group-"+response.localID;

  if(response.child == -1){
    var newDialogue = conversationObj.addDialogue();
    newDialogue.parent = response.localPepperTalkParent;
    newDialogue.pepperText = response.pepperResponse;
    response.child = newDialogue.localID;
  }

  $("#dialogue-list").prepend(
    '<li id="'+ responseID +'" class="dialogue-box">'+
    '<div class="row-no-wrapper">'+
    '<div class="col-wrapper">'+
    '<h1>User Response</h1>'+
    '</div>'+
    '<div class="side-container">'+
    '<div id="add-user-response" class="button-icon tool-tip-container">'+
    '<i class="material-icons">&#xE03B;</i>'+
    '<div class="tool-tip right1">Add User Response</div>'+
    '</div>'+
    '<div id="clear-user-response" class="button-icon delete tool-tip-container">'+
    '<i class="material-icons">&#xE16C;</i>'+
    '<div class="tool-tip">Remove all</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '<div class="option-divider"></div>'+
    '<ul id="user-response-list" class="response-box"></ul>'+
    '<div class="option-divider"></div>'+
    '<div class="col-wrapper">'+
    '<h1>Pepper Reply</h1>'+
    '</div>'+
    '<div class="col-wrapper">'+
    '<input type="text" name="pepper-reply" placeholder="What is Pepper\'s response?" value="'+response.pepperResponse+'" required>'+
    '</div>'+
    '<div class="option-divider"></div>'+
    '<div class="row-no-wrapper bottom-section">'+
    '<div class="col-wrapper">'+
    '<div class="col-wrapper">'+
    '<h1>Box Output</h1>'+
    '</div>'+
    '<div class="col-wrapper">'+
    '<input type="text" name="box-output" placeholder="What value will be passed on trigger?" value="'+response.output+'">'+
    '</div>'+
    '</div>'+
    '<div class="col-wrapper row-3">'+
    '<div class="col-wrapper">'+
    '<h1>Display</h1>'+
    '</div>'+
    '<div class="col-wrapper">'+
    '<input id="'+ responseID +'-display" type="checkbox" name="display-response">'+
    '<label for="'+ responseID +'-display">'+
    '<div class="checkbox"></div>'+
    '<span class="switch-label"></span>'+
    '</label>'+
    '</div>'+
    '</div>'+
    '<div class="button-container side-container">'+
    '<div class="button-wrapper">'+
    '<div id="add-reply" class="button">Reply</div>'+
    '</div>'+
    '<div class="button-wrapper">'+
    '<div id="delete-response" class="button delete">Delete</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</li>'
    );

  var $responseGroupElem = $('#'+responseID);
  var $userResponseList = $responseGroupElem.find("#user-response-list");

  $responseGroupElem.find("input[name='display-response']").attr("checked", (response.enabled==1 || response.enabled === "undefined") ? true : false);


  // Add Response Reply
  $responseGroupElem.find("#add-reply").on("click", function(){
    if(validateGroupFields(response)){
      viewDialogueReply(conversationObj, response);
    }
  });

  // Delete Response
  $responseGroupElem.find("#delete-response").on("click", function(){
    var message = "Are you sure you want to remove this?</br>You cannot undo this action.";
    confirmModal(message, function(){
      response.dis = 0;
      $responseGroupElem.closest(".dialogue-box").remove();
    });
  });

  // Add 1 initial user response on add new response group
  if(response.id < 0 && response.userReplies.length <= 0){
    var newUserResponse = response.addUserResponse();
    appendUserResponse($userResponseList, response, newUserResponse);
  }

  // Add user response
  $responseGroupElem.find("#add-user-response").on("click", function(){
    var newUserResponse = response.addUserResponse();
    appendUserResponse($userResponseList, response, newUserResponse);
  });

  // Empty user response list
  $responseGroupElem.find("#clear-user-response").on("click", function(){
    var elementCount = $responseGroupElem.closest(".dialogue-box").find("#user-response-list > li").length;
    if(elementCount > 0){
      var message = "You are about to delete "+elementCount+" element/s.</br>Are you sure about this?";
      confirmModal(message, function(){
        for(ctr = 0; ctr < response.userReplies.length; ctr++){
          if(response.userReplies[ctr].dis == 1){
            response.userReplies[ctr].dis = 0;
          }
        }
        $responseGroupElem.closest(".dialogue-box").find("#user-response-list").empty();
      });
    }
  });

  // Bind Pepper Reply
  var $pepperReplyElem = $responseGroupElem.find("input[name='pepper-reply']");
  $pepperReplyElem.on("change", function(){
    var pepperReply = $(this).val();
    response.pepperResponse = pepperReply;
    if(response.child > -1){
      conversationObj.pepperTalks[response.child].pepperText = pepperReply;
    }
  });

  // Bind Box Output
  var $boxOutput = $responseGroupElem.find("input[name='box-output']");
  $boxOutput.on("change", function(){
    response.output = ($(this).val());

    if(response.child > -1){
      conversationObj.pepperTalks[response.child].output = response.output;
    }
  });

  // Bind Display value
  var $displayBox = $responseGroupElem.find("input[name='display-response']");
  $displayBox.on("change", function(){
    response.enabled = ($(this).is(":checked")) ? 1 : 0;
  });
}

function appendUserResponse($listContainer, responseObj, userResponse){
  var userResponseID = "user-response-"+ currentDialogue +"-"+
  responseObj.localID +"-"+
  userResponse.localID;

  $listContainer.prepend(
    '<li id="'+ userResponseID +'" class="user-response">'+
    '<div class="row-no-wrapper">'+
    '<div class="col-wrapper">'+
    '<input type="text" name="user-response" placeholder="User Response" value="'+userResponse.text+'" required>'+
    '</div>'+
    '<div class="side-container row-3">'+
    '<div class="button-icon delete tool-tip-container">'+
    '<i class="material-icons">&#xE5CD;</i>'+
    '<div class="tool-tip">'+
    'Remove'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</li>'
    );

  var $userResponseElem = $('#'+userResponseID);
  var $userResponseText = $userResponseElem.find("input[name='user-response']");
  var $removeUserResponse = $userResponseElem.find(".delete");

  $userResponseText.on("change", function(){
    userResponse.text = $(this).val();
  });

  // Delete user reply
  // Delete user response
  $removeUserResponse.on("click", function(){
    var message = "Are you sure you want to delete this user response? You cannot undo this action.";
    confirmModal(message, function(){
      userResponse.dis = 0;
      $removeUserResponse.closest(".user-response").remove();
    });
  });
}

function viewAppSettings(boxSetting){
  $("body").prepend(
    '<div class="modal-wrapper">'+
    '<div id="box-settings-modal" class="modal">'+
    '<div class="modal-header">'+
    '<span class="modal-title">アプリの設定</span>'+
    '<div class="row-reverse">'+
    '<i id="close-modal" class="material-icons modal-button-icon">&#xE5CD;</i>'+
    '</div>'+
    '</div>'+
    '<div class="modal-content">'+
    '<div class="row-no-wrapper">'+
    '<div class="col-wrapper">'+
    '<h1>ボックスの設定</h1>'+
    '</div>'+
    '<div class="row-no-wrapper">'+
    '<input id="box-random" type="radio" name="box-setting" value="Random"/>'+
    '<label for="box-random">'+
    '<div class="checkbox"></div>'+
    '<span>ランダム</span>'+
    '</label>'+
    '<input id="box-priority" type="radio" name="box-setting" value="Priority"/>'+
    '<label for="box-priority">'+
    '<div class="checkbox"></div>'+
    '<span>優先</span>'+
    '</label>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
    );

  var $settingModal = $("#box-settings-modal");
  var $boxSetting = $settingModal.find("input[name='box-setting']");
  var $closeButton = $settingModal.find("#close-modal");

  $settingModal.find("input[name='box-setting'][value='"+boxSetting+"']").attr("checked", "checked");


  $closeButton.on("click", function(){
    $(this).closest(".modal-wrapper").remove();
  });

  // Change Box Settings value
  $boxSetting.on("change", function(){
    saveSetting($(this).val());
  });

}