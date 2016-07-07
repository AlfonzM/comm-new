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