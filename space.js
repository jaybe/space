window.captureEvents(Event.KEYPRESS);
window.onkeydown = keyp;
window.onkeyup = keyup;

var invaders = [];
var startCountX = 10;
var startCountY = 5;
var bg;
var player;
var moveDir = 10;
var playerMove = 0;
var shootpress = 0;
var shotpause = 0;
var shots = [];
var bonus = [];
//Player attributes
var lives = 3;
var multi = 1;
var points = 0;
var shotcount = 1;
var shotlevel = 1;
var shotspeed = 250;
var movespeed = 50;
//end
var score;
var gameOver = 0;
var extra;
var pause = 0;
var currentlevel = 0;
var body;

var level = [];
level[0] = {};
level[0].ispeed = 100;
level[0].startCountX = 8;
level[0].startCountY = 4;
level[0].shotspeed = 3000;
level[0].point = 100;
level[0].bonus =50;

level[1] = {};
level[1].ispeed = 95;
level[1].startCountX = 8;
level[1].startCountY = 5;
level[1].shotspeed = 2500;
level[1].point = 150;
level[1].bonus = 40;

level[2] = {};
level[2].ispeed = 90;
level[2].startCountX = 9;
level[2].startCountY = 5;
level[2].shotspeed = 2000;
level[2].point = 200;
level[2].bonus = 30;

level[3] = {};
level[3].ispeed = 80;
level[3].startCountX = 10;
level[3].startCountY = 5;
level[3].shotspeed = 1800;
level[3].point = 250;
level[3].bonus = 20;

level[4] = {};
level[4].ispeed = 70;
level[4].startCountX = 11;
level[4].startCountY = 6;
level[4].shotspeed = 1000;
level[4].point = 300;
level[4].bonus = 20;

function keyp (Ereignis) {
	//console.log(Ereignis.which);
	if ( Ereignis.which == 68 ||  Ereignis.which == 39) {
		playerMove = 10;
	} else if ( Ereignis.which == 65 || Ereignis.which == 37 ) {
		playerMove = -10;
	}
	if( Ereignis.which == 32) {
		shootpress = 1;
		shootRelease();
	}
}

function keyup (Ereignis) {
	//console.log(Ereignis.which);
	if ( Ereignis.which == 68  ||  Ereignis.which == 39 ) {
		playerMove = 0;
	} else if ( Ereignis.which == 65 || Ereignis.which == 37  ) {
		playerMove = 0;
	}
	if( Ereignis.which == 32) {
		shootpress = 0;
	}
}
function invaredsShootRelease() {
	if( gameOver ) {
		return;
	}
	if( pause ) {
		invaredsShootRelease.delay(1000);
		return;
	}
		var invaders2 = bg.getChildren();
		var idx = parseInt( Math.random() * invaders2.length );
		var ishot = new Element('div', {
		'class': 'ishot',
		id : "ishot",
		styles: {
			position: 'absolute',
			display: 'block',
			background: 'orange',
			top: parseInt(invaders2[idx].style.top)+ parseInt(bg.style.top) + 30 + 'px',
			left: parseInt(invaders2[idx].style.left) + parseInt(bg.style.left) + 13 +"px",
			width: '4px',
			height: '10px',
			//border: '1px solid black'
		}});
		body.appendChild(ishot);
		var l = currentlevel;
		if( currentlevel >= level.length )  {
			l = level.length -1;
		}
		var next = parseInt( Math.random() * level[l].shotspeed);
		invaredsShootRelease.delay(next);
}
function invaredsShoot() {
	
	
}

