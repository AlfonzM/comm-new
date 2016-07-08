$(document).ready(function() {
  $("#log-in").on("click", function(){
    logIn();
    setTimeout(function(){ reset(); }, 3000);
  });

  $("#forgot-password").on("click", function(){
    $(".card-wrapper").removeClass("card-1");
    $(".card-wrapper").addClass("card-2");
  });

  $("#go-login").on("click", function(){
    sendEmail();

    $("#reset-email").val('');
    $(".card-wrapper").removeClass("card-2");
    $(".card-wrapper").addClass("card-1");
  });

  $("#send-email").on("click", function(){
    submitForgotPassword();
  });
});

function logIn(){
  $("#log-in").addClass("process");
  $("body").addClass("disable");

  var login_parameters = {
    "account_username": $("#user-email").val(),
    "account_password_string": $("#user-pass").val()
  };

  account.Login(login_parameters, function(result){
    if(result){
      window.location.href = '/communication';
    }

    reset();
  });
}

function reset(){
  $("#log-in").removeClass("process");
  $("body").removeClass("disable");
  $("#user-pass").val('');
}

function sendEmail(){
  /* Insert Send Email function */
}

function submitForgotPassword(){
  if($("#reset-email").val() == ""){
    alertModal("E-mail field should not be empty.");
    return;
  } else {
    var email = $("#reset-email").val();

    if(!isEmail(email)){
      alertModal("Please enter a valid e-mail address.");
      return;
    }

    account.ForgotPassword({"email" : email}, function(data){
      if(data){
        alertModal("An email has been sent to " + email + " with instructions on how to reset your password.");
      }
    });
  }
}