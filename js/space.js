
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
		var ishot = new Element('div', {'class': 'ishot', id: "ishot"});
		ishot.setPosition({ y: parseInt(invaders2[idx].getCoordinates().top)+ 30 ,
							x: parseInt(invaders2[idx].getCoordinates().left) + 13});
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
			var shot = new Element('div', {'class': 'shot'});
			if( shotlevel != 2 && i == 0 ) {
				shot.setPosition({y: parseInt(player.getCoordinates().top) , x: parseInt(player.getCoordinates().left) + 13 });
			} else if( (shotlevel == 2 && i == 0 ) || (shotlevel == 3 && i == 1 )) {
				shot.setPosition({y: parseInt(player.getCoordinates().top) +5 , x: parseInt(player.getCoordinates().left) });
			}  else if( (shotlevel == 2 && i == 1) || (shotlevel == 3 && i == 2 ) ) {
				shot.setPosition({y: parseInt(player.getCoordinates().top) +5 , x: parseInt(player.getCoordinates().left) + 26 });
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
		player.removeClass("explode");
		player.addClass("ship");
	}
	//console.log(shot.getCoordinates().top);
	var child = body.getChildren();
	for( var i = 0 ; i < child.length; i ++ ) {
		//console.log(child[i].class);
		if( child[i].hasClass( "ishot" )) {
			
			child[i].setPosition({y: parseInt(child[i].getCoordinates().top) + 10});
			if( detectColision2(child[i]) ) {
				
			}
		}
		if( child[i].hasClass( "bonus" )) {
			child[i].setPosition({y: parseInt(child[i].getCoordinates().top) + 2});
			//child[i].getCoordinates().top = parseInt(child[i].getCoordinates().top) + 2;
			detectBonusPickup(child[i]);
		}
	}
	for( var i = 0 ; i < shots.length ; i++ ) {
		for( var x = 0 ; x < shotlevel; x++ ) { 
			if( shots[i] ) {
				var shot = shots[i][x];
				if( shot ) {
					shot.setPosition({y: parseInt(shot.getCoordinates().top) - 10});
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
score = new Element('p', {id: 'scoreLabel',html: info,});
scorediv.appendChild(score);
}

function detectColision2(s) {
	var top = parseInt(s.getCoordinates().top);
//	var left =  parseInt(s.getCoordinates().left);
//	var i_left = parseInt(player.getCoordinates().left);
	var i_top = parseInt(player.getCoordinates().top);
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
			if( child[a].hasClass( "ishot" ) ) {
				body.removeChild(child[a]);
			}
		}
		player.addClass("explode");
		player.removeClass("ship");
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
	var top = parseInt(shot.getCoordinates().top);
	var left =  parseInt(shot.getCoordinates().left);
	if( top <= -10 ) {
		multi = 1;
		updateInfo();
		return 1;
	}
	for( var i = 0 ; i < invaders2.length; i ++ ) {
		var i_left = parseInt(invaders2[i].getCoordinates().left);
		var i_top = parseInt(invaders2[i].getCoordinates().top);
		if( i_left <= left &&  (i_left + 30) >= left && i_top <= top &&  (i_top + 30) >= top ) {
			points = points + 100 * multi;
			multi++;
			var bang = new Element('div', {'class': 'explode'});
			bang.setPosition({y: i_top , x: i_left });
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
	var top = parseInt(s.getCoordinates().top);
	var i_top = parseInt(player.getCoordinates().top);
	if( top > i_top + 35 ) {
		body.removeChild(s);
		return 1;
	}

	if( checkColision(player,s)  ) {
		if( s.hasClass( "live" ) ) {
			lives++;
		}
		if( s.hasClass( "up" ) ) {
			shotcount++;
			if( ( shotcount > shotlevel * 2 ) && shotlevel < 3 ) {
				shotlevel++;
			}
			shotspeed = shotspeed-20;
			
			var movespeed = 50
		}
		if( s.hasClass( "plus" )) {
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
		var u = new Element('div', {'id': 'bonus','class':"bonus"});
		u.setPosition({y: top, x:left});
	if( b == 1 || b == 30 ) {
		u.addClass("up");
	} else if( b == 2 ) {
		u.addClass("live");
	} else if( b == 3 ) {
		u.addClass("plus");
	}
	body.appendChild(u);
}

function load() {
body = $("body");
bg = new Element('div', { 'class': 'fielBG',id: 'fieldBG',});
//bg.setPosition({width:(5+30) * startCountX ,height:(5+30) * startCountY });

player = new Element('div', {'class': 'ship',id: 'player'});

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
bg.setPosition({x: 20,y:10});
var count = 0;
var l = currentlevel;
if( currentlevel >= level.length )  {
	l = level.length -1;
}
for( var x = 0; x < level[l].startCountX; x++) {
	for( var y = 0; y < level[l].startCountY; y++) {
	bonus[count] = parseInt( Math.random() * level[l].bonus );
	count++;
	var invader = new Element('div', {'class': 'invader'});
	invader.setPosition({"x":  x * (30+5),"y": y * (30+5) });

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
  var current_left = parseInt(player.getCoordinates().left)
  if( playerMove > 0 && current_left + parseInt(player.getCoordinates().width) <= parseInt($('playground').getCoordinates().width) ) {
	player.setPosition({x: current_left + playerMove });
  }
  if( playerMove < 0 && current_left > 12 ) {
	player.setPosition({x: current_left + playerMove });
  }
  //console.log(parseInt(bg.getCoordinates().left) + " " + moveDir);
  movePlayer.delay(movespeed);
}

 function checkColision(a,b,c) {
	var al =  parseInt(a.getCoordinates().left);
	var at =  parseInt(a.getCoordinates().top);
	var ah =  parseInt(a.getCoordinates().height);
	var aw =  parseInt(a.getCoordinates().width);
	var bl =  parseInt(b.getCoordinates().left);
	var bt =  parseInt(b.getCoordinates().top);
	if( c ) {
		bl +=  parseInt(c.getCoordinates().left);
		bt +=  parseInt(c.getCoordinates().top);
	}
	var bh =  parseInt(b.getCoordinates().height);
	var bw =  parseInt(b.getCoordinates().width);
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
//  var pl =  parseInt(player.getCoordinates().left);
//  var pt =  parseInt(player.getCoordinates().top);
//  var bl =  parseInt(bg.getCoordinates().left);
//  var bt =  parseInt(bg.getCoordinates().top);
  for( var i = 0 ; i < invaders2.length; i ++ ) {
	var il = parseInt(invaders2[i].getCoordinates().left);
	var it = parseInt(invaders2[i].getCoordinates().top);
	if( min > il ) {
		min = il;
	}
	if( max < il ) {
		max = il;
	//	bg.getCoordinates().width = max +35;
	}

	if( checkColision(player,invaders2[i],bg) ) {
		player.addClass("explode");
		player.removeClass("ship");
		gameOver = 1;
		updateInfo();
	}
 }

  var current_left = parseInt(bg.getCoordinates().left);
  if( moveDir > 0 && max + 32  <=  parseInt($('playground').getCoordinates().width)) {
	bg.setPosition({x: current_left + moveDir});
  } else if( moveDir > 0   ) {
	moveDir = moveDir * -1;
	bg.setPosition({y: parseInt(bg.getCoordinates().top) + 10});
	//bg.getCoordinates().top = parseInt(bg.getCoordinates().top) + 10;	
//	bg.getCoordinates().top = parseInt(bg.getCoordinates().top) + 5;
  }
  if( moveDir < 0 && min + moveDir >= 2 ) {
	bg.setPosition({x: current_left + moveDir});
  } else if( moveDir < 0   ) {
	moveDir = moveDir * -1;
	bg.setPosition({y: parseInt(bg.getCoordinates().top) + 10});
	//bg.getCoordinates().top = parseInt(bg.getCoordinates().top) + 10;
	//moveAll();
  }

  //console.log(parseInt(bg.getCoordinates().left) + " " + moveDir);
	var l = currentlevel;
	if( currentlevel >= level.length )  {
		l = level.length -1;
	}
  moveAll.delay(level[l].ispeed);
}