function shootRelease() {
	var sl = shots.length;
	if( sl < shotcount && ! shotpause ) {
		shotpause = 1;
		shots[sl] = [];
		for( var i = 0 ; i < shotlevel ; i++ ) {
			var shot = new Element('div', {
				'class': 'shot',
				styles: {
					position: 'absolute',
					display: 'block',
					background: 'black',
					top: "250px",
					left: "30px",
					width:  '4px',
					height: '10px',
					//border: '1px solid black'
			}});
			if( shotlevel != 2 && i == 0 ) {
				shot.style.left = parseInt(player.style.left) + 13;
				shot.style.top = parseInt(player.style.top);
			} else if( (shotlevel == 2 && i == 0 ) || (shotlevel == 3 && i == 1 )) {
				shot.style.left = parseInt(player.style.left);
				shot.style.top = parseInt(player.style.top) + 5;
			}  else if( (shotlevel == 2 && i == 1) || (shotlevel == 3 && i == 2 ) ) {
				shot.style.left = parseInt(player.style.left) + 26;
				shot.style.top = parseInt(player.style.top) + 5;
			}
			shots[sl][i] = shot;
			body.appendChild(shot);
		}
		freeShot.delay(shotspeed);
	}
}

function freeShot() {
	shotpause = 0;
}

function shoot()  {
	if( gameOver ) {
		return;
	}
	if( pause ) {
		pause = 0;
		player.style.background = "url(ship.png)";
	}
	//console.log(shot.style.top);
	var child = body.getChildren();
	for( var i = 0 ; i < child.length; i ++ ) {
		//console.log(child[i].class);
		if( child[i].id == "ishot" ) {
			child[i].style.top = parseInt(child[i].style.top) + 10;
			if( detectColision2(child[i]) ) {
				
			}
		}
		if( child[i].id == "bonus" ) {
			child[i].style.top = parseInt(child[i].style.top) + 2;
			detectBonusPickup(child[i]);
		}
	}
	for( var i = 0 ; i < shots.length ; i++ ) {
		for( var x = 0 ; x < shotlevel; x++ ) { 
			if( shots[i] ) {
				var shot = shots[i][x];
				if( shot ) {
					shot.style.top = parseInt(shot.style.top) - 10;
					if( detectColision(shot) ) {			
						body.removeChild(shot);
						shots[i] = removeById(shots[i], x);
						if( shots[i].length == 0 ) {
							shots = removeById(shots, i);
							continue;
						}
					}
				}
			}
		}
	}
	if( shootpress && shots.length < shotcount ) {
		shootRelease();
	}

	if( pause ) {
		shoot.delay(999);
	} else {
		shoot.delay(20);
	} 
}

function removeById( array , id ) {
    var result = [];
	for( var i = 0; i < array.length ; i++ ) {
		if( i != id ) {
			result.push( array[i] );
		}
	}
	return result;
}

function updateInfo() {

var scorediv = document.getElementById("score");
if( score ) {
	scorediv.removeChild(score);
}
var info =  "Leben: " + lives + " Level: " + currentlevel + " Punkte: " + points + " Multiplikator: " + multi + "x"
if( lives < 0 ) {
	
	gameOver = 1;
}
if( gameOver ) {
	info = "Game Over! Score: " + points;
}
if(bg.getChildren().length == 0) {
//	if( currentlevel + 1 < level.length ) {
	if( currentlevel + 1 < 10 ) {
		currentlevel++;
		nextLevel();
		multi = multi + 5;
		lives++;
		points = points + 1000;
		info =  "Leben: " + lives + " NEW Level: " + currentlevel + " Punkte: " + points + " Multiplikator: " + multi + "x"

	} else {
		info = "You Win! Score: " + points;
		gameOver = 1;
	}
}
score = new Element('p', {
'class': 'myClass',
id: 'scoreLabel',
html: info,
});
scorediv.appendChild(score);
}

