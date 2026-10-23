// Wedding song shared by every page. The first page a guest opens keeps the song and shows the
// invitation's other pages in a full-screen frame above it, so the song never stops between pages.
(()=>{const KEY='dkh-music',START=15;
let b=document.getElementById('mus');
if(!b){b=document.createElement('button');b.id='mus';b.className='mus-float';
 b.innerHTML='<svg viewBox="0 0 24 24" fill="#b98a30"><path d="M9 17V6l10-2v11" fill="none" stroke="#b98a30" stroke-width="1.8"/><circle cx="7" cy="17.5" r="2.6"/><circle cx="17" cy="15.5" r="2.6"/></svg>';
 const css=document.createElement('style');css.textContent='.mus-float{position:fixed;right:16px;bottom:16px;z-index:999;width:48px;height:48px;border-radius:50%;border:2px solid #c9a24a;background:radial-gradient(circle at 35% 30%,#fffaf0,#f1e2bd);box-shadow:0 4px 12px #0004;display:grid;place-items:center;cursor:pointer;padding:0}.mus-float svg{width:55%;height:55%}';
 document.head.appendChild(css);document.body.appendChild(b)}
function ui(v){b.setAttribute('aria-pressed',v);b.setAttribute('aria-label','Turn wedding music '+(v?'off':'on'));b.style.opacity=v?1:.6}

// Inside the frame: the page that opened us plays the song, this page's button just controls it
let T=null;try{if(window.top!==window&&window.top.__dkhPlayer)T=window.top}catch(e){}
if(T){T.__dkhSync&&T.__dkhSync(location.href,document.title); // don't wait for this page's images
 window.music=v=>{T.music(v);ui(v)};b.onclick=()=>window.music(!T.musicOn());ui(T.musicOn());return}

let st={on:false,t:0};try{st=JSON.parse(sessionStorage.getItem(KEY))||st}catch(e){}
const AUD=new Audio('assets/wedding-song.mp3');
// let the invitation's images load first; the 1.7 MB song only starts downloading after them (or right away when it must carry on)
AUD.preload=st.on?'auto':'none';if(!st.on)addEventListener('load',()=>{AUD.preload='auto'});
let ac,ag,on=false;
const AC=()=>ac||(ac=new (window.AudioContext||window.webkitAudioContext)());
function gx(){if(!ag){const c=AC();c.createMediaElementSource(AUD).connect(ag=c.createGain());ag.connect(c.destination)}return ag}
function fade(to,s){try{const c=AC(),g=gx().gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(to,c.currentTime+s)}catch(e){}}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify({on,t:AUD.currentTime||st.t}))}catch(e){}}
function play(from,fadeS){const go=()=>{if(from!=null)AUD.currentTime=from;else if(AUD.currentTime<START)AUD.currentTime=START;
 try{AC().resume().catch(()=>{});gx().gain.value=0}catch(e){}fade(.85,fadeS);return AUD.play()};
 if(AUD.readyState<1){AUD.preload='auto';if(AUD.networkState!==2)AUD.load()}
 return AUD.readyState>=1?go():new Promise((r,j)=>AUD.addEventListener('loadedmetadata',()=>go().then(r,j),{once:true}))}
// when the song finishes, start it again
AUD.addEventListener('ended',()=>{if(on)play(START,3).catch(()=>{})});
function music(v){on=v;ui(on);save();
 if(v)play(null,3).catch(()=>{});else{fade(0,.4);setTimeout(()=>{if(!on)AUD.pause()},450)}}
b.onclick=()=>music(!on);
addEventListener('pagehide',save);
window.music=music;window.musicOn=()=>on;window.__dkhPlayer=true;
// reopened after a refresh: carry on where the song was
if(st.on){on=true;ui(on);
 play(Math.max(st.t,START),.8).catch(()=>{
  // the browser blocked sound until the guest touches the page, so start on the first tap or scroll
  const once=()=>{['pointerdown','keydown','touchstart','wheel'].forEach(e=>removeEventListener(e,once,true));if(on)play(null,.8).catch(()=>{})};
  ['pointerdown','keydown','touchstart','wheel'].forEach(e=>addEventListener(e,once,true))})}
else ui(on);

// The invitation's own pages open in a full-screen frame; links inside it stay in the frame.
// The address bar, title and Back button follow the page in the frame.
const css=document.createElement('style');css.textContent='.page-frame{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:1000;background:#fff}';document.head.appendChild(css);
const title0=document.title;let fr=null;
window.__dkhSync=(url,t)=>{if(fr){history.replaceState({frame:1},'',url);document.title=t}};
if(history.state&&history.state.frame)history.replaceState(null,'');
function openPage(url){
 if(!fr){fr=document.createElement('iframe');fr.className='page-frame';fr.title='Invitation page';
  fr.addEventListener('load',()=>{try{const w=fr.contentWindow;history.replaceState({frame:1},'',w.location.href);document.title=w.document.title}catch(e){}});
  history.pushState({frame:1},'',url);fr.src=url;document.body.appendChild(fr);document.documentElement.style.overflow='hidden'}
 else fr.contentWindow.location.href=url}
addEventListener('popstate',e=>{if(fr&&!(e.state&&e.state.frame)){fr.remove();fr=null;document.documentElement.style.overflow='';document.title=title0}});
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');
 if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
 const u=new URL(a.href,location.href);
 if(u.origin!==location.origin||!/(\.html|\/)$/.test(u.pathname))return;
 if(u.pathname===location.pathname&&u.search===location.search&&u.hash)return; // same-page jump
 e.preventDefault();openPage(u.href)});
})();
