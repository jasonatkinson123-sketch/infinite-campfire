const StarBreaker=(()=>{
 const W=720,H=480,colors=['#ff7c92','#ffb56e','#ffe0a0','#9fe7da'];
 function create(canvas,onUpdate,onEnd,soundEnabled=()=>true){const g=canvas.getContext('2d');let raf=0,last=0,state='ready',score=0,lives=3,bricks=[],paddle={x:W/2-48,y:H-45,w:96,h:12},ball={x:W/2,y:H-58,vx:130,vy:-260,r:6},particles=[],wideUntil=0,keys={};
 function resetBricks(){bricks=[];for(let row=0;row<4;row++)for(let col=0;col<9;col++)bricks.push({x:43+col*72,y:76+row*29,w:65,h:20,color:colors[row],live:true})}
 function resetBall(){ball={x:paddle.x+paddle.w/2,y:paddle.y-8,vx:(Math.random()>.5?1:-1)*125,vy:-270,r:6};state='ready';onUpdate({score,lives,state,remaining:bricks.filter(b=>b.live).length})}
 function draw(){g.fillStyle='#101521';g.fillRect(0,0,W,H);g.strokeStyle='#1f3652';g.lineWidth=1;for(let x=0;x<W;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<H;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.fillStyle='#243754';for(let i=0;i<37;i++){const x=(i*179+31)%W,y=(i*91+13)%H;g.fillRect(x,y,2,2)}
 g.fillStyle='#9be9da';g.font='bold 15px monospace';g.fillText('STAR BREAKER // SECTOR 01',30,34);g.textAlign='right';g.fillText(String(bricks.filter(b=>b.live).length).padStart(2,'0')+' SIGNALS',W-30,34);g.textAlign='left';
 for(const b of bricks)if(b.live){g.fillStyle=b.color;g.fillRect(b.x,b.y,b.w,b.h-3);g.fillStyle='#ffffff4d';g.fillRect(b.x+3,b.y+2,b.w-6,2);g.fillStyle='#00000040';g.fillRect(b.x,b.y+b.h-4,b.w,3)}
 g.fillStyle='#1a3140';g.fillRect(paddle.x-2,paddle.y+9,paddle.w+4,8);g.fillStyle='#8ee8d6';g.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);g.fillStyle='#e5fff3';g.fillRect(paddle.x+8,paddle.y+2,paddle.w-16,3);
 g.fillStyle='#fff3c7';g.shadowBlur=18;g.shadowColor='#ffcf88';g.beginPath();g.arc(ball.x,ball.y,ball.r,0,Math.PI*2);g.fill();g.shadowBlur=0;
 for(const p of particles){g.globalAlpha=Math.max(0,p.life);g.fillStyle=p.color;g.fillRect(p.x,p.y,4,4)}g.globalAlpha=1;
 if(state==='ready'||state==='paused'){g.fillStyle='#0c172add';g.fillRect(180,220,360,64);g.fillStyle='#f8e9d5';g.textAlign='center';g.font='bold 18px monospace';g.fillText(state==='ready'?'TAP TO LAUNCH':'PAUSED',W/2,259);g.textAlign='left'}
 }
 function ping(ok){if(!soundEnabled())return;try{const c=window.audioContext||(window.audioContext=new(window.AudioContext||window.webkitAudioContext)());c.resume();const o=c.createOscillator(),v=c.createGain();o.type=ok?'square':'triangle';o.frequency.setValueAtTime(ok?420:230,c.currentTime);o.frequency.exponentialRampToValueAtTime(ok?710:120,c.currentTime+.07);v.gain.setValueAtTime(.03,c.currentTime);v.gain.exponentialRampToValueAtTime(.001,c.currentTime+.1);o.connect(v);v.connect(c.destination);o.start();o.stop(c.currentTime+.11)}catch(e){}}
 function finish(win){state=win?'won':'lost';cancelAnimationFrame(raf);raf=0;onUpdate({score,lives,state,remaining:bricks.filter(b=>b.live).length});onEnd({score,win})}
 function update(dt){if(keys.ArrowLeft||keys.a)paddle.x-=400*dt;if(keys.ArrowRight||keys.d)paddle.x+=400*dt;paddle.w=performance.now()<wideUntil?138:96;paddle.x=Math.max(12,Math.min(W-paddle.w-12,paddle.x));
 if(state!=='running')return;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<ball.r+12){ball.x=ball.r+12;ball.vx=Math.abs(ball.vx)}if(ball.x>W-ball.r-12){ball.x=W-ball.r-12;ball.vx=-Math.abs(ball.vx)}if(ball.y<ball.r+52){ball.y=ball.r+52;ball.vy=Math.abs(ball.vy)}
 if(ball.vy>0&&ball.y+ball.r>=paddle.y&&ball.y-ball.r<paddle.y+paddle.h&&ball.x>=paddle.x-ball.r&&ball.x<=paddle.x+paddle.w+ball.r){ball.y=paddle.y-ball.r;const angle=((ball.x-(paddle.x+paddle.w/2))/(paddle.w/2))*.9;const speed=Math.min(400,Math.hypot(ball.vx,ball.vy)+5);ball.vx=Math.sin(angle)*speed;ball.vy=-Math.max(170,Math.cos(angle)*speed);ping(false)}
 for(const b of bricks){if(!b.live)continue;if(ball.x+ball.r>b.x&&ball.x-ball.r<b.x+b.w&&ball.y+ball.r>b.y&&ball.y-ball.r<b.y+b.h){b.live=false;ball.vy=-ball.vy;score+=10;for(let j=0;j<7;j++)particles.push({x:ball.x,y:ball.y,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*160,life:1,color:b.color});if(score%100===0)wideUntil=performance.now()+9000;ping(true);onUpdate({score,lives,state,remaining:bricks.filter(x=>x.live).length});if(bricks.every(x=>!x.live)){finish(true)}break}}
 if(ball.y>H+8){lives--;ping(false);if(lives<=0)finish(false);else resetBall()}
 particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*2.2}
 }
 function loop(time){const dt=Math.min((time-last)/1000,.033)||0;last=time;update(dt);draw();if(state!=='won'&&state!=='lost')raf=requestAnimationFrame(loop)}
 function inputX(e){const rect=canvas.getBoundingClientRect();paddle.x=Math.max(12,Math.min(W-paddle.w-12,(e.clientX-rect.left)/rect.width*W-paddle.w/2));}
 function pointerdown(e){inputX(e);if(state==='ready')launch()}
 function launch(){if(state==='ready'||state==='paused'){state='running';onUpdate({score,lives,state,remaining:bricks.filter(b=>b.live).length})}}
 function pause(){if(state==='running')state='paused';else if(state==='paused')launch();onUpdate({score,lives,state,remaining:bricks.filter(b=>b.live).length});draw()}
 function keydown(e){if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key]=true;if(e.repeat&&e.key===' ')return;if(e.key===' '){if(state==='ready')launch();else pause()}}
 function keyup(e){keys[e.key]=false}
 function blur(){if(state==='running')pause()}
 function start(){if(raf)cancelAnimationFrame(raf);state='ready';score=0;lives=3;particles=[];paddle={x:W/2-48,y:H-45,w:96,h:12};resetBricks();resetBall();last=performance.now();raf=requestAnimationFrame(loop)}
 function destroy(){if(raf)cancelAnimationFrame(raf);canvas.removeEventListener('pointermove',inputX);canvas.removeEventListener('pointerdown',pointerdown);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur)}
 canvas.addEventListener('pointermove',inputX);canvas.addEventListener('pointerdown',pointerdown);window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);start();return {start,pause,launch,destroy,get state(){return state}}
 }
 return {create}
})();
