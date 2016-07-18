$(document).ready(function() {
  // Press login button on login
  $("#log-in").on("click", function(){
    logIn();
    setTimeout(function(){ reset(); }, 3000);
  });

  // Press submit button on forgot pass
  $("#send-email").on("click", function(){
    submitForgotPassword();
  });

  $("#forgot-password").on("click", function(){
    $(".card-wrapper").removeClass("card-1");
    $(".card-wrapper").addClass("card-2");
  });

  $("#go-login").on("click", function(){

    $("#reset-email").val('');
    $(".card-wrapper").removeClass("card-2");
    $(".card-wrapper").addClass("card-1");
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
      window.location.replace('.');
    } else {
      alert('Invalid login. Please try again.')
    }

    reset();
  });
}

function reset(){
  $("#log-in").removeClass("process");
  $("#send-email").removeClass("process");
  $("body").removeClass("disable");
  $("#user-pass").val('');
}

function submitForgotPassword(){
  if($("#reset-email").val() == ""){
    alert("E-mail field should not be empty.");
    return;
  } else {
    var email = $("#reset-email").val();

    if(!isEmail(email)){
      alert("Please enter a valid e-mail address.");
      return;
    }
    
    // Set button to loading
    $("#send-email").addClass("process");
    $("body").addClass("disable");

    account.ForgotPassword({"email" : email}, function(data){
      reset();

      if(data){
        alert("An email has been sent to " + email + " with instructions on how to reset your password.");
      }
    });
  }
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}