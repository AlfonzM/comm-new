<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Communication</title>
  <!-- <link rel="shortcut icon" type="image/png" href="css/images/tiny-favicon.png"/> -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
  <script src="https://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
  <script src="js/session.js"></script>
  <script src="js/reset.js"></script>
  <link rel="stylesheet" type="text/css" href="css/template.css">
  <link rel="stylesheet" type="text/css" href="css/signin.css">
</head>

<body lang="en">
  <div class="card-wrapper card-1">
    <div id="signin-wrapper" class="card">
      <span class="title">ペパーの会話</span>
      <input id="user-pass" type="password" name="input-fields" placeholder="New Password" />
      <input id="confirm-user-pass" type="password" name="input-fields" placeholder="Confirm New Password" />
      <input type="hidden" id="token" name="token" value="<?php echo $_GET['token']; ?>" />

      <div id="submit-pass" class="confirm-button btn">
        <div class="content-wrapper">
          <div class="content">ログイン</div>
          <div class="content loading"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <span class="label">あなたのパスワードをリセットするには、下記のメールを入力してください。</span>
      <input id="reset-email" type="email" name="input-fields" placeholder="メールアドレス">
      <div id="send-email" class="confirm-button btn">
        <div class="content-wrapper">
          <div class="content">送信</div>
        </div>
      </div>
      <div class="option-divider"></div>
      <div id="go-login" class="button-icon btn">
        <i class="icon material-icons">&#xE5CB;</i>
        <span class="label">ログイン</span>
      </div>
    </div>
  </div>
</body>
</html>
