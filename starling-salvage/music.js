// Original, synthesized music. No audio files or autoplay on page load.
const Music=(()=>{
 let ctx=null,timer=null,next=0,step=0,mode='cruise',enabled=false;
 const themes={
  cruise:{bass:[45,null,45,null,48,null,43,null,41,null,41,null,43,null,40,null],lead:[69,null,72,76,74,null,72,null,67,null,69,72,64,null,67,null],bpm:102},
  explore:{bass:[45,null,52,null,48,null,43,null,41,null,48,null,43,null,40,null],lead:[69,null,72,null,76,74,72,null,69,null,67,72,74,null,67,null],bpm:112},
  arcade:{bass:[40,null,47,null,43,null,47,null,38,null,45,null,43,null,47,null],lead:[76,79,83,null,79,76,74,72,74,76,79,null,83,79,76,null],bpm:136}
 };
 function osc(midi,time,duration,shape,volume){if(midi==null||!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=shape;o.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),time);g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(volume,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(ctx.destination);o.start(time);o.stop(time+duration+.02)}
 function drum(time,kind){if(!ctx)return;const length=kind==='kick'?.16:.075,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*length),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const t=i/ctx.sampleRate;data[i]=(Math.random()*2-1)*Math.exp(-t*(kind==='kick'?26:50))*(kind==='kick'?Math.sin(2*Math.PI*(100-50*t)*t):1)}const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=buffer;g.gain.value=kind==='kick'?.035:.012;src.connect(g);g.connect(ctx.destination);src.start(time)}
 function schedule(){if(!ctx||!enabled||ctx.state!=='running')return;while(next<ctx.currentTime+.14){const t=themes[mode],i=step%16,beat=60/t.bpm/2;osc(t.bass[i]-12,next,beat*.95,'triangle',.044);osc(t.lead[i],next,beat*.82,'square',mode==='arcade'?.012:.008);if(i%4===0)drum(next,'kick');if(i%4===2)drum(next,'snare');if(mode==='arcade'&&i%2===1)osc(88,next,.055,'triangle',.003);next+=beat;step++}}
 function unlock(){if(enabled&&ctx?.state==='running')return;enabled=true;try{if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();ctx.resume();next=ctx.currentTime+.04;if(!timer)timer=setInterval(schedule,65)}catch(e){}}
 function stop(){enabled=false;if(timer){clearInterval(timer);timer=null}if(ctx&&ctx.state==='running')ctx.suspend().catch(()=>{})}
 function setMode(value){if(themes[value]){mode=value;step=0;if(ctx)next=ctx.currentTime+.04}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&ctx)ctx.suspend().catch(()=>{});else if(enabled&&ctx){ctx.resume().then(()=>{next=ctx.currentTime+.04})}});
 return {unlock,stop,setMode};
})();
