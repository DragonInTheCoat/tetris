class Communicator
{
	constructor()
	{
		this.xhr = new XMLHttpRequest();
		/*this.xhr.open(this.method, './db.php');
		this.xhr.open('GET', './db.php');
		this.xhr.responseType = 'json';
		let formData = new FormData(this);
		this.xhr.send(formData);
		alert(this.xhr.response['alert']);*/
		this.AuthRegister();
	}
	
	AuthRegister(data) {
		let xhr = this.xhr;
		xhr.open('POST', './db.php');
		xhr.responseType = 'json';
		let formData = new FormData(data);
		xhr.send(formData);
		console.log(xhr);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				if(xhr.response['status']=='ERR')
					alert(xhr.response['alert']);
				else {
					document.getElementById('container').innerHTML = 'Вы авторизованы.<br><br> <form method="POST" name="exitform"><input id="exit" class="waves-effect purple btn" type="submit" value="Выйти"></form>';
				}
			}
		};
		//alert(this.xhr.response['alert']);
	}
}

/*class User
{
	constructor(login, pass)
	{
		//авторизация или регистрация
	}
}*/

document.forms[0].onsubmit = function(event) {
	console.log(event);
	event.preventDefault();
	
	let com = new Communicator(this);
	/*com.xhr.onload = function () {
		if (xhr.readyState === xhr.DONE) {
			if (xhr.status === 200) {
				//console.log(xhr.response);
				//console.log(xhr.responseText);
				if(xhr.response['status'] == 'OK')
				{
					document.getElementById('container').innerHTML = 'Вы авторизованы.<br><Br> <form method="POST" name="exitform"><input id="exit" class="waves-effect purple btn" type="submit"name="submit1" value="Выйти"></form>';
					document.getElementById('exit').onclick = function(){
						let com = new Communicator();
						return false;
					};
				}

				//alert(xhr.response['alert']);
			}
		}
	};*/
    return false;
};

