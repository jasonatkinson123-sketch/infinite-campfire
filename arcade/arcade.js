(function(){
"use strict";
const $=id=>document.getElementById(id);
const names=["pong","breakout","invaders","asteroids","frogger","munch"];
const labels={pong:["PONG","▌●▐","Move with up/down or drag. Score seven points."],breakout:["BREAKOUT","▰●","Move with left/right or drag. Fire launches the ball."],invaders:["SPACE INVADERS","▣▣▣","Move left/right. Press Fire or Space to shoot."],asteroids:["ASTEROIDS","◇✦","Left/right rotate, up thrusts, Fire shoots."],frogger:["FROGGER","♣⇧","Use arrow keys or the directional buttons. Cross the river and road."],munch:["MUNCH MAZE","◉◇","Move with arrow keys or touch. Fill the maze with links. Avoid the chasers. Power cells let you chase them!"]};
const KEY="little-arcade-data-v1";
let db={used:{},best:{},saved:{},session:null,sound:true};
try{let v=JSON.parse(localStorage.getItem(KEY));if(v&&typeof v==="object")db=Object.assign(db,v)}catch(e){}
let origin="words",gameName=null,g=null,held={},last=0,lastSave=0,grace=null,ctxAudio=null;
const canvas=$("canvas"),c=canvas.getContext("2d");
function save(){try{if(gameName&&g)db.saved[gameName]=g;localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
function beep(f=440){if(!db.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!ctxAudio)ctxAudio=new AC();ctxAudio.resume();let o=ctxAudio.createOscillator(),v=ctxAudio.createGain(),t=ctxAudio.currentTime;o.type="square";o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.2,t+.09);v.gain.setValueAtTime(.012,t);v.gain.exponentialRampToValueAtTime(.0001,t+.1);o.connect(v);v.connect(ctxAudio.destination);o.start(t);o.stop(t+.11)}catch(e){}}
function screen(id){["gate","lobby","game","done"].forEach(k=>$(k).classList.toggle("hidden",k!==id))}
function clock(sec){let x=Math.max(0,Math.ceil(sec));return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")}
function homeUrl(done){let state=done?"done":"paused";return origin==="math"?"https://jasonatkinson123-sketch.github.io/lantern-hollow/?arcade="+state:"https://atkinsonjason.com/starling-salvage/?arcade="+state+"#home"}
function links(){$("lobby-return").href=homeUrl(false);$("done-return").href=homeUrl(true)}
function boot(){let p=new URLSearchParams(location.search),ticket=p.get("ticket"),from=p.get("from");
if(from==="math"||from==="words")origin=from;else if(db.session)origin=db.session.from||"words";
if(ticket&&/^[A-Za-z0-9_-]{12,90}$/.test(ticket)&&(from==="words"||from==="math")){
if(!db.used[ticket]){db.used[ticket]=Date.now();let left=db.session?.seconds>0?db.session.seconds:0;db.session={ticket:ticket,from:from,seconds:Math.min(600,left+180)};save()}
else if(db.session?.ticket===ticket&&db.session.seconds>0)origin=db.session.from;
}
if(db.session?.seconds>0){origin=db.session.from||origin;lobby()}else screen("gate");links()}
function lobby(){if(!db.session||db.session.seconds<=0){endPass();return}gameName=null;g=null;grace=null;
$("lobby-time").textContent=clock(db.session.seconds);
$("cabinets").innerHTML=names.map(n=>'<button class="cabinet" data-game="'+n+'"><span class="icon">'+labels[n][1]+'</span><strong>'+labels[n][0]+'</strong><small>BEST '+(db.best[n]||0)+'</small></button>').join("");
document.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>select(b.dataset.game));screen("lobby");links()}
function select(n){if(!names.includes(n)||!db.session||db.session.seconds<=0)return;gameName=n;g=db.saved[n]&&!db.saved[n].over?db.saved[n]:make(n);held={};grace=null;$("title").textContent=labels[n][0];$("instructions").textContent=labels[n][2];$("clock").textContent=clock(db.session.seconds);$("best").textContent="BEST "+(db.best[n]||0);screen("game");canvas.focus({preventScroll:true});beep(620)}
function endPass(){if(g&&gameName)db.saved[gameName]=g;if(db.session)db.session.seconds=0;save();gameName=null;g=null;screen("done");links()}
function ball(){return {x:320,y:230,vx:170,vy:-170}}
function rock(i,r=25){return {x:45+(i*117)%540,y:40+(i*79)%360,vx:(i%2?1:-1)*(32+i*4),vy:(i%3-1)*29,r:r}}
function make(name){let a={name,score:0,lives:3,level:1,over:false,t:0,cd:0,px:320,py:240,dir:1,enemy:240,ball:ball(),shots:[],items:[]};
if(name==="pong"){a.ball={x:320,y:240,vx:190,vy:145};a.points=0;a.theirPoints=0}
if(name==="breakout"){a.py=430;a.ball={x:320,y:417,vx:170,vy:-225,waiting:true};for(let r=0;r<4;r++)for(let i=0;i<10;i++)a.items.push({x:32+i*58,y:75+r*30,live:true})}
if(name==="invaders"){a.py=420;a.enemyShots=[];for(let r=0;r<4;r++)for(let i=0;i<9;i++)a.items.push({x:100+i*48,y:74+r*31,live:true})}
if(name==="asteroids"){a.ship={x:320,y:240,vx:0,vy:0,a:-1.57};for(let i=0;i<6;i++)a.items.push(rock(i))}
if(name==="frogger"){a.frog={x:320,y:431};a.lives=5}
if(name==="munch"){a.munch=newMunch();a.lives=3}
return a}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function hit(a,b,rad){return Math.abs(a.x-b.x)<rad&&Math.abs(a.y-b.y)<rad}

// Munch Maze is an original, chain-laying homage to 1982 TI-99/4A maze games.
// Every corridor is connected. The player fills paths rather than eating dots.
const MUNCH_MAP=[
"#################",
"#...#.......#...#",
"#.#.#.#####.#.#.#",
"#.#.....#.....#.#",
"#.###.#.#.#.###.#",
"#.....#...#.....#",
"###.#...#...#.###",
"#.....#...#.....#",
"#.###.#.#.#.###.#",
"#.#.....#.....#.#",
"#.#.#.#####.#.#.#",
"#...#.......#...#",
"#################"];
const MN={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
const MUNCH_GHOST_STARTS=[[8,1],[8,11],[1,5],[15,7]];
function validMunch(x,y){return y>=0&&y<MUNCH_MAP.length&&x>=0&&x<17&&MUNCH_MAP[y][x]!=="#"}
function newMunch(){return {x:8,y:5,dir:"ArrowLeft",want:"ArrowLeft",moved:0,ghostTick:0,visited:{"8,5":true},
  powers:{"1,1":true,"15,1":true,"1,11":true,"15,11":true},power:0,invuln:2,combo:0,
  ghosts:MUNCH_GHOST_STARTS.map((z,i)=>({x:z[0],y:z[1],dir:i%2?"ArrowRight":"ArrowLeft",color:i}))}}
function moveMunch(){const m=g.munch;
 let tryMove=d=>{let o=MN[d];return o&&validMunch(m.x+o[0],m.y+o[1])};
 if(tryMove(m.want))m.dir=m.want;
 if(tryMove(m.dir)){let a=MN[m.dir];m.x+=a[0];m.y+=a[1];let key=m.x+","+m.y;
 if(!m.visited[key]){m.visited[key]=true;g.score+=10;beep(450)}
 if(m.powers[key]){delete m.powers[key];m.power=8;m.combo=0;g.score+=70;beep(810)}
 if(Object.keys(m.visited).length>=108){g.level++;g.score+=500;g.munch=newMunch();g.munch.invuln=2;beep(925)}
 }}
function munchGhosts(){const m=g.munch;
 for(let i=0;i<m.ghosts.length;i++){let gh=m.ghosts[i];let opts=Object.keys(MN).filter(d=>validMunch(gh.x+MN[d][0],gh.y+MN[d][1]));
 if(!opts.length)continue;
 let opposite={ArrowLeft:"ArrowRight",ArrowRight:"ArrowLeft",ArrowUp:"ArrowDown",ArrowDown:"ArrowUp"}[gh.dir];
 let next=opts.filter(d=>d!==opposite);if(!next.length)next=opts;
 let distance=d=>Math.abs(gh.x+MN[d][0]-m.x)+Math.abs(gh.y+MN[d][1]-m.y);
 if(Math.random()<(.43+Math.min(.24,g.level*.025)))next.sort((a,b)=>m.power>0?distance(b)-distance(a):distance(a)-distance(b));
 let chosen=(Math.random()<.67)?next[0]:next[Math.floor(Math.random()*next.length)];
 gh.x+=MN[chosen][0];gh.y+=MN[chosen][1];gh.dir=chosen;
 }}
function munchCollisions(){const m=g.munch;
 for(let gh of m.ghosts){if(gh.x!==m.x||gh.y!==m.y)continue;
 if(m.power>0){g.score+=100*Math.pow(2,Math.min(3,m.combo++));gh.x=MUNCH_GHOST_STARTS[gh.color][0];gh.y=MUNCH_GHOST_STARTS[gh.color][1];beep(910);continue}
 if(m.invuln<=0){g.lives--;m.x=8;m.y=5;m.invuln=2.5;m.power=0;m.combo=0;m.ghosts=MUNCH_GHOST_STARTS.map((p,i)=>({x:p[0],y:p[1],dir:"ArrowLeft",color:i}));beep(160);if(g.lives<=0)g.over=true;return true}
 }
 return false}

function step(dt){if(!g||g.over)return false;let life=false;g.t+=dt;
if(gameName==="pong"){if(held.ArrowUp||held.w)g.py-=320*dt;if(held.ArrowDown||held.s)g.py+=320*dt;g.py=clamp(g.py,51,429);let b=g.ball;
g.enemy=clamp(b.y,g.enemy-150*dt,g.enemy+150*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;
if(b.y<40||b.y>435)b.vy*=-1;
if(b.x<52&&b.vx<0&&Math.abs(b.y-g.py)<48){b.vx=Math.abs(b.vx)*1.03;b.vy+=(b.y-g.py)*1.7;beep(390)}
if(b.x>589&&b.vx>0&&Math.abs(b.y-g.enemy)<48){b.vx=-Math.abs(b.vx)*1.03;b.vy+=(b.y-g.enemy);beep(460)}
if(b.x<0||b.x>640){if(b.x<0)g.theirPoints++;else{g.points++;g.score+=100}g.ball={x:320,y:240,vx:b.x<0?190:-190,vy:135};life=true;beep(180);if(g.points>=7||g.theirPoints>=7)g.over=true}}
if(gameName==="breakout"){if(held.ArrowLeft||held.a)g.px-=390*dt;if(held.ArrowRight||held.d)g.px+=390*dt;g.px=clamp(g.px,58,582);let b=g.ball;
if(b.waiting){b.x=g.px;b.y=415;if(held.Fire||held[" "]||held.ArrowUp){b.waiting=false;beep(530)}}else{
b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<10||b.x>630)b.vx*=-1;if(b.y<48)b.vy=Math.abs(b.vy);
if(b.vy>0&&b.y>=420&&b.y<=440&&Math.abs(b.x-g.px)<58){b.vx=(b.x-g.px)*4.5;b.vy=-Math.max(175,Math.abs(b.vy));beep(430)}
for(let z of g.items){if(z.live&&b.x>z.x-7&&b.x<z.x+55&&b.y>z.y-7&&b.y<z.y+26){z.live=false;b.vy*=-1;g.score+=10;beep(650);break}}
if(b.y>480){g.lives--;life=true;b.waiting=true;b.vx=170;b.vy=-225;beep(180);if(g.lives<=0)g.over=true}
if(g.items.every(z=>!z.live)){g.score+=200;g.level++;life=true;g.items=[];for(let r=0;r<4;r++)for(let i=0;i<10;i++)g.items.push({x:32+i*58,y:75+r*30,live:true});b.waiting=true}}}
if(gameName==="invaders"){if(held.ArrowLeft||held.a)g.px-=275*dt;if(held.ArrowRight||held.d)g.px+=275*dt;g.px=clamp(g.px,25,615);g.cd-=dt;
if((held.Fire||held[" "]||held.ArrowUp)&&g.cd<=0){g.shots.push({x:g.px,y:407});g.cd=.25;beep(700)}
let edge=false;for(let z of g.items){if(!z.live)continue;z.x+=g.dir*(29+g.level*6)*dt;if(z.x<22||z.x>618)edge=true}
if(edge){g.dir*=-1;for(let z of g.items)z.y+=11}
for(let i=g.shots.length-1;i>=0;i--){let s=g.shots[i];s.y-=370*dt;let dead=false;for(let z of g.items){if(z.live&&Math.abs(z.x-s.x)<19&&Math.abs(z.y-s.y)<13){z.live=false;g.score+=20;dead=true;beep(560);break}}if(dead||s.y<0)g.shots.splice(i,1)}
if(Math.random()<dt*(.65+g.level*.1)){let live=g.items.filter(z=>z.live);if(live.length){let z=live[Math.floor(Math.random()*live.length)];g.enemyShots.push({x:z.x,y:z.y})}}
for(let i=g.enemyShots.length-1;i>=0;i--){let z=g.enemyShots[i];z.y+=210*dt;if(z.y>416){if(Math.abs(z.x-g.px)<25){g.lives--;life=true;beep(180);if(g.lives<=0)g.over=true}g.enemyShots.splice(i,1)}}
if(g.items.some(z=>z.live&&z.y>=394)){g.over=true;life=true}
if(g.items.every(z=>!z.live)){g.score+=200;g.level++;life=true;g.items=[];g.shots=[];g.enemyShots=[];for(let r=0;r<4;r++)for(let i=0;i<9;i++)g.items.push({x:100+i*48,y:74+r*31,live:true})}}
if(gameName==="asteroids"){let s=g.ship;if(held.ArrowLeft||held.a)s.a-=3*dt;if(held.ArrowRight||held.d)s.a+=3*dt;if(held.ArrowUp||held.w){s.vx+=Math.cos(s.a)*170*dt;s.vy+=Math.sin(s.a)*170*dt}s.vx*=.997;s.vy*=.997;s.x=(s.x+s.vx*dt+640)%640;s.y=(s.y+s.vy*dt+480)%480;g.cd-=dt;
if((held.Fire||held[" "])&&g.cd<=0){g.shots.push({x:s.x,y:s.y,vx:s.vx+Math.cos(s.a)*360,vy:s.vy+Math.sin(s.a)*360,ttl:1.3});g.cd=.19;beep(620)}
for(let b of g.shots){b.x=(b.x+b.vx*dt+640)%640;b.y=(b.y+b.vy*dt+480)%480;b.ttl-=dt}g.shots=g.shots.filter(b=>b.ttl>0);
for(let i=g.items.length-1;i>=0;i--){let z=g.items[i];z.x=(z.x+z.vx*dt+640)%640;z.y=(z.y+z.vy*dt+480)%480;
if(g.t>1.8&&Math.abs(z.x-s.x)<z.r+8&&Math.abs(z.y-s.y)<z.r+8){g.lives--;life=true;g.t=0;s.x=320;s.y=240;s.vx=0;s.vy=0;beep(160);if(g.lives<=0)g.over=true}
for(let j=g.shots.length-1;j>=0;j--){let b=g.shots[j];if(Math.abs(z.x-b.x)<z.r&&Math.abs(z.y-b.y)<z.r){g.items.splice(i,1);g.shots.splice(j,1);g.score+=z.r>15?20:50;if(z.r>15){g.items.push({x:z.x,y:z.y,vx:110,vy:75,r:12},{x:z.x,y:z.y,vx:-110,vy:-75,r:12})}beep(730);break}}}
if(!g.items.length){g.score+=200;g.level++;life=true;for(let i=0;i<5+g.level;i++)g.items.push(rock(i+g.level))}}
if(gameName==="frogger"){let f=g.frog;if(held.UpTap){f.y-=42;beep(500)}if(held.DownTap){f.y+=42;beep(500)}if(held.LeftTap){f.x-=42;beep(500)}if(held.RightTap){f.x+=42;beep(500)}held.UpTap=held.DownTap=held.LeftTap=held.RightTap=false;f.x=clamp(f.x,18,622);f.y=clamp(f.y,18,435);
let dead=false;for(let y of [305,347,389])if(Math.abs(f.y-y)<20)for(let i=0;i<3;i++){let x=(i*235+g.t*(y===347?-99:120)+10000)%800-80;if(Math.abs(f.x-x)<31)dead=true}
if(f.y>=102&&f.y<=246){let onLog=false;for(let y of [137,179,221])if(Math.abs(f.y-y)<21)for(let i=0;i<3;i++){let x=(i*290+g.t*(y===179?-72:90)+10000)%900-150;if(Math.abs(f.x-(x+48))<61){onLog=true;f.x+=(y===179?-72:90)*dt}}if(!onLog)dead=true}
if(f.y<55){g.score+=100;g.level++;f.x=320;f.y=431;life=true;beep(800)}
if(dead){g.lives--;f.x=320;f.y=431;life=true;beep(180);if(g.lives<=0)g.over=true}}
if(gameName==="munch"){const m=g.munch;
 m.power=Math.max(0,m.power-dt);m.invuln=Math.max(0,m.invuln-dt);
 for(let d of Object.keys(MN))if(held[d])m.want=d;
 m.moved+=dt;m.ghostTick+=dt;
 let pace=m.power>0?.105:.133;
 if(m.moved>=pace){m.moved-=pace;moveMunch();if(munchCollisions())life=true}
 const gp=Math.max(.15,.27-(g.level-1)*.012);
 if(m.ghostTick>=gp){m.ghostTick-=gp;munchGhosts();if(munchCollisions())life=true}
 }
return life}
function rect(x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function txt(str,x,y,sz,col,align){c.textAlign=align||"left";c.font="bold "+sz+"px monospace";c.fillStyle=col;c.fillText(str,x,y);c.textAlign="left"}
function draw(){rect(0,0,640,480,"#080b1e");if(!g)return;for(let i=0;i<35;i++)rect((i*109+21)%640,(i*73+13)%460,2,2,"#303654");
txt(labels[gameName][0],18,31,20,"#ffd078");txt("SCORE "+g.score+"   LIVES "+g.lives+"   LEVEL "+g.level,18,460,15,"#85e6cf");
if(gameName==="pong"){rect(318,43,4,390,"#34395b");rect(22,g.py-40,14,80,"#85e6cf");rect(604,g.enemy-40,14,80,"#f97492");rect(g.ball.x-7,g.ball.y-7,14,14,"#ffd078");txt(g.points+" : "+g.theirPoints,320,84,31,"#ffd078","center")}
if(gameName==="breakout"){g.items.forEach((z,i)=>{if(z.live)rect(z.x,z.y,50,21,["#f97492","#ffd078","#99b8ec","#85e6cf"][Math.floor(i/10)])});rect(g.px-53,427,106,13,"#85e6cf");rect(g.ball.x-7,g.ball.y-7,14,14,"#fff2cd");if(g.ball.waiting)txt("PRESS FIRE TO LAUNCH",320,315,18,"#ffd078","center")}
if(gameName==="invaders"){g.items.forEach(z=>{if(z.live){rect(z.x-12,z.y-10,24,17,"#85e6cf");rect(z.x-17,z.y+4,9,8,"#f97492");rect(z.x+8,z.y+4,9,8,"#f97492")}});rect(g.px-23,421,46,20,"#ffd078");rect(g.px-8,408,16,15,"#ffd078");g.shots.forEach(z=>rect(z.x-2,z.y,5,12,"#fff2cd"));g.enemyShots.forEach(z=>rect(z.x,z.y,5,13,"#f97492"))}
if(gameName==="asteroids"){g.items.forEach(z=>{c.strokeStyle="#a5b5e5";c.lineWidth=3;c.beginPath();for(let j=0;j<7;j++){let a=j*Math.PI*2/7,r=z.r*(j%2?.78:1),x=z.x+Math.cos(a)*r,y=z.y+Math.sin(a)*r;if(j===0)c.moveTo(x,y);else c.lineTo(x,y)}c.closePath();c.stroke()});let s=g.ship;c.strokeStyle="#ffd078";c.lineWidth=4;c.beginPath();c.moveTo(s.x+Math.cos(s.a)*17,s.y+Math.sin(s.a)*17);c.lineTo(s.x+Math.cos(s.a+2.5)*14,s.y+Math.sin(s.a+2.5)*14);c.lineTo(s.x+Math.cos(s.a-2.5)*14,s.y+Math.sin(s.a-2.5)*14);c.closePath();c.stroke();g.shots.forEach(z=>rect(z.x,z.y,4,4,"#85e6cf"))}
if(gameName==="frogger"){rect(0,55,640,46,"#235c46");rect(0,102,640,147,"#254978");rect(0,264,640,154,"#3a323e");rect(0,418,640,62,"#235c46");for(let y of [137,179,221])for(let i=0;i<3;i++){let x=(i*290+g.t*(y===179?-72:90)+10000)%900-150;rect(x,y-16,108,32,"#b17e4e")}for(let y of [305,347,389])for(let i=0;i<3;i++){let x=(i*235+g.t*(y===347?-99:120)+10000)%800-80;rect(x-22,y-12,48,24,y===347?"#f97492":"#ffd078");rect(x-12,y-16,20,6,"#a5dbe7")}rect(g.frog.x-12,g.frog.y-12,24,24,"#85e6cf");rect(g.frog.x-8,g.frog.y-17,6,6,"#85e6cf");rect(g.frog.x+3,g.frog.y-17,6,6,"#85e6cf")}

if(gameName==="munch"){const m=g.munch,side=27,ox=90,oy=51;
 for(let yy=0;yy<13;yy++)for(let xx=0;xx<17;xx++){let bx=ox+xx*side,by=oy+yy*side,key=xx+","+yy;
 if(!validMunch(xx,yy)){rect(bx+1,by+1,side-2,side-2,g.level%2?"#313b8b":"#2d5b74");rect(bx+5,by+5,side-10,side-10,"#10162b")}
 else if(m.visited[key]){rect(bx+5,by+10,17,7,"#85e6cf");rect(bx+10,by+5,7,17,"#297e88");rect(bx+11,by+11,5,5,"#ffe3a0")}
 if(m.powers[key]){rect(bx+7,by+7,13,13,"#f97492");rect(bx+11,by+3,5,21,"#ffd078");rect(bx+3,by+11,21,5,"#ffd078")}
 }
 for(let gh of m.ghosts){let x=ox+gh.x*side+4,y=oy+gh.y*side+3,color=m.power>0?"#424873":["#f97492","#ffd078","#8dc4ff","#b49bfa"][gh.color];
 rect(x,y,19,18,color);rect(x,y+15,5,5,color);rect(x+8,y+15,5,5,color);rect(x+16,y+15,3,5,color);
 rect(x+3,y+5,5,7,"#f4eddd");rect(x+12,y+5,5,7,"#f4eddd");rect(x+5,y+8,2,3,"#10162b");rect(x+14,y+8,2,3,"#10162b")}
 if(m.invuln<=0||Math.floor(g.t*9)%2===0){let x=ox+(m.x+.5)*side,y=oy+(m.y+.5)*side;
 c.fillStyle="#ffda66";c.beginPath();let angles={ArrowRight:0,ArrowDown:Math.PI/2,ArrowLeft:Math.PI,ArrowUp:-Math.PI/2},angle=angles[m.dir]||0;
 let mouth=(Math.sin(g.t*14)>0)?.27:.08;c.moveTo(x,y);c.arc(x,y,10,angle+mouth,angle+Math.PI*2-mouth);c.closePath();c.fill()}
 txt("CHAIN "+Object.keys(m.visited).length+"/108",95,435,14,"#85e6cf");
 if(m.power>0)txt("POWER "+Math.ceil(m.power)+"s",545,435,14,"#ffd078","right");
 }

if(g.over){rect(124,185,393,99,"#241b3f");txt("GAME OVER",320,237,29,"#ffd078","center");txt("NEW RUN OR PICK ANOTHER GAME",320,265,12,"#fff2cd","center")}}
function tick(t){let dt=last?Math.min((t-last)/1000,.06):0;last=t;
if(g&&gameName&&db.session&&!document.hidden&&!g.over){if(db.session.seconds>0){db.session.seconds=Math.max(0,db.session.seconds-dt);if(db.session.seconds<=0)grace=10}let lostLife=step(dt);if(grace!==null){grace-=dt;if(lostLife||grace<=0)endPass()}}
if(g&&gameName){draw();$("clock").textContent=clock(db.session.seconds);$("status").textContent="SCORE "+g.score+" · LIVES "+g.lives+(grace===null?"":" · FINAL LIFE!")+(g.over?" · SELECT NEW RUN":"");if(g.score>(db.best[gameName]||0)){db.best[gameName]=g.score;$("best").textContent="BEST "+g.score}}
if(t-lastSave>1000){lastSave=t;save()}
requestAnimationFrame(tick)}
function control(id,key,tap){let b=$(id);b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);held[key]=true;if(gameName==="munch"&&g&&MN[key])g.munch.want=key;if(tap)held[tap]=true;beep(300)});for(let ev of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(ev,()=>held[key]=false)}
control("left","ArrowLeft","LeftTap");control("right","ArrowRight","RightTap");control("up","ArrowUp","UpTap");control("down","ArrowDown","DownTap");control("fire","Fire");
window.addEventListener("keydown",e=>{if(gameName&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key))e.preventDefault();if(gameName==="munch"&&g&&MN[e.key])g.munch.want=e.key;if(!held[e.key]){let tap={ArrowUp:"UpTap",ArrowDown:"DownTap",ArrowLeft:"LeftTap",ArrowRight:"RightTap"}[e.key];if(tap)held[tap]=true}held[e.key]=true});
window.addEventListener("keyup",e=>held[e.key]=false);window.addEventListener("blur",()=>{held={};save()});document.addEventListener("visibilitychange",()=>{last=0;if(document.hidden){held={};save()}});
function pointer(e){if(!g)return;let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*480/r.height;if(gameName==="pong")g.py=clamp(y,51,429);if(gameName==="breakout")g.px=clamp(x,58,582);if(gameName==="invaders")g.px=clamp(x,25,615)}
canvas.addEventListener("pointermove",pointer);canvas.addEventListener("pointerdown",e=>{pointer(e);canvas.focus();if(gameName==="breakout"||gameName==="invaders"){held.Fire=true;setTimeout(()=>held.Fire=false,120)}});
$("games").onclick=()=>{save();lobby()};$("new").onclick=()=>{if(gameName){g=make(gameName);beep(550)}};$("sound").onclick=()=>{db.sound=!db.sound;$("sound").textContent=db.sound?"♪ SOUND ON":"♪ SOUND OFF";save();if(db.sound)beep(550)};
window.addEventListener("pagehide",save);boot();requestAnimationFrame(tick);
})();