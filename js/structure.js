var conversationCollection = [];
var dialogueResponseCount = 0;

function Conversation(props = []){
      this.localID = props.localID || conversationCollection.length;
  this.pepperTalks = [];

           this.id = props.conversation_id || -1;
        this.title = props.conversation_title || "Untitled "+this.localID;
      this.trigger = props.conversation_trigger || "1";
     this.priority = props.conversation_priority || "1";
        this.sharp = props.conversation_sharp || -1;
        this.speed = props.conversation_speed || -1;
       this.client = props.conversation_client || -1;
       this.dis = props.conversation_dis || 1;

 this.addDialogue = function (pepperTalk){
   var dialogue = pepperTalk || new PepperTalk();
   dialogue.localID = this.pepperTalks.length;
   this.pepperTalks.push(dialogue);
   return dialogue;
 }

 if(props.length == 0 || !props.pepperTalks){
   this.addDialogue();
 }

 this.toJson = function(){
  var jsonPepperTalks = [];

  // TODO: jsonify the peppertalks
  var pepperTalk = this.pepperTalks[0];
  jsonPepperTalks.push(pepperTalk.toJson());

  return {
    "conversation_id": this.id,
    "conversation_title": this.title,
    "conversation_trigger": this.trigger,
    "conversation_priority": this.priority,
    "conversation_sharp": this.sharp,
    "conversation_speed": this.speed,
    "conversation_dialogFile": "",
    "conversation_language": "",
    "conversation_client": this.client,
    "conversation_dis": this.dis,
    "pepperTalks": jsonPepperTalks
  }
 }
}

function PepperTalk(props = []){
                  this.localID = -1;
                   this.parent = -1;
                   this.groups = [];
               this.pepperText = props.pepperTalk_text || "";
     
            this.id = props.pepperTalk_id || -1;
         this.group = props.pepperTalk_group || -1;
  this.conversation = props.pepperTalk_conversation || -1;
        this.output = props.pepperTalk_output || "";
        this.dis = props.pepperTalk_dis || 1;

 this.addResponse = function (group){
   var response = group || new Group();
   response.localID = dialogueResponseCount;
   response.localPepperTalkParent = this.localID;
   dialogueResponseCount++;
   this.groups.push(response);
   return response;
 }

 this.toJson = function(output){
  var jsonGroups = [];

  //todo: jsonify groups
  for(var index in this.groups){
    var group = this.groups[index];

    if(group.id == -1 && group.dis == 0){
      continue;
    }

    jsonGroups.push(group.toJson());
  }

  return {
    "pepperTalk_id": this.id,
    "pepperTalk_group": this.group,
    "pepperTalk_conversation": this.conversation,
    "pepperTalk_text": this.pepperText,
    "pepperTalk_output": output || this.output,
    "pepperTalk_dis": this.dis,
    "groups": jsonGroups
  }
 }
}


function Group(props = []){
                   this.localID = -1;
               this.userReplies = [];
            this.pepperResponse = ""; // pepper_text of child peppertalk
     this.localPepperTalkParent = -1; // localid of parent peppertalk
                     this.child = -1; // localid of child peppertalk
                    this.output = "";
           
                        this.id = props.group_id || -1;
          this.pepperTalkParent = props.group_pepperTalkParent || -1;
                       this.dis = props.group_dis || 1;
                   this.enabled = props.group_enabled + "" || 1;
  this.pepperParentConversation = props.group_pepperParentConversation || -1;

 this.addUserResponse = function(userReply){
   var userResponse = userReply || new UserReply();
   userResponse.localID = this.userReplies.length;
   this.userReplies.push(userResponse);
   return userResponse;
 }

 // this.setOutput = function(output){
 //  currentConversation.pepperTalks[this.child].output = output;
 // }

 // this.getOutput = function(){
 //  return currentConversation.pepperTalks[this.child].output;
 // }

 this.changeResponse = function($inputField, newVal){
   $inputField.val(newVal);
 }

 this.toJson = function(){
  var jsonPepperTalk = {};
  // jsonify peppertalk
  if(currentConversation.pepperTalks[this.child]){
    jsonPepperTalk = currentConversation.pepperTalks[this.child].toJson(this.output);
  }

  // jsonify userreplies
  var jsonUserReplies = [];
  for(var index in this.userReplies){
    var userReply = this.userReplies[index];

    if(userReply.id == -1 && userReply.dis == 0){
      continue;
    }

    jsonUserReplies.push(userReply.toJson());
  }

  return {
    "group_id": this.id,
    "group_pepperTalkParent": this.pepperTalkParent,
    "group_pepperParentConversation": this.pepperParentConversation,
    "group_dis": this.dis,
    "group_enabled": (this.enabled) ? 1 : 0,
    "userReplies": jsonUserReplies,
    "pepperTalk": jsonPepperTalk
  }
 }
}

function UserReply(props = []){
            this.localID = -1;
            this.text = props.userReply_answer || "";

       this.id = props.userReply_id || -1;
    this.group = props.userReply_group || "";
   this.answer = props.userReply_answer || "";
      this.dis = props.userReply_dis || 1;

  this.toJson = function(){
    return {
      "userReply_id": this.id,
      "userReply_group": this.group,
      "userReply_answer": this.text,
      "userReply_dis": this.dis
    }
  }
}

function Clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = Clone(obj[key]);

    return temp;
}
