// Wedding song shared by every page: carries on from the same spot when guests move between pages
(()=>{const KEY='dkh-music',START=15;
let st={on:false,t:0};try{st=JSON.parse(sessionStorage.getItem(KEY))||st}catch(e){}
const AUD=new Audio('assets/wedding-song.mp3');AUD.preload='auto';
let ac,ag,on=false;
const AC=()=>ac||(ac=new (window.AudioContext||window.webkitAudioContext)());
function gx(){if(!ag){const c=AC();c.createMediaElementSource(AUD).connect(ag=c.createGain());ag.connect(c.destination)}return ag}
function fade(to,s){try{const c=AC(),g=gx().gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(to,c.currentTime+s)}catch(e){}}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify({on,t:AUD.currentTime||st.t}))}catch(e){}}
function play(from,fadeS){const go=()=>{if(from!=null)AUD.currentTime=from;else if(AUD.currentTime<START)AUD.currentTime=START;
 try{AC().resume().catch(()=>{});gx().gain.value=0}catch(e){}fade(.85,fadeS);return AUD.play()};
 return AUD.readyState>=1?go():new Promise((r,j)=>AUD.addEventListener('loadedmetadata',()=>go().then(r,j),{once:true}))}
// when the song finishes, start it again
AUD.addEventListener('ended',()=>{if(on)play(START,3).catch(()=>{})});
let b=document.getElementById('mus');
if(!b){b=document.createElement('button');b.id='mus';b.className='mus-float';
 b.innerHTML='<svg viewBox="0 0 24 24" fill="#b98a30"><path d="M9 17V6l10-2v11" fill="none" stroke="#b98a30" stroke-width="1.8"/><circle cx="7" cy="17.5" r="2.6"/><circle cx="17" cy="15.5" r="2.6"/></svg>';
 const css=document.createElement('style');css.textContent='.mus-float{position:fixed;right:16px;bottom:16px;z-index:999;width:48px;height:48px;border-radius:50%;border:2px solid #c9a24a;background:radial-gradient(circle at 35% 30%,#fffaf0,#f1e2bd);box-shadow:0 4px 12px #0004;display:grid;place-items:center;cursor:pointer;padding:0}.mus-float svg{width:55%;height:55%}';
 document.head.appendChild(css);document.body.appendChild(b)}
function ui(){b.setAttribute('aria-pressed',on);b.setAttribute('aria-label','Turn wedding music '+(on?'off':'on'));b.style.opacity=on?1:.6}
function music(v){on=v;ui();save();
 if(v)play(null,3).catch(()=>{});else{fade(0,.4);setTimeout(()=>{if(!on)AUD.pause()},450)}}
b.onclick=()=>music(!on);
addEventListener('pagehide',save);
window.music=music;
// coming from another page of the invitation: carry on where the song was
if(st.on){on=true;ui();
 play(Math.max(st.t,START),.8).catch(()=>{
  // the browser blocked sound until the guest touches the page, so start on the first tap or scroll
  const once=()=>{['pointerdown','keydown','touchstart','wheel'].forEach(e=>removeEventListener(e,once,true));if(on)play(null,.8).catch(()=>{})};
  ['pointerdown','keydown','touchstart','wheel'].forEach(e=>addEventListener(e,once,true))})}
else ui();
})();