function detectColision2(s) {
	var top = parseInt(s.style.top);
//	var left =  parseInt(s.style.left);
//	var i_left = parseInt(player.style.left);
	var i_top = parseInt(player.style.top);
	if( top > i_top + 35 ) {
		var child = body.getChildren();
		for( var i = 0 ; i < child.length; i ++ ) {
			if(child[i] === s ) {
				body.removeChild(s);
				return 1;
			}
		}
		return 1;
	}

	if(  checkColision(player,s) ) {
		lives--;
		var child = body.getChildren();
		for( var a = 0 ; a < child.length; a ++ ) {
			if( child[a].id == "ishot" ) {
				body.removeChild(child[a]);
			}
		}
		player.style.background = "url(explode.png)";
		pause = 1;
		multi = 1;
		shotcount = 1;
		shotlevel = 1;
		shotspeed = 250;
		movespeed = 50;
		updateInfo();
		//.removeChild(invaders2[i]);
		return 1;
	}
	return 0;
}
function detectColision(shot) {
	var invaders2 = bg.getChildren();
	var top = parseInt(shot.style.top);
	var left =  parseInt(shot.style.left);
	if( top <= -10 ) {
		multi = 1;
		updateInfo();
		return 1;
	}
	for( var i = 0 ; i < invaders2.length; i ++ ) {
		var i_left = parseInt(invaders2[i].style.left) + parseInt(bg.style.left) ;
		var i_top = parseInt(invaders2[i].style.top) +  parseInt(bg.style.top);
		if( i_left <= left &&  (i_left + 30) >= left && i_top <= top &&  (i_top + 30) >= top ) {
			points = points + 100 * multi;
			multi++;
			var bang = new Element('div', {
			'class': 'boom',
			styles: {
				position: 'absolute',
				display: 'block',
				background: "url( explode.png)",
				top: i_top + "px",
				left: i_left + "px",
				width:  '30px',
				height: '30px',
				//border: '1px solid black'
			}});
			releaseBonus(i, i_top, i_left + 7 );
			body.appendChild(bang);
			weg = function() {
				body.removeChild(bang);
			};
			weg.delay(200);
			
			bg.removeChild(invaders2[i]);
			updateInfo();
			return 1;
		}
	}
	
	return 0;
}

function detectBonusPickup(s) {
	var invaders2 = bg.getChildren();
	var top = parseInt(s.style.top);
	var i_top = parseInt(player.style.top);
	if( top > i_top + 35 ) {
		body.removeChild(s);
		return 1;
	}

	if( checkColision(player,s)  ) {
		if( s.style.name == "live" ) {
			lives++;
		}
		if( s.style.name == "up" ) {
			shotcount++;
			if( ( shotcount > shotlevel * 2 ) && shotlevel < 3 ) {
				shotlevel++;
			}
			shotspeed = shotspeed-20;
			
			var movespeed = 50
		}
		if( s.style.name == "plus" ) {
			multi = multi + 10;
			movespeed = movespeed - 5;
		}
		updateInfo();
		body.removeChild(s);
		return 1;
	}
	return 0;
}

function releaseBonus(idx, top, left) {
	var b = bonus[idx];
	if( b == 1 || b == 30 ) {
		var u = new Element('div', {
			'id': 'bonus',
			styles: {
				position: 'absolute',
				display: 'block',
				name: 'up',
				background: "url( up.png)",
				top: top + "px",
				left: left + "px",
				width:  '15px',
				height: '15px',
				//border: '1px solid black'
		}});
		body.appendChild(u);
	} else if( b == 2 ) {
		var u = new Element('div', {
			'id': 'bonus',
			styles: {
				position: 'absolute',
				display: 'block',
				name: 'plus',				
				background: "url( plus.png)",
				top: top + "px",
				left: left + "px",
				width:  '15px',
				height: '15px',
				//border: '1px solid black'
		}});
		body.appendChild(u);
	} else if( b == 3 ) {
		var u = new Element('div', {
			'id': 'bonus',
			styles: {
				position: 'absolute',
				display: 'block',
				name: 'live',				
				background: "url( herz.png)",
				top: top + "px",
				left: left + "px",
				width:  '15px',
				height: '15px',
				//border: '1px solid black'
		}});
		body.appendChild(u);
	}
}

function load() {
body = document.getElementById("body");
bg = new Element('div', {
'class': 'myClass',
id: 'fieldBG',
styles: {
	position: 'absolute',
	display: 'block',
	top: "30px",
	left: "12px",
	width: (5+30) * startCountX + 'px',
	height: (5+30) * startCountY + 'px',
	//border: '1px solid black'
}});

player = new Element('div', {
	'class': 'myClass',
	id: 'player',
	styles: {
		position: 'absolute',
		display: 'block',
		background: "url( ship.png)",
		top: "375px",
		left: "30px",
		width:  '30px',
		height: '30px',
		//border: '1px solid black'
	}});

body.appendChild(player);	
body.appendChild(bg);
nextLevel();
updateInfo();
moveAll();
movePlayer();
invaredsShootRelease();
shoot();

}

