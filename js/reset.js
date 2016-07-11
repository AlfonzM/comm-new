$(document).ready(function() {
	$("#submit-pass").on("click", function(){
		submitNewPassword();
	});
});

function submitNewPassword(){
	var pass = $("#user-pass").val();
	var confirmPass = $("#confirm-user-pass").val();
	var token = $("#token").val();

	if(pass == "" || confirmPass == "" || pass != confirmPass){
		alert('Password and Confirm password did not match.');
		return;
	}

	var parameters = {
		"password" : pass,
		"confirm_password" : confirmPass,
		"token" : token
	};

	$.ajax({
		url: 'auth/client/reset',
		type: 'POST',
		dataType: 'json',
		data: parameters,
		success: function(data){
			if(data){
				window.location.replace('.');
			} else {
				alert("The password reset token has already expired. Please request for a new token.");
			}
		},
		error: function(e) {
			alert("Error: " + e);
		}
	});
}