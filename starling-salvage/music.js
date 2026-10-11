// Starling Salvage — original Atari 2600-inspired chip music.
// Two synthesized voices, no samples or streaming, no autoplay before interaction.
// The learning engine, saved settings, game events and Breakout controls are untouched.
const Music=(()=>{
  let ctx=null,master=null,timer=null,next=0,step=0,mode='cruise',enabled=false;
  const themes={
    // Each entry is one eighth-note step. null is a deliberate rest.
    // The gentler base theme leaves room to think about the words.
    cruise:{
      bpm:92,leadShape:'square',bassShape:'triangle',leadVol:.010,bassVol:.020,
      lead:[69,null,72,76,74,null,72,null,67,null,69,72,64,null,67,null,
            69,null,72,79,76,74,72,null,67,69,72,null,64,67,69,null],
      bass:[45,null,45,null,48,null,48,null,41,null,41,null,43,null,40,null,
            45,null,45,null,48,null,48,null,41,null,43,null,40,null,45,null]
    },
    // An exploratory, gently propulsive sci-fi melody for vocabulary encounters.
    explore:{
      bpm:108,leadShape:'square',bassShape:'triangle',leadVol:.011,bassVol:.021,
      lead:[69,72,76,null,74,72,69,null,72,76,79,76,74,null,72,null,
            69,72,74,76,79,76,74,null,72,69,67,69,72,null,69,null],
      bass:[45,null,52,null,48,null,43,null,41,null,48,null,43,null,40,null,
            45,null,52,null,48,null,43,null,41,null,43,null,40,null,45,null]
    },
    // Faster two-voice bonus-game theme; only plays in Star Breaker.
    arcade:{
      bpm:140,leadShape:'square',bassShape:'square',leadVol:.010,bassVol:.014,
      lead:[76,79,83,79,76,null,74,72,74,76,79,83,81,79,76,null,
            79,83,81,79,76,74,72,74,76,79,76,74,72,69,72,null],
      bass:[40,null,47,null,43,null,47,null,38,null,45,null,43,null,47,null,
            40,null,47,null,43,null,47,null,38,null,45,null,43,null,40,null]
    }
  };
  function voice(midi,when,duration,wave,volume){
    if(!ctx||!master||midi==null)return;
    const o=ctx.createOscillator(),v=ctx.createGain();
    const attack=.005,release=.018;
    o.type=wave;
    o.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),when);
    v.gain.setValueAtTime(.0001,when);
    v.gain.linearRampToValueAtTime(volume,when+attack);
    v.gain.setValueAtTime(volume*.86,when+Math.max(attack+.002,duration-release));
    v.gain.exponentialRampToValueAtTime(.0001,when+duration);
    o.connect(v);v.connect(master);
    o.start(when);o.stop(when+duration+.025);
  }
  function schedule(){
    if(!ctx||!enabled||ctx.state!=='running')return;
    const theme=themes[mode];
    // Look ahead only a little: changing screens switches music quickly.
    while(next<ctx.currentTime+.125){
      const i=step%theme.lead.length,beat=60/theme.bpm/2;
      const lead=theme.lead[i],bass=theme.bass[i];
      if(lead!=null)voice(lead,next,beat*.77,theme.leadShape,theme.leadVol);
      if(bass!=null)voice(bass,next,beat*.86,theme.bassShape,theme.bassVol);
      next+=beat;step++;
    }
  }
  function unlock(){
    enabled=true;
    try{
      if(!ctx){
        const Audio=window.AudioContext||window.webkitAudioContext;
        if(!Audio)return;
        ctx=new Audio();
        master=ctx.createGain();
        // Keep background music deliberately soft; no sudden loud effects.
        master.gain.value=.58;
        master.connect(ctx.destination);
      }
      // Browsers require a user gesture, provided by Launch / Music on.
      const result=ctx.resume();
      if(result?.catch)result.catch(()=>{});
      next=ctx.currentTime+.065;
      if(!timer)timer=setInterval(schedule,55);
    }catch(e){}
  }
  function stop(){
    enabled=false;
    if(timer){clearInterval(timer);timer=null}
    if(ctx&&ctx.state==='running')ctx.suspend().catch(()=>{});
  }
  function setMode(value){
    if(!themes[value]||mode===value)return;
    mode=value;step=0;
    if(ctx)next=ctx.currentTime+.06;
  }
  document.addEventListener('visibilitychange',()=>{
    if(!ctx)return;
    if(document.hidden){ctx.suspend().catch(()=>{});return}
    if(enabled){
      ctx.resume().then(()=>{next=ctx.currentTime+.06}).catch(()=>{});
    }
  });
  return {unlock,stop,setMode};
})();
