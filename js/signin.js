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
  $("body").addClass("disable")

  /* Add Confirmation process function */
  /* Call 'reset()' if Confirmation failed */
}

function reset(){
  $("#log-in").removeClass("process");
  $("body").removeClass("disable");
  $("#user-pass").val('');
}

function sendEmail(){
  /* Insert Send Email function */
}
