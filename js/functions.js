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