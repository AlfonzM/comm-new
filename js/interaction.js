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
});

function optionBox(){
  $(".drop-select li").on("click", function(){
    $optionBox = $(this).closest(".option-box");
    $selectInputText = $optionBox.find("input[name='option-input']");
    $selectInputValue = $optionBox.find("input[name='select-option']");
    newText = $(this).find("span").text();
    newVal = $(this).find("input[type='number']").val();

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
    // console.log(JSON.stringify(currentConversation)+"\n====================\n "+JSON.stringify(conversationCollection[currentConversation.localID]));
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

function listElemHover($element){
  $element.on("hover", function(){
    $listContainer = $(this).closest("ul");
    $listContainer.find(".list-element-focus").removeClass("list-element-focus");
    $(this).addClass("list-element-focus");
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
    '<span class="trigger">Detect Human</span>'+
    '</div>'+
    '<i id="remove-button" class="list-tool icon material-icons">&#xE872;</i>'+
    '</li>'
    );

  var $listElement = $("#"+conversation_ID);
  var $removeButton = $listElement.find("#remove-button");

  listElemHover($listElement);

  $listElement.unbind().on("click", function(){
    var temp_conversation = conversation_Obj || new Conversation();
    temp_conversation = Clone(conversationCollection[conversation_Obj.localID]);
    currentConversation = temp_conversation;
    viewConversation($listElement.attr('id').replace(/\D/g,''), temp_conversation);

    $(".page.select").removeClass("select");
    $("#conversation-page").addClass("select");
    $(".toggle-hide-container").addClass("show");
  });

  $removeButton.on("click", function(){
    temp_conversation.remove = 1;
    $listElement.remove();
  })
}

function viewConversation(id, conversationObj){
  // Conversation Settings
  var $conversationNameField = $( "input[name='conversation-name']" );
  var $conversationTrigger = $( "#trigger-option-container" );
  var $conversationPriority = $( "input[name='priority-number']" );

  $conversationNameField.val(conversationObj.title).change();
  $conversationTrigger.find(".drop-select > li").eq(conversationObj.trigger - 1).click();
  $conversationPriority.val(conversationObj.priority);

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
    conversationObj.trigger = $(this).val();
  });
  $conversationPriority.unbind().on("change", function(){
    conversationObj.priority = $(this).val();
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

    // console.log("TO SAVE: " + JSON.stringify(conversationObj));

    console.log("convo before save/update:");
    console.log(currentConversation);

    if(currentConversation.id <= 0){
      saveConversation(conversationObj);
    } else {
      updateConversation(conversationObj);
    }
  });
}

function clearConversation(){
  $("#conversation-list-container").find("#remove-item").on("click",
    function(){
      for(i = 0; i < conversationCollection.length; i++){
        conversationCollection[i].remove = 1;
        $("#conversation-"+conversationCollection[i].localID).remove();
      }
    });
}

function toggleHide(){
  $(".toggle-hide").on("click", function(){
    $(this).closest(".toggle-hide-container").toggleClass("show");
  });
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
    '<input type="text" name="pepper-reply" placeholder="What is Pepper\'s response?" value="'+response.pepperResponse+'">'+
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

  $responseGroupElem.find("input[name='display-response']").attr("checked", response.display);

  // Add Response Reply
  $responseGroupElem.find("#add-reply").on("click", function(){
    if(response.pepperResponse.replace(/ /g,'')){
      viewDialogueReply(conversationObj, response);
    }
    else{
      alertModal("Pepper Reply should not be empty.");
    }
  });

  // Delete Response
  $responseGroupElem.find("#delete-response").on("click", function(){
    var message = "Are you sure you want to remove this?</br>You cannot undo this action.";
    confirmModal(message, function(){
      response.remove = 1;
      $responseGroupElem.closest(".dialogue-box").remove();
    });
  });

  // Add 1 initial user response on add new response group
  if(response.userReplies.length <= 0){
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
          if(response.userReplies[ctr].remove != 1){
            response.userReplies[ctr].remove = 1;
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

    console.log(response);

    if(response.child > -1){
      conversationObj.pepperTalks[response.child].output = response.output;
    }
  });

  // Bind Display value
  var $displayBox = $responseGroupElem.find("input[name='display-response']");
  $displayBox.on("change", function(){
    response.display = $(this).is(":checked");
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
    '<input type="text" name="user-response" placeholder="User Response" value="'+userResponse.text+'">'+
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

  $removeUserResponse.on("click", function(){
    var message = "Are you sure you want to delete this user response? You cannot undo this action.";
    confirmModal(message, function(){
      userResponse.remove = 1;
      $removeUserResponse.closest(".user-response").remove();
    });
  });
}
