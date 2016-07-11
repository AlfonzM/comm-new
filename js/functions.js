function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function alertModal(message){
  $("body").prepend(
    '<div class="modal-wrapper">'+
    '<div class="modal confirm">'+
    '<div class="modal-header">'+
    '<span class="modal-title">Error</span>'+
    '</div>'+
    '<div class="modal-content">'+
    '<i class="material-icons">&#xE001;</i>'+
    '<span class="modal-message">'+ message +'</span>'+
    '</div>'+
    '<div class="modal-buttons button-container side-container">'+
    '<div class="button-wrapper">'+
    '<div id="confirm-action" class="button">はい</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
    ).addClass("modal-open");

  $modalElem = $(".modal-wrapper");

  $modalElem.find("#confirm-action").on("click", function(){
    $modalElem.remove();
    $("body").removeClass("modal-open");
  });
}

$(document).ready(function() {  
  $('body').hide();
  authenticateLogin();
});

function authenticateLogin(){
  console.log("authenticateLogin");
  $.ajax({
    url: 'php/authenticate',
    type: 'GET',
    dataType: 'json',
    timeout: 60000,
    async: false,
    // cache: false,
    success: function(data) {
      console.log(data);
      if(data){
        $('body').show();
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
      if(xhr.status == 401){
        window.location.replace('signin.php');
      } else {
        alertModal("Sorry, there was a problem connecting to the server. Please try again.");
      }
    }
  });
}