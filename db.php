<?php
session_start();
$alert = '';
$status = 'ERR';

if(isset($_GET['exit'])) {
    $_SESSION['user'] = null;
    exit( json_encode(['status'=>'OK']) );
}

class DB extends PDO {
    public function __construct(){
        $host = '127.0.0.1';
        $db   = 'mydb';
        $user = 'mysql';
        $pass = 'mysql';
        $charset = 'utf8';
        $dsn = "mysql:host=$host; dbname=$db; charset=$charset";
        $opt =  [
          PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        return parent::__construct($dsn, $user, $pass, $opt);
    }
}

if (isset($_GET['check'])) {
	if (isset($_SESSION['user']))
		$status = 'OK';
}
else if (isset($_GET['save'])) {
	if (!isset($_SESSION['user']))
		$alert = 'Вы не авторизованы';
	else {
		$db = new DB();

		$db
			->prepare("DELETE FROM save WHERE userId = :id")
			->execute([ 'id' => $_SESSION['user']['id'] ]);
			
		
		$sth = $db
			->prepare("INSERT INTO save SET userId=:id, save=:content")
			->execute([
				'id' => $_SESSION['user']['id'],
				'content' => $_POST['content'],
			]);
		
		
		$status = 'OK';
	}
}
else if (isset($_GET['load'])) {
	if (!isset($_SESSION['user']))
		$alert = 'Вы не авторизованы';
	else {
		$db = new DB();
    
		$sth = $db->prepare("SELECT * FROM save WHERE userId=?");
		$sth->execute([ $_SESSION['user']['id'] ]);
		$saveData = $sth->fetch();
		
		if ($saveData) {
			$status = 'OK';
			$alert = $saveData['save'];
		}
	}
}
else if(!empty($_POST['login']) && !empty($_POST['pass']) && !empty($_POST['pass2'])) {
    $db = new DB();
    
    $sth = $db->prepare("SELECT count(*) FROM user WHERE login=?");
    $sth->execute([$_POST['login']]);
    $cnt = $sth->fetchColumn();
    
    if($cnt>0) {
        $alert = 'Пользователь с таким логином уже есть в базе!!';
    }
    else {
        $sth = $db
            ->prepare("INSERT INTO user SET 
              login=:login, pass=:pass
              ")
            ->execute([
                'login' => $_POST['login'],
                'pass' => password_hash($_POST['pass'], PASSWORD_DEFAULT),
            ]);
        $status = 'OK';
    }
}
else if(!empty($_POST['login']) && !empty($_POST['pass'])) {
    $db = new DB();
    
    $sth = $db->prepare("SELECT * FROM user WHERE login=?");
    $sth->execute([$_POST['login']]);
    $user = $sth->fetch();
    if($user) {
		//$sth = $db->prepare("SELECT autherrcnt FROM user WHERE id=?");
		//$sth->execute([$user['id']]);
		//$autherrcnt = $sth->fetchColumn();
		/*if($autherrcnt>3) {
			$db->prepare("UPDATE user SET status=0 WHERE id=?")->execute([$user['id']]);
			$alert = 'Уважаемый '.$user['name'].', ваша учётная запись заблокирована';
		}
		else
		{*/
			if(password_verify($_POST['pass'], $user['pass'])) {
				$_SESSION['user'] = $user;
				//$db->prepare("UPDATE user SET authdate=:date WHERE id=:id")->execute('id'=>$user['id']]);
				$alert = 'Уважаемый '.$user['login'].', вы успешно авторизовались';
				$status = 'OK';
			}
			else {
				//$db->prepare("UPDATE user SET autherrcnt=`autherrcnt`+1 WHERE id=?")->execute([$user['id']]);
				$alert = 'Пароль не подходит';
			}
		//}
    }
    else {$alert = 'Пользователь не найден';}
}

echo json_encode(['status'=>$status, 'alert'=>$alert]);
?>