var account = function(){

  function Register(parameters, callback_function){

    // var parameters = {
    //  "account_username": username,
    //  "account_password_string": password_string,
    //  "account_email": email
    //  }

    $.ajax({
      url: 'auth/client/register',
      data: parameters,
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        /* Success code */
        callback_function(data);
      },
      error: function() {
        /* Error code */
        // Unable to connect to url
        callback_function(false);
      }
    });

  }

  function Login(parameters, callback_function){
    // var parameters = {
    //  "account_username": username,
    //  "account_password_string": password_string
    //  }

    $.ajax({
      url: 'auth/client/login',
      data: parameters,
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        callback_function(data);
      },
      error: function(e) {
        callback_function(false);
      }
    });
  }

  function Logout(callback_function){
    var result = false;
    $.ajax({
      url: 'auth/client/logout',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        callback_function(data);
      },
      error: function() {
        callback_function(false);
      }
    });

  }

  return{
    Register: Register,
    Login: Login,
    Logout: Logout
  };

}();