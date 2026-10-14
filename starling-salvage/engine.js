(function(root){
const TOTAL=20;
const sessionTotal=q=>q.total||12;
const firstPass=q=>sessionTotal(q)===20?16:9;
const stopInterval=q=>sessionTotal(q)===20?5:3;
const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const addDays=(key,n)=>{const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const initial=()=>({version:1,stats:{},days:[],relics:[],credits:0,equipped:0,owned:[0],session:null,sound:false,expandedTrial:null});
function plan(s,words,date=day(),bonus=false){
 const due=words.filter(w=>s.stats[w.id]&&s.stats[w.id].due<=date).sort((a,b)=>s.stats[a.id].due.localeCompare(s.stats[b.id].due));
 const history=Object.values(s.stats),successes=history.filter(x=>x.stage>=2).length;
 const level=successes>=8?3:2;
 const easy=words.filter(w=>w.level===1).sort((a,b)=>(s.stats[a.id]?.seen||0)-(s.stats[b.id]?.seen||0));
 const fresh=words.filter(w=>!s.stats[w.id]&&w.level<=level&&w.level>1);
 const ids=[];const take=(list,n)=>{let count=0;if(n<=0)return;for(const w of list){if(!ids.includes(w.id)){ids.push(w.id);if(++count>=n)break;}}};
 take(easy,4);take(due,6);take(fresh,6);take(easy,16-ids.length);
 if(ids.length<16)take(words.filter(w=>w.level<=level).sort((a,b)=>(s.stats[a.id]?.seen||0)-(s.stats[b.id]?.seen||0)),16-ids.length);
 return {date,ids:ids.slice(0,16),index:0,total:TOTAL,answers:[],feedback:null,done:false,phase:null,stops:[],finds:[],bonus,format:3};
}
function answer(s,id,choice,words){const q=s.session;if(q.feedback||q.done||q.phase)return false;const w=words[id],ok=choice===w.answer;
 const previous=s.stats[id]||{stage:0,seen:0,correct:0};
 const repeated=q.answers.some(a=>a.id===id);const stage=ok?(repeated?previous.stage:Math.min(5,previous.stage+1)):0;
 s.stats[id]={stage,seen:previous.seen+1,correct:previous.correct+(ok?1:0),due:addDays(q.date,[1,1,3,7,14,30][stage])};
 q.answers.push({id,ok,choice});q.feedback={id,ok,choice};return true;
}
function next(s){const q=s.session;if(!q.feedback||q.done)return false;q.feedback=null;q.index++;
 const first=firstPass(q),total=sessionTotal(q);
 if(q.index===first&&q.ids.length===first){const missed=q.answers.filter(a=>!a.ok).map(a=>a.id);const candidates=[...new Set([...missed,...q.ids])];q.ids.push(...candidates.slice(0,total-first));}
 if(q.index>=total){q.done=true;if(!s.days.includes(q.date))s.days.push(q.date);s.credits+=3;const item=s.relics.length%24;s.relics.push(item);q.reward=item;}
 else if(q.index%stopInterval(q)===0&&(q.index<first||total===12&&q.index===first))q.phase='stop';return true;}
function claimStop(s,choice){const q=s.session;if(!q||q.done||q.phase!=='stop'||![0,1,2].includes(choice))return false;q.stops.push(choice);q.finds.push(choice);s.credits+=1;q.phase='find';return true;}
function leaveStop(s){const q=s.session;if(!q||q.phase!=='find')return false;q.phase=null;return true;}
const api={leaveStop,TOTAL,sessionTotal,firstPass,stopInterval,day,addDays,initial,plan,answer,next,claimStop};if(typeof module!=='undefined')module.exports=api;else root.Engine=api;
})(typeof window!=='undefined'?window:globalThis);