function nextLevel () {
bg.style.top = 20;
bg.style.left = 10;
var count = 0;
var l = currentlevel;
if( currentlevel >= level.length )  {
	l = level.length -1;
}
for( var x = 0; x < level[l].startCountX; x++) {
	for( var y = 0; y < level[l].startCountY; y++) {
	bonus[count] = parseInt( Math.random() * level[l].bonus );
	count++;
	var invader = new Element('div', {
	'class': 'invader',
	id: 'invader' + x + "-" + y,
	styles: {
		position: 'absolute',
		display: 'block',
		background: "black url(invader.png)",
		top: y * (30+5) + "px",
		left: x * (30+5) + "px",
		width:  '30px',
		height: '30px',
		//border: '1px solid black'
	}});


	bg.appendChild(invader);
	}
}
}

function movePlayer () {
  if( gameOver ) {
	return;
  }
  if( pause ) {
	movePlayer.delay(1000);
	return;
  }
  var current_left = parseInt(player.style.left)
  if( playerMove > 0 && current_left + parseInt(player.style.width) <= parseInt(document.getElementById('playground').style.width) ) {
	player.style.left = current_left + playerMove + 'px';
  }
  if( playerMove < 0 && current_left > 12 ) {
	player.style.left = current_left + playerMove + 'px';
  }
  //console.log(parseInt(bg.style.left) + " " + moveDir);
  movePlayer.delay(movespeed);
}

 function checkColision(a,b,c) {
	var al =  parseInt(a.style.left);
	var at =  parseInt(a.style.top);
	var ah =  parseInt(a.style.height);
	var aw =  parseInt(a.style.width);
	var bl =  parseInt(b.style.left);
	var bt =  parseInt(b.style.top);
	if( c ) {
		bl +=  parseInt(c.style.left);
		bt +=  parseInt(c.style.top);
	}
	var bh =  parseInt(b.style.height);
	var bw =  parseInt(b.style.width);
	if( 
		(
			( al < bl && al + aw > bl ) |
			( al < bl + bw && al + aw > bl +bw )
		) && (
			( at < bt && at + ah > bt ) |
			( at < bt + bh && at + ah > bt +bh )		
		) ) {
			return 1;
	}
	return 0;
 }
  
function moveAll () {
  if( gameOver ) {
	return;
  }
  if( pause ) {
	moveAll.delay(1000);
	return;
  }
  var invaders2 = bg.getChildren();
  var min = 30 * startCountX;
  var max = 0;
//  var pl =  parseInt(player.style.left);
//  var pt =  parseInt(player.style.top);
//  var bl =  parseInt(bg.style.left);
//  var bt =  parseInt(bg.style.top);
  for( var i = 0 ; i < invaders2.length; i ++ ) {
	var il = parseInt(invaders2[i].style.left);
	var it = parseInt(invaders2[i].style.top);
	if( min > il ) {
		min = il;
	}
	if( max < il ) {
		max = il;
		bg.style.width = max +35;
	}

	if( checkColision(player,invaders2[i],bg) ) {
		player.style.background = "url(explode.png)";
		gameOver = 1;
		updateInfo();
	}
 }

  var current_left = parseInt(bg.style.left);
  if( moveDir > 0 && current_left + max + 32  <=  parseInt(document.getElementById('playground').style.width)) {
	bg.style.left = current_left + moveDir + 'px';
  } else if( moveDir > 0   ) {
	moveDir = moveDir * -1;
	bg.style.top = parseInt(bg.style.top) + 10;	
//	bg.style.top = parseInt(bg.style.top) + 5;
  }
  if( moveDir < 0 && current_left + min >= 15 ) {
	bg.style.left = current_left + moveDir + 'px';
  } else if( moveDir < 0   ) {
	moveDir = moveDir * -1;
	bg.style.top = parseInt(bg.style.top) + 10;
	//moveAll();
  }

  //console.log(parseInt(bg.style.left) + " " + moveDir);
	var l = currentlevel;
	if( currentlevel >= level.length )  {
		l = level.length -1;
	}
  moveAll.delay(level[l].ispeed);
}
