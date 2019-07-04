let config = {
	'registerBoxSelector' : '#registerPanel',
	'authFormId' : 'authform',
	'exitFormId' : 'exitform',
	'exitButtonSelector' : '#exit',
	'saveButtonSelector' : '#saveField',
	'loadButtonSelector' : '#loadField',
};

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
				console.log(xhr);
			
				if(xhr.response['status']=='ERR')
					alert(xhr.response['alert']);
				else {
					if (!xhr.response['alert']) {
						document.querySelector('input[name="isreg"]').click();
						document.querySelector('input[name="pass2"]').value = '';
					}
					else {
						document.forms[config['authFormId']].style.display = 'none';
						document.forms[config['exitFormId']].style.display = 'block';
					}
				}
			}
		};
	}
	
	DetectAuth(loginForm, exitForm) {
		let xhr = this.xhr;
		xhr.open('GET', './db.php?check');
		xhr.responseType = 'json';
		xhr.send();
		console.log(xhr);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				console.log(xhr);
			
				if (xhr.response['status']=='ERR')
					document.forms[loginForm].style.display = 'block';
				else
					document.forms[exitForm].style.display = 'block';
			}
		};
	}

	Logout() {
		let xhr = this.xhr;
		xhr.open('GET', './db.php?exit');
		xhr.responseType = 'json';
		xhr.send();
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				console.log(xhr);
			
				if (xhr.response['status']=='ERR')
					alert(xhr.response['alert']);
				else
					window.location.href = './';
			}
		};
		
	}

	Save(jsonStr, button) {
		let xhr = this.xhr;
		xhr.open('POST', './db.php?save');
		xhr.responseType = 'json';
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send('content=' + encodeURIComponent(jsonStr));
		console.log(xhr);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				button.classList.remove("purple");
				if(xhr.response['status']=='ERR')
					button.classList.add("red");
				else
					button.classList.add("green");
				setTimeout(function() {
					button.classList.remove("red");
					button.classList.remove("green");
					button.classList.add("purple");
				}, 3000);
			}
		};
	}
	
	Load(canvasMain, canvasNext, button) {
		let xhr = this.xhr;
		xhr.open('GET', './db.php?load');
		xhr.responseType = 'json';
		xhr.send();
		console.log(xhr);
		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				button.classList.remove("purple");
				if(xhr.response['status']=='ERR')
					button.classList.add("red");
				else
					button.classList.add("green");
					
				setTimeout(function() {
					button.classList.remove("red");
					button.classList.remove("green");
					button.classList.add("purple");
				}, 3000);
			
				if(xhr.response['status']!='ERR') {
					fl.destruct();
					fl = null;
					fl = Field.loadField(xhr.response['alert'], canvasMain, canvasNext);
					fl.startGame();
				}
			}
		};
	}
}

document.forms[config['authFormId']].isreg.onchange = function() {
	let registerBox = document.querySelector(config['registerBoxSelector']);
	if (registerBox.style.display == 'block') {
		registerBox.style.display = 'none';
		document.forms[config['authFormId']].querySelector('button').innerHTML = 'Войти';
	}
	else {
		registerBox.style.display = 'block';
		document.forms[config['authFormId']].querySelector('button').innerHTML = 'Зарегистрироваться';
	}
};

document.forms[config['authFormId']].onsubmit = function(event) {
	event.preventDefault();
	
	let com = new Communicator();
	com.AuthRegister(this);
	return false;
};

document.querySelector(config['exitButtonSelector']).onclick = function(){
	event.preventDefault();

	let com = new Communicator();
	com.Logout();
	return false;
};

document.querySelector(config['saveButtonSelector']).onclick = function(){
	event.preventDefault();

	let com = new Communicator();
	let fieldDataStr = fl.saveField();
	com.Save(fieldDataStr, this);
	return false;
};

document.querySelector(config['loadButtonSelector']).onclick = function(){
	event.preventDefault();
	
	let com = new Communicator();
	let canvasMain = document.getElementById('canvas');
	let canvasNext = document.getElementById('next');
	com.Load(canvasMain, canvasNext, this);
	return false;
};

window.onload = function() {
	let com = new Communicator();
	com.DetectAuth(config['authFormId'], config['exitFormId']);
	return false;
};
