var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var score = 0;

function keyup(event) {
	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	player.className = 'character stand ' + lastPressed;

}


function move() {
	var player = document.getElementById('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop + 1;

		var element = document.elementFromPoint(player.offsetLeft, newTop + 32);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		var newTop = positionTop - 1;

		// Player cannot move outside of green screen
		var element = document.elementFromPoint(player.offsetLeft, newTop - 3);
		if (element.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';
		}

		if (leftPressed == false) {
			if (rightPressed == false) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft - 1;

		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		var newLeft = positionLeft + 1;

		var element = document.elementFromPoint(newLeft + 32, player.offsetTop);
		if (element.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';
		}

		player.className = 'character walk right';
	}

}


function keydown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
}

// Game Loading
function loadingFunction() {
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}

// Click function to start the game
function startClick() {
	var start = document.getElementsByClassName('start');
	start[0].addEventListener('click', loading);
}
document.addEventListener('DOMContentLoaded', startClick);



//Game Loading Screen
function loading() {
	var startGame = document.getElementsByClassName('start');
	setTimeout(function () { startGame[0].style.display = 'none'; }, 100);
	shipsInterval = setInterval(enemyMovement, 1125);
	setInterval(function () {
		if (score >= 6 && score <= 9) {
			setInterval(bombMovement, 18);   //bomb speed will be increased after the score is more than 6
		}
	}, 2000);
	bombFalls = setInterval(bombMovement, 20);
	loadingFunction();
}


//players can see spaceships and bombs falling from it on the screen.
function enemyMovement() {
	var body = document.getElementsByTagName('body')[0];
	var enemy = document.getElementById('alien');
	enemy.style.top = 10 + 'px';
	var randomNumber = Math.ceil(Math.random() * 60);
	// movement of spaceship from left
	enemy.style.left = (randomNumber * 20) + 'px';
	enemy.style.backgroundSize = 'cover';
	var enemyLeft = parseInt(enemy.style.left);
	var bomb = document.createElement('div');
	bomb.className = 'bomb';
	body.appendChild(bomb);
	// based on the top position of the enemy the bomb value is set.
	bomb.style.top = 100 + 'px';
	// based on the top position of the enemy the bomb value is set.
	bomb.style.left = (enemyLeft + 35) + 'px';
}

//if character is hit by bomb, it loses a health & the bomb explodes.
function Collision() {
	var body = document.getElementsByTagName('body')[0];
	var player = document.getElementById('player');
	var playerLeft = parseInt(player.offsetLeft);
	var playerTop = parseInt(player.offsetTop);
	var bombS = document.getElementsByClassName('bomb');
	for (var i = 0; bombS.length > i; i++) {
		var bomb = bombS[i];
		bombTop = parseInt(bomb.style.top);
		var bombLeft = parseInt(bomb.style.left);
		if (bombTop == playerTop) {
			if (bombLeft >= (playerLeft - 40)
				&&
				bombLeft <= (playerLeft + 40)) {
				playerHealth();
				bomb.className = 'explosion';
				setTimeout(function () {
					var explosion = document.getElementsByClassName('explosion');
					for (var i = 0; i < explosion.length; i++) {
						body.removeChild(explosion[i]);
					}
				}, 100);
			}
			bombExplosion();
		}
	}
}

// Explosion
function bombMovement() {
	var player = document.getElementById('player');
	var bombS = document.getElementsByClassName('bomb');
	for (var i = 0; bombS.length > i; i++) {
		var bomb = bombS[i];
		var bombTop = parseInt(bomb.style.top);
		var bombLeft = parseInt(bomb.style.left);
		var playerOnLeft = parseInt(player.offsetLeft)
		bomb.style.top = bombTop + 1 + 'px';
		if (score >= 5 && score <= 7 && bombLeft > playerOnLeft) {
			bomb.style.left = bombLeft - 1 + 'px';
		}

		if (score >= 12 && score <= 15 && bombLeft < playerOnLeft) {
			bomb.style.left = bombLeft + 1 + 'px';
		}
	}
	Collision();
}

// bomb explodes in different height on green area.
function bombExplosion() {
	var body = document.getElementsByTagName('body')[0];
	var bombS = document.getElementsByClassName('bomb');
	var player = document.getElementById('player');
	var playerTop = parseInt(player.offsetTop);
	for (var i = 0; bombS.length > i; i++) {
		var bomb = bombS[i];
		bombTop = parseInt(bomb.style.top);
		bombLeft = parseInt(bomb.style.left);
		if (bombTop == playerTop) { // bomb explodes a/c to player top position.
			bomb.className = 'explosion';
			setTimeout(function () {
				var explosion = document.getElementsByClassName('explosion');
				for (var i = 0; i < explosion.length; i++) {
					body.removeChild(explosion[i]);
					score += 1;
				}
			}, 500);
		}
	}
}


///////////////////////////////////////////////////////////////////////////////////////// Health
// function that deals with player health after getting hit
function playerHealth() {
	var player = document.getElementById('player');
	var manyLives = document.getElementsByTagName('ul')[0];
	var aLife = document.getElementsByTagName('li');
	if (aLife.length > 1) {
		manyLives.removeChild(aLife[0]);
		player.className = 'character hit left';
	}
	else {
		manyLives.removeChild(aLife[0]);
		player.className = 'character dead head body';
		zeroHealth();
	}
}

// function that deals with player's health after the health is 0
function zeroHealth() {
	var start = document.getElementsByClassName('start')[0];
	start.style.display = 'block';
	start.style.opacity = '1';
	start.firstChild.nodeValue = 'START AGAIN';

	// player cannot move after dying
	document.removeEventListener('keydown', keydown);
	document.removeEventListener('keyup', keyup);
	clearInterval(timeout);

	//spaceships movement will stop
	clearInterval(shipsInterval);

	//bomb movement will stop
	clearInterval(bombFalls);

	// Game Reload
	start.addEventListener('click', function () {
		location.reload();
	});

}

