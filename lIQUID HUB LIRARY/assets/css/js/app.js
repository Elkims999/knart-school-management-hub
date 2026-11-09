
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3kPo410pngZystMWJ5BRsmJX6Q-9JNAw",
  authDomain: "library-web-app-b231d.firebaseapp.com",
  projectId: "library-web-app-b231d",
  storageBucket: "library-web-app-b231d.firebasestorage.app",
  messagingSenderId: "1892046595",
  appId: "1:1892046595:web:a25b46e38cec62d3e57b36"
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
/* Firestore loads separately so login/sign-up never depend on it */
let fdb=null,doc,getDoc,setDoc,collection,addDoc,query,orderBy,limit,getDocs,increment;
const fsReady=import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js").then(m=>{({doc,getDoc,setDoc,collection,addDoc,query,orderBy,limit,getDocs,increment}=m);fdb=m.getFirestore(fbApp)}).catch(e=>{fdb=null;console.warn('Firestore unavailable',e)});

const VER='4.0.0';
const ADMIN_EMAIL='nsikanalbert247@gmail.com';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=p=>p+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const cleanErr=e=>String((e&&e.message)||e||'Something went wrong').replace('Firebase: ','');
const IC={home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',chart:'<path d="M12 20V9M6 20v-5M18 20V4"/>',plus:'<path d="M12 5v14M5 12h14"/>',chevD:'<path d="M6 9l6 6 6-6"/>',chevR:'<path d="M9 6l6 6-6 6"/>',folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',folderOpen:'<path d="M3 8V7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v1"/><path d="M3 11h18l-1.6 6.6a2 2 0 01-2 1.4H6.6a2 2 0 01-2-1.4z"/>',file:'<path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',more:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',upload:'<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',move:'<path d="M5 12h14M13 6l6 6-6 6"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',restore:'<path d="M4 12a8 8 0 108-8H7"/><path d="M7 1l-3 3 3 3"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',palette:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',panel:'<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 5v14"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2M12 17h.01"/>',play:'<path d="M7 5l12 7-12 7z"/>',mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',bug:'<path d="M8 6h8M8 18h8M6 12h12"/><path d="M12 6v12"/><path d="M6 10V8a6 6 0 0112 0v2"/><path d="M6 14v2a6 6 0 0012 0v-2"/><path d="M4 12h2M18 12h2"/>',bell:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',logout:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',quote:'<path d="M7 17h3l2-4V7H6v6h3M15 17h3l2-4V7h-6v6h3"/>',sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',check:'<path d="M5 12l5 5 9-10"/>'};
const ic=(n,s)=>`<svg class="i" viewBox="0 0 24 24"${s?` style="width:${s}px;height:${s}px"`:''}>${IC[n]||''}</svg>`;
const PAL={gray:'#7B8497',blue:'#4A7DFF',green:'#30BFA5',orange:'#F59E0B',pink:'#EC4899',purple:'#8B5CF6',red:'#EF4444',indigo:'#5856D6'};
const FCOL=['indigo','pink','teal','orange','blue','purple','red','green'];
PAL.teal='#14B8A6';
const KT={pdf:['PDF','#E5484D'],doc:['DOC','#2B6CB0'],xls:['XLS','#2F9E44'],ppt:['PPT','#E8590C'],img:['IMG','#9C36B5'],vid:['VID','#D6336C'],aud:['AUD','#0C8599'],txt:['TXT','#7B8497'],code:['CODE','#495057'],zip:['ZIP','#F08C00'],other:['FILE','#7B8497']};
const MIMES={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',svg:'image/svg+xml',mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg',wav:'audio/wav',txt:'text/plain',md:'text/markdown',json:'application/json',csv:'text/csv'};
const ext=n=>(n.includes('.')?n.split('.').pop():'').toLowerCase();
function kindOf(f){const e=ext(f.name),m=f.type||'';
  if(m.startsWith('image/')||['png','jpg','jpeg','gif','webp','svg','avif','bmp'].includes(e))return'img';
  if(m==='application/pdf'||e==='pdf')return'pdf';
  if(m.startsWith('video/')||['mp4','webm','mov','mkv'].includes(e))return'vid';
  if(m.startsWith('audio/')||['mp3','wav','ogg','m4a','flac'].includes(e))return'aud';
  if(['doc','docx','odt','rtf'].includes(e))return'doc';
  if(['xls','xlsx','csv','ods'].includes(e))return'xls';
  if(['ppt','pptx','odp'].includes(e))return'ppt';
  if(['zip','rar','7z','tar','gz'].includes(e))return'zip';
  if(['js','ts','json','html','css','py','xml','yml','yaml','md','java','c','cpp','sh','sql'].includes(e))return'code';
  if(m.startsWith('text/')||e==='txt')return'txt';return'other'}
const isText=f=>['txt','code'].includes(kindOf(f))||ext(f.name)==='csv';
function fmtSize(b){if(b<1024)return b+' B';const u=['KB','MB','GB','TB'];let i=-1;do{b/=1024;i++}while(b>=1024&&i<3);return(b<10?b.toFixed(1):Math.round(b))+' '+u[i]}
function fmtDate(t){const d=new Date(t),s=(Date.now()-t)/1000;if(s<60)return'Just now';if(s<3600)return Math.floor(s/60)+' min ago';
  const td=new Date();if(d.toDateString()===td.toDateString())return'Today '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'})}
const fmtTime=t=>new Date(t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
function dayLabel(t){const d=new Date(t),n=new Date(),y=new Date();y.setDate(n.getDate()-1);if(d.toDateString()===n.toDateString())return'Today';if(d.toDateString()===y.toDateString())return'Yesterday';return d.toLocaleDateString([],{weekday:'long',month:'short',day:'numeric',year:'numeric'})}
function shade(hex,p){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+(p<0?v:255-v)*p)));return'#'+[r,g,b].map(f).map(v=>v.toString(16).padStart(2,'0')).join('')}
const avColor=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return`hsl(${h} 60% 52%)`};
const fmtN=n=>n==null?'—':Number(n).toLocaleString();

/* ---------- state ---------- */
const KEY='knart_hub_v3';
const DEF={dark:false,user:'You',username:'user',fullname:'User',email:'',pinHash:null,autolock:5,mode:'list',sortKey:'name',sortDir:1,font:15,tourDone:false,myRating:0};
let S, U, currentUser=null, V=null, memStore=new Map(), dragIds=null, toastT=null, isUploading=false, _db, loginFlag=false;
let CS={users:null,visits:null,sum:0,count:0};
let cloudSec=[], COMING=[], csTok=0, upTarget=null, T=null, welcoming=false, pinBuf='', lockT;

function devLabel(){const u=navigator.userAgent;let b='Browser',o='Unknown device';
  if(/Edg\//.test(u))b='Edge';else if(/OPR\//.test(u))b='Opera';else if(/Chrome\//.test(u))b='Chrome';else if(/Firefox\//.test(u))b='Firefox';else if(/Safari\//.test(u))b='Safari';
  if(/Android/.test(u))o='Android';else if(/iPhone|iPad/.test(u))o='iOS';else if(/Windows/.test(u))o='Windows';else if(/Mac OS/.test(u))o='macOS';else if(/Linux/.test(u))o='Linux';
  return b+' on '+o}
const DEV=(()=>{let id=null;try{id=localStorage.getItem('knart_dev_id');if(!id){id=uid('dev_');localStorage.setItem('knart_dev_id',id)}}catch(e){id=uid('dev_')}return{id,label:devLabel()}})();

function seed(){const t=Date.now();return{v:3,ver:VER,seeded:false,folders:[
 {id:'htu',name:'How to use',parent:null,color:'indigo',notes:'Read the documentary or start the tour!',created:t},
 {id:'exm',name:'Examination',parent:null,color:'orange',notes:'Exam schedules, results, and past papers.',created:t},
 {id:'stf',name:'Staff',parent:null,color:'green',notes:'Staff handbooks and payroll.',created:t},
 {id:'stu',name:'Student',parent:null,color:'blue',notes:'Student records and enrollment data.',created:t},
 {id:'cur',name:'Curriculum',parent:null,color:'purple',notes:'Syllabus and lesson plans.',created:t}],
 files:[
  {id:'tour_file',name:'Tour',folder:'htu',size:0,type:'text/plain',added:t,mod:t,by:'System',starred:true,tags:['help'],trashed:false,isTour:true},
  {id:'doc_file',name:'Documentary.txt',folder:'htu',size:0,type:'text/plain',added:t,mod:t,by:'System',starred:false,tags:['help'],trashed:false}
 ],
 notifications:[],flash:[],devices:[],settings:{...DEF},log:[],expanded:['htu'],last:null}}

/* ---------- App data helpers ---------- */
const save=()=>{try{if(currentUser)localStorage.setItem(KEY+'_'+currentUser.uid,JSON.stringify(S))}catch(e){toast('Browser storage is full.')}};
const log=(m,k)=>{S.log.unshift({t:Date.now(),m,k:k||'info'});if(S.log.length>300)S.log.length=300};
const notif=m=>{S.notifications.unshift({t:Date.now(),m,read:false});if(S.notifications.length>50)S.notifications.length=50;save();updateBadges()};
const updateBadges=()=>{
  const unread=S.notifications.filter(n=>!n.read).length,badge=$('#notifBadge');
  if(unread>0){badge.textContent=unread;badge.classList.remove('hide')}else badge.classList.add('hide');
  $('#uploadSpinner').classList.toggle('hide',!isUploading)};
const FO=id=>S.folders.find(f=>f.id===id),FI=id=>S.files.find(f=>f.id===id);
const kids=id=>S.folders.filter(f=>f.parent===(id||null)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
function desc(id){const o=[];(function w(i){kids(i).forEach(k=>{o.push(k.id);w(k.id)})})(id);return o}
const live=()=>S.files.filter(f=>!f.trashed);
const trashed=()=>S.files.filter(f=>f.trashed);
function fcount(id){if(!id)return live().length;const ids=[id,...desc(id)];return live().filter(f=>ids.includes(f.folder)).length}
const snap=()=>JSON.stringify({folders:S.folders,files:S.files});
function restoreSnap(s){const o=JSON.parse(s);S.folders=o.folders;S.files=o.files;if(U.folder&&!FO(U.folder))U.folder=null;U.sel.clear();save();renderAll()}
const hasNew=()=>{const t=Date.now();return live().some(f=>t-f.added<3600e3)};
const namesOf=ids=>{const n=ids.map(i=>FI(i)&&FI(i).name).filter(Boolean);return n.length>3?n.slice(0,3).join(', ')+` +${n.length-3} more`:n.join(', ')};

/* ---------- Browser file storage (IndexedDB) ---------- */
const db=()=>_db||(_db=new Promise(r=>{try{const q=indexedDB.open('liquidhub',1);q.onupgradeneeded=()=>q.result.createObjectStore('blobs');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}}));
async function putBlob(id,b){const d=await db();if(!d){memStore.set(id,b);return true}return new Promise(r=>{try{const t=d.transaction('blobs','readwrite');t.objectStore('blobs').put(b,id);t.oncomplete=()=>r(true);t.onerror=()=>r(false);t.onabort=()=>r(false)}catch(e){r(false)}})}
async function getBlob(id){const d=await db();if(!d)return memStore.get(id)||null;return new Promise(r=>{try{const q=d.transaction('blobs').objectStore('blobs').get(id);q.onsuccess=()=>r(q.result||null);q.onerror=()=>r(null)}catch(e){r(null)}})}
async function delBlob(id){revoke(id);const d=await db();if(!d){memStore.delete(id);return}return new Promise(r=>{try{const t=d.transaction('blobs','readwrite');t.objectStore('blobs').delete(id);t.oncomplete=()=>r();t.onerror=()=>r();t.onabort=()=>r()}catch(e){r()}})}
const urls=new Map();
function revoke(id){const u=urls.get(id);if(u){URL.revokeObjectURL(u);urls.delete(id)}}
async function urlFor(id){if(urls.has(id))return urls.get(id);let b=await getBlob(id);if(!b)return null;const f=FI(id);if(f&&!b.type){const t=f.type||MIMES[ext(f.name)];if(t)b=new Blob([b],{type:t})}const u=URL.createObjectURL(b);urls.set(id,u);return u}

/* ---------- UI helpers ---------- */
function toast(msg,undo){const t=$('#toast');t.innerHTML=`<span>${esc(msg)}</span>`+(undo?'<button data-act="undo">Undo</button>':'');t._u=undo||null;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),undo?7000:3600)}
function dialog(html,init){return new Promise(res=>{const bd=document.createElement('div');bd.className='backdrop';bd.innerHTML=`<div class="modal" role="dialog" aria-modal="true">${html}</div>`;$('#modalRoot').appendChild(bd);requestAnimationFrame(()=>bd.classList.add('show'));
  const done=v=>{if(bd._d)return;bd._d=1;bd.classList.remove('show');document.removeEventListener('keydown',kd,true);setTimeout(()=>bd.remove(),220);res(v)};
  const kd=e=>{if(e.key==='Escape'){e.stopPropagation();done(null)}};document.addEventListener('keydown',kd,true);
  bd.addEventListener('mousedown',e=>{if(e.target===bd)done(null)});
  const m=bd.firstChild;init&&init(m,done);const f=m.querySelector('input.field,textarea.field,button.primary');if(f){f.focus();f.select&&f.tagName==='INPUT'&&f.type!=='password'&&f.select()}})}
const askText=(title,val='',ph='',ok='Save',desc)=>dialog(`<h3>${esc(title)}</h3>${desc?`<p>${esc(desc)}</p>`:''}<input class="field" value="${esc(val)}" placeholder="${esc(ph)}" maxlength="120"><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">${ok}</button></div>`,(m,done)=>{const i=$('input',m);const go=()=>{const v=i.value.trim();if(!v){i.focus();return}done(v)};m.onclick=e=>{const x=e.target.closest('[data-x]');if(!x)return;x.dataset.x==='o'?go():done(null)};i.onkeydown=e=>{if(e.key==='Enter')go()}});
const askConfirm=(title,msg,ok='Confirm',danger)=>dialog(`<h3>${esc(title)}</h3><p>${esc(msg)}</p><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" ${danger?'style="background:var(--danger);border-color:var(--danger);color:#fff;box-shadow:none"':''} data-x="o">${esc(ok)}</button></div>`,(m,done)=>{m.onclick=e=>{const x=e.target.closest('[data-x]');if(x)done(x.dataset.x==='o')}}).then(v=>!!v);
function pickFolder(title,exclude=[],cur){return dialog(`<h3>${esc(title)}</h3><div class="pick" id="pk"></div><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">Move here</button></div>`,(m,done)=>{let sel=cur===undefined?'':cur;const rows=[];const draw=()=>{rows.length=0;rows.push(`<div class="pk ${sel===''?'on':''}" data-id="">${ic('db',18)} School Files (top level)</div>`);(function w(p,d){kids(p).forEach(f=>{rows.push(`<div class="pk ${sel===f.id?'on':''} ${exclude.includes(f.id)?'dis':''}" data-id="${f.id}" style="padding-left:${12+d*20}px">${ic('folder',18)} ${esc(f.name)}</div>`);w(f.id,d+1)})})(null,1);$('#pk',m).innerHTML=rows.join('')};draw();
  m.onclick=e=>{const p=e.target.closest('.pk');if(p){sel=p.dataset.id;draw();return}const x=e.target.closest('[data-x]');if(x)done(x.dataset.x==='o'?sel:null)}})}
function menu(x,y,items){closeMenu();const m=document.createElement('div');m.className='menu';m.id='ctx';m.innerHTML=items.map((it,i)=>it==='-'?'<hr>':`<button class="${it.danger?'danger':''}" data-i="${i}" style="${it.pad?`padding-left:${it.pad}px`:''}">${it.i?ic(it.i):''}<span>${esc(it.t)}</span></button>`).join('');document.body.appendChild(m);
  if(innerWidth>900){const r=m.getBoundingClientRect();m.style.left=Math.max(8,Math.min(x,innerWidth-r.width-8))+'px';m.style.top=Math.max(8,Math.min(y,innerHeight-r.height-8))+'px'}
  m.onclick=e=>{const b=e.target.closest('button');if(!b)return;const it=items[+b.dataset.i];closeMenu();it.fn&&it.fn()}}
const closeMenu=()=>{const m=$('#ctx');m&&m.remove()};
const menuAt=el=>{const r=el.getBoundingClientRect();return[r.left,r.bottom+4]};
function upbar(txt,pct){$('#upbar').classList.add('show');$('#upTxt').textContent=txt;$('#upFill').style.width=Math.max(3,Math.min(100,pct))+'%'}
const upHide=()=>setTimeout(()=>$('#upbar').classList.remove('show'),900);

const EMPTY={
files:`<svg class="empty-art" viewBox="0 0 200 160" fill="none" aria-hidden="true"><circle cx="100" cy="82" r="66" fill="url(#eg1)"/><path d="M68 94a20 20 0 0 1 3-40 26 26 0 0 1 50-4 18 18 0 0 1 22 17 16 16 0 0 1-2 27H68z" fill="var(--panel)" stroke="var(--indigo)" stroke-width="2.4" stroke-linejoin="round"/><path d="M100 118V78M100 78l-12 12M100 78l12 12" stroke="var(--indigo)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="38" y="122" width="32" height="20" rx="5" fill="#4A7DFF" opacity=".75"/><rect x="130" y="122" width="32" height="20" rx="5" fill="#30BFA5" opacity=".75"/><defs><radialGradient id="eg1"><stop offset="0" stop-color="#5856D6" stop-opacity=".16"/><stop offset="1" stop-color="#30BFA5" stop-opacity="0"/></radialGradient></defs></svg>`,
folders:`<svg class="empty-art" viewBox="0 0 200 160" fill="none" aria-hidden="true"><circle cx="100" cy="80" r="66" fill="#5856D6" opacity=".09"/><path d="M38 52h42l10 12h62a10 10 0 0 1 10 10v48a10 10 0 0 1-10 10H38a10 10 0 0 1-10-10V62a10 10 0 0 1 10-10z" fill="var(--panel)" stroke="var(--indigo)" stroke-width="2.4" stroke-linejoin="round"/><path d="M48 78h28l8 8h50" stroke="var(--indigo)" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round" opacity=".65"/><rect x="52" y="100" width="46" height="7" rx="3.5" fill="var(--indigo)" opacity=".3"/><rect x="52" y="114" width="66" height="7" rx="3.5" fill="var(--indigo)" opacity=".18"/></svg>`,
star:`<svg class="empty-art" viewBox="0 0 200 160" fill="none" aria-hidden="true"><circle cx="100" cy="80" r="66" fill="#F59E0B" opacity=".12"/><path d="M100 46l14 29 32 3-24 21 7 31-29-16-29 16 7-31-24-21 32-3z" fill="#F59E0B" stroke="#D97706" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
trash:`<svg class="empty-art" viewBox="0 0 200 160" fill="none" aria-hidden="true"><circle cx="100" cy="80" r="66" fill="#7B8497" opacity=".1"/><path d="M62 66h76M78 66V50h44v16M72 66l8 66h40l8-66" stroke="#7B8497" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 88v28M110 88v28" stroke="#7B8497" stroke-width="2.4" stroke-linecap="round"/></svg>`
};

function thumb(f){const k=kindOf(f);if(f.isTour)return`<div class="fi k" style="background:var(--indigo)">T</div>`;if(k==='img'&&f.size<15e6)return`<div class="fi"><img data-thumb="${f.id}" alt="" loading="lazy"></div>`;return`<div class="fi k" style="background:${KT[k][1]}">${KT[k][0]}</div>`}
const avatar=n=>`<div class="av" style="background:${avColor(n||'?')}">${esc((n||'?')[0].toUpperCase())}</div>`;
const tagPills=f=>f.tags.map(t=>`<span class="pill" data-act="tagView" data-tag="${esc(t)}">#${esc(t)}</span>`).join('');
function rowHTML(f,tr){const s=U.sel.has(f.id);return`<div class="trow ${s?'sel':''}" data-act="openFile" data-fid="${f.id}" draggable="true" tabindex="0">
<div class="c-chk" data-act="selcell"><input type="checkbox" class="cb" ${s?'checked':''} tabindex="-1" aria-label="Select ${esc(f.name)}"></div>
<div class="c-name">${thumb(f)}<div class="nm2"><div class="n">${esc(f.name)}</div><div class="sub">${tr?`Deleted ${fmtDate(f.tAt)}`:tagPills(f)}</div></div></div>
<div class="c-by">${avatar(f.by)}<span>${esc(f.by)}</span></div><div class="c-mod">${fmtDate(f.mod)}</div><div class="c-sz">${fmtSize(f.size)}</div>
<div class="c-act">${tr?`<button class="ab" data-act="restoreOne" title="Restore">${ic('restore')}</button>`:`<button class="ab ${f.starred?'starred':''}" data-act="star" title="Star">${ic('star')}</button>`}<button class="ab" data-act="fileMenu" title="More actions">${ic('more')}</button></div></div>`}
function cardHTML(f){const s=U.sel.has(f.id),k=kindOf(f);return`<div class="gcard ${s?'sel':''}" data-act="openFile" data-fid="${f.id}" draggable="true" tabindex="0">
<div class="gthumb">${f.isTour?`<div class="k" style="background:var(--indigo)">T</div>`:(k==='img'&&f.size<15e6?`<img data-thumb="${f.id}" alt="" loading="lazy">`:`<div class="k" style="background:${KT[k][1]}">${KT[k][0]}</div>`)}</div>
<div class="gc" data-act="selcell"><input type="checkbox" class="cb" ${s?'checked':''} tabindex="-1"></div>
<button class="ab gs ${f.starred?'starred':''}" data-act="star">${ic('star')}</button>
<div class="ginfo"><div class="n">${esc(f.name)}</div><div class="s">${fmtSize(f.size)} · ${fmtDate(f.mod)}</div></div></div>`}
function sortFiles(a){const{sortKey:k,sortDir:d}=S.settings;return[...a].sort((x,y)=>{let r=0;if(k==='name')r=x.name.localeCompare(y.name,undefined,{numeric:true,sensitivity:'base'});else if(k==='size')r=x.size-y.size;else if(k==='by')r=x.by.localeCompare(y.by);else r=x.mod-y.mod;return r*d})}
function filesBlock(files,opt={}){
  if(!files.length){
    const art=opt.art||EMPTY.files,heading=opt.heading||'Your workspace is ready',desc=opt.desc||'Upload lecture notes, PDFs, assignments and other academic resources.',btnLabel=opt.btnLabel||'Upload your first file';
    return`<div class="empty">${art}<b>${heading}</b><span>${desc}</span>${opt.btn===false?'':`<button class="btn primary" data-act="upload">${ic('upload')} ${btnLabel}</button>`}</div>`}
  if(!opt.keepOrder)files=sortFiles(files);
  if(S.settings.mode==='grid')return`<div class="grid2">${files.map(cardHTML).join('')}</div>`;
  const sk=S.settings.sortKey,sd=S.settings.sortDir,arrow=k=>sk===k?(sd>0?' ↑':' ↓'):'';const all=files.every(f=>U.sel.has(f.id));
  return`<div class="tbl"><div class="thead"><div class="c-chk" data-act="selall"><input type="checkbox" class="cb" ${all?'checked':''} tabindex="-1" aria-label="Select all"></div><div><button class="${sk==='name'?'on':''}" data-act="sort" data-k="name">Name${arrow('name')}</button></div><div class="h-by"><button class="${sk==='by'?'on':''}" data-act="sort" data-k="by">Added by${arrow('by')}</button></div><div class="h-mod"><button class="${sk==='mod'?'on':''}" data-act="sort" data-k="mod">Modified${arrow('mod')}</button></div><div class="h-sz"><button class="${sk==='size'?'on':''}" data-act="sort" data-k="size">Size${arrow('size')}</button></div><div></div></div>${files.map(f=>rowHTML(f,opt.trash)).join('')}</div>`}
function folderCard(f){const ids=[f.id,...desc(f.id)],fs=live().filter(x=>ids.includes(x.folder)),n=fs.length,c=PAL[f.color]||PAL.gray;
  const ks=[...new Set(fs.map(kindOf))].slice(0,3);
  const gid='g-'+f.id;
  const svg=`<svg viewBox="0 0 240 190"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${shade(c,.18)}"/><stop offset="1" stop-color="${shade(c,-.08)}"/></linearGradient></defs><path d="M10 26Q10 10 26 10H92Q100 10 106 17L116 28H214Q230 28 230 44V160Q230 176 214 176H26Q10 176 10 160Z" fill="${shade(c,-.28)}"/>${n?`<g><rect x="34" y="26" width="90" height="100" rx="8" fill="#F7F7F8" transform="rotate(-7 80 76)"/><rect x="100" y="30" width="96" height="100" rx="8" fill="#FFFFFF" transform="rotate(6 148 80)"/><rect x="60" y="22" width="100" height="100" rx="8" fill="#ECECEF"/></g>`:''}<path d="M10 70Q10 54 26 54H98Q106 54 112 59L124 70H214Q230 70 230 86V160Q230 176 214 176H26Q10 176 10 160Z" fill="url(#${gid})"/><path d="M10 70Q10 54 26 54H98Q106 54 112 59L124 70H214Q230 70 230 86V92Q230 82 214 82H26Q10 82 10 92Z" fill="#FFF" opacity=".18"/></svg>`;
  return`<div class="fcard" data-act="openFolder" data-id="${f.id}" data-drop="${f.id}" tabindex="0" role="button" aria-label="${esc(f.name)}, ${n} files"><div class="fvis">${svg}<div class="badges">${ks.map(k=>`<b style="background:${KT[k][1]}">${KT[k][0][0]}</b>`).join('')}</div></div><button class="fmore" data-act="folderMenu" aria-label="Folder actions">${ic('more')}<span>Options</span></button><div class="fname">${esc(f.name)}</div><div class="fmeta">${n} ${n===1?'file':'files'}</div></div>`}

function renderRail(){
  const it=[['home','home','Home','Home'],['folder','db','School Files','Files'],['activity','pulse','Activity','Activity'],['stats','chart','Insights','Insights']];
  const on=U.q?'':['home','activity','stats'].includes(U.view)?U.view:'folder';
  const showDot=v=>v==='folder'&&hasNew();
  $('#rail').innerHTML=it.map(([v,i,t,l])=>`<button class="rbtn ${on===v?'on':''}" data-act="nav" data-v="${v}" title="${t}" aria-label="${t}">${ic(i,22)}<span>${l}</span>${showDot(v)?'<span class="rbtn-dot"></span>':''}</button>`).join('')
   +'<span class="rail-sp"></span>'
   +`<button class="rbtn" data-act="lockNow" title="Lock the hub with your PIN" aria-label="Lock">${ic('lock',22)}<span>Lock</span></button>`}
function treeHTML(id,d){return kids(id).map(f=>{const k=kids(f.id),open=S.expanded.includes(f.id),on=U.view==='folder'&&!U.q&&U.folder===f.id;
  return`<div><div class="trow2 ${on?'on':''}" data-act="openFolder" data-id="${f.id}" data-drop="${f.id}" tabindex="0"><span class="car ${k.length?(open?'open':''):'none'}" data-act="toggle" data-id="${f.id}" title="Show inner folders">${ic('chevR',13)}</span>${ic(open||on?'folderOpen':'folder',18)}<span class="nm">${esc(f.name)}</span><span class="cnt">${fcount(f.id)}</span></div>${k.length&&open?`<div class="kids">${treeHTML(f.id,d+1)}</div>`:''}</div>`}).join('')}
function renderSide(){
  $('#seg').innerHTML=`<button class="${U.tab==='folders'?'on':''}" data-act="tab" data-t="folders">Folders</button><button class="${U.tab==='tags'?'on':''}" data-act="tab" data-t="tags">Tags</button>`;
  const t=$('#tree');
  if(U.tab==='tags'){const m={};live().forEach(f=>f.tags.forEach(x=>m[x]=(m[x]||0)+1));const es=Object.entries(m).sort((a,b)=>b[1]-a[1]).filter(([k])=>!U.sq||k.toLowerCase().includes(U.sq.toLowerCase()));
    t.innerHTML=es.length?es.map(([k,c])=>`<div class="tagrow ${U.view==='tag'&&U.tag===k?'on':''}" data-act="tagView" data-tag="${esc(k)}"><span class="dot" style="background:var(--indigo)"></span><span class="nm" style="flex:1">#${esc(k)}</span><span class="cnt" style="color:var(--mu)">${c}</span></div>`).join(''):`<p style="color:var(--mu);padding:14px;line-height:1.5;font-size:.88em">No tags yet. Click ⋯ on a file and choose “Add tags”.</p>`}
  else if(U.sq){const q=U.sq.toLowerCase(),r=S.folders.filter(f=>f.name.toLowerCase().includes(q));t.innerHTML=r.length?r.map(f=>`<div class="trow2" data-act="openFolder" data-id="${f.id}" data-drop="${f.id}" tabindex="0">${ic('folder',18)}<span class="nm">${esc(f.name)}</span><span class="cnt">${fcount(f.id)}</span></div>`).join(''):`<p style="color:var(--mu);padding:14px;font-size:.88em">No folders match “${esc(U.sq)}”.</p>`}
  else t.innerHTML=`<div class="trow2 ${U.view==='folder'&&!U.q&&!U.folder?'on':''}" data-act="openFolder" data-id="" data-drop="" tabindex="0">${ic('db',18)}<span class="nm">All files</span><span class="cnt">${live().length}</span></div>`+treeHTML(null,0);
  const sc=live().filter(f=>f.starred).length,used=live().reduce((a,f)=>a+f.size,0);
  const sm=(v,i,l,c)=>`<div class="tagrow ${U.view===v&&!U.q?'on':''}" data-act="smart" data-v="${v}">${ic(i,17)}<span style="flex:1">${l}</span><span style="color:var(--mu);font-size:.85em">${c}</span></div>`;
  $('#smart').innerHTML=sm('starred','star','Starred',sc)+sm('recent','clock','Recent','')+sm('trash','trash','Trash',trashed().length||'')+`<div class="meter">${fmtSize(used)} saved in this browser<i><b style="width:${Math.min(100,used/5e8*100)}%"></b></i></div>`}
function head(){const wh=$('#wh');
  let title='';
  if(U.q)title=`Results for “${U.q}”`;else if(U.view==='folder'){title=U.folder?FO(U.folder).name:'School Files'}else title={home:'Home',starred:'Starred',recent:'Recent',trash:'Trash',tag:'#'+U.tag,activity:'Activity',stats:'Insights',howto:'How to use'}[U.view];
  const dd=U.view==='folder'&&!U.q;
  const l=`<button class="btn sbtog" data-act="sbMobile" aria-label="Show folders">${ic('panel')}<span>Folders</span></button><button class="crumbbtn" ${dd?'data-act="crumb" title="Jump to another folder"':'disabled style="cursor:default"'}><span>${esc(title)}</span>${dd?ic('chevD'):''}</button>`;
  let r='';if(dd)r=`<button class="btn" data-act="newFolder">${ic('plus')}<span class="lbl">New folder</span></button><button class="btn primary" data-act="upload">${ic('upload')}<span class="lbl">Upload</span></button>`;
  wh.innerHTML=`<div class="wh-l">${l}</div><div class="wh-r">${r}</div>`;
  $('#backBtn').disabled=(U.view==='folder'&&!U.q&&!U.folder)}
function bulkBar(tr){const n=U.sel.size;if(!n)return'';const b=(a,i,t)=>`<button class="ab" data-act="${a}" title="${t}">${ic(i,16)}<span>${t}</span></button>`;return`<div class="bulk"><span>${n} selected</span>${tr?b('bRestore','restore','Restore')+b('bPurge','trash','Delete forever'):b('bDownload','download','Download')+b('bMove','move','Move')+b('bTag','tag','Tag')+b('bStar','star','Star')+b('bTrash','trash','Trash')}${b('clearSel','x','Clear')}</div>`}
const viewTools=()=>{const m=S.settings.mode;return`<div class="segmented" role="group" aria-label="View style"><button class="${m==='list'?'on':''}" data-act="setMode" data-m="list" title="List view" aria-label="List view">${ic('list')}</button><button class="${m==='grid'?'on':''}" data-act="setMode" data-m="grid" title="Grid view" aria-label="Grid view">${ic('grid')}</button></div>`};
function sec(t,r){return`<div class="sec"><h2>${t}</h2><div class="r">${r||''}</div></div>`}
function parseQ(q){return q.toLowerCase().split(/\s+/).filter(Boolean)}
function matchF(f,tk){const kn=KT[kindOf(f)][0].toLowerCase();return tk.every(t=>t.startsWith('tag:')?f.tags.some(x=>x.toLowerCase().includes(t.slice(4))):t.startsWith('type:')?kn===t.slice(5)||ext(f.name)===t.slice(5):t==='is:starred'?f.starred:f.name.toLowerCase().includes(t)||f.tags.some(x=>x.toLowerCase().includes(t))||kn===t||(f.by||'').toLowerCase().includes(t))}

const HOW=[
['folder','Create a folder','Open School Files and press New folder. Type a name such as “Year 5 Reports” and press Create. Folders can sit inside other folders.','newFolder','New folder'],
['upload','Add files','Press Upload and pick files from your device. You can also drag files onto the page. Drop them on a folder to put them straight inside. Files are saved in this browser.','upload','Upload files'],
['quote','Flashcards','Open Activity. Type who said it, what they said, the subject and the course, then press Save flashcard. Change its colour or delete it any time.','nav','Open Activity','activity'],
['pulse','See your activity','Activity lists your uploads, deleted files, folders you made, and sign-ins from other devices.','nav','Open Activity','activity'],
['eye','Open and preview','Click any file to preview it. Use the arrows to move to the next file and press Esc to close.'],
['edit','Rename, move, colour and tag','Click the ⋯ button on a file or folder, or right-click it. Pick what you want to do. Tags make files easy to find later.'],
['search','Find anything fast','Type in the search box at the top. Try type:pdf or tag:exams. Start with / to search inside text files.'],
['star','Star, delete and restore','Star important files to find them under Starred. Deleted files wait in Trash for 30 days. Press Undo straight after a mistake.'],
['lock','Protect with a PIN','Open Settings, turn on PIN lock and choose 5 digits. The hub locks itself after the time you pick.','settings','Open settings']];

/* ---------- Flashcards ---------- */
function fcCard(c){const col=PAL[c.color]||PAL.indigo;
  return`<div class="fcd" data-fc="${c.id}" style="background:linear-gradient(135deg,${col},${shade(col,-.34)})"><div class="tools"><button data-act="fcColor" aria-label="Change colour" title="Change colour">${ic('palette',16)}</button><button data-act="fcDel" aria-label="Delete flashcard" title="Delete flashcard">${ic('trash',16)}</button></div><div class="q">${esc(c.quote)}</div><div class="who">— ${esc(c.person)}</div><div class="tags">${c.subject?`<span>${esc(c.subject)}</span>`:''}${c.course?`<span>${esc(c.course)}</span>`:''}</div></div>`}
function flashSection(){
  return sec('Flashcards',`<span style="color:var(--mu);font-size:.88em">${S.flash.length} saved</span>`)+
  `<div class="fc-form"><h3>New flashcard</h3><p>Save a quote or a lesson point so you can revise it later.</p>
  <div class="fc-row"><input class="field" id="fcPerson" placeholder="Who said it?" maxlength="60"><input class="field" id="fcSubject" placeholder="Subject" maxlength="60"><input class="field" id="fcCourse" placeholder="Course (e.g. LIS 201)" maxlength="60"></div>
  <textarea class="field" id="fcQuote" placeholder="What did they say?" maxlength="600"></textarea>
  <div class="m-act"><button class="btn primary" data-act="saveFlash">${ic('plus')} Save flashcard</button></div></div>`+
  (S.flash.length?`<div class="fc-grid">${S.flash.map(fcCard).join('')}</div>`:`<div class="empty" style="margin-bottom:36px"><b>No flashcards yet</b><span>Fill in the form above and your first flashcard will appear here.</span></div>`)}

/* ---------- Activity ---------- */
const KIND={upload:['upload','#30BFA5'],delete:['trash','#E5484D'],restore:['restore','#22A06B'],folder:['folder','#F59E0B'],security:['lock','#5856D6'],flash:['quote','#EC4899'],info:['info','#4A7DFF']};
function mergedActivity(){
  const local=S.log.map(e=>({t:e.t,m:e.m,k:e.k||'info',other:false}));
  const cloud=cloudSec.filter(e=>e.dev!==DEV.id).map(e=>({t:e.t,m:e.m,k:'security',other:true,label:e.label}));
  return[...local,...cloud].sort((a,b)=>b.t-a.t)}
function activityHTML(){
  const f=U.actF||'all',all=mergedActivity();
  const flt=all.filter(e=>f==='all'||(f==='other'?!['upload','delete','security'].includes(e.k):e.k===f));
  const chips=[['all','All'],['upload','Uploads'],['delete','Deleted'],['security','Security'],['other','Other']].map(([k,l])=>`<button class="btn sm ${f===k?'on':''}" data-act="actFilter" data-f="${k}">${l}</button>`).join('');
  let body='';
  if(!flt.length)body=`<div class="empty"><b>Nothing here yet</b><span>Uploads, deleted files and sign-ins will show up as you use the hub.</span></div>`;
  else{let last='',open=false;
    flt.slice(0,150).forEach(e=>{const d=dayLabel(e.t);if(d!==last){if(open)body+='</div>';body+=`<div class="tl-day">${esc(d)}</div><div class="tl">`;open=true;last=d}
      const[i,c]=KIND[e.k]||KIND.info;
      body+=`<div class="tl-i"><div class="tl-ic" style="background:${c}">${ic(i,17)}</div><div class="tl-t">${esc(e.m)}${e.other?`<span class="tl-tag">Other device</span><small>${esc(e.label||'')}</small>`:''}</div><div class="tl-tm">${fmtTime(e.t)}</div></div>`});
    if(open)body+='</div>'}
  const tc=trashed().length;
  return flashSection()+sec('Your activity',tc?`<button class="btn sm" data-act="smart" data-v="trash">${ic('trash')} Trash (${tc})</button>`:'')+`<div class="chips2">${chips}</div>`+body}

/* ---------- Community (Firestore) ---------- */
function comingHTML(){
  const items=COMING.length?COMING:['New features are on the way. Check back soon.'];
  return`<div class="card">${S.settings.email===ADMIN_EMAIL?`<div style="float:right"><button class="btn sm" data-act="editComing">${ic('edit')} Edit</button></div>`:''}<div class="cn-list" id="comingNew" style="margin:0">${''}</div></div>`.replace('<div class="cn-list" id="comingNew" style="margin:0"></div>',`<ul class="cn-list" id="comingNew">${items.map(t=>`<li>${ic('sparkle')}<span>${esc(t)}</span></li>`).join('')}</ul>`)}
function readDefaultComing(){const el=$('#adminComingNew');COMING=el?$$('li',el).map(l=>l.textContent.trim()).filter(Boolean):[]}
const STAR_SVG='<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';

function viewHTML(){
  if(U.q){
    const isContent=U.q.startsWith('/');
    const cleanQ=isContent?U.q.substring(1).trim():U.q;
    const tk=parseQ(cleanQ);
    const fo=isContent?[]:S.folders.filter(f=>tk.every(t=>f.name.toLowerCase().includes(t)||(f.notes||'').toLowerCase().includes(t)));
    const fi=isContent?live().filter(f=>(U.hits||[]).includes(f.id)):live().filter(f=>matchF(f,tk));
    return(fo.length?sec('Folders')+`<div class="fgrid" style="margin-bottom:40px">${fo.map(folderCard).join('')}</div>`:'')+
    sec(isContent?'Found inside files':'Files',`<span style="color:var(--mu);font-size:.88em">${fi.length} found</span>`+viewTools())+
    (U.sel.size?bulkBar():'')+
    (fi.length?filesBlock(fi):`<div class="empty">${EMPTY.files}<b>${isContent&&!cleanQ?'Type a word after /':`Nothing matches “${esc(U.q)}”`}</b><span>${isContent?'This searches inside your text files saved in this browser.':'Try a file name, a #tag, or filters like <kbd>type:pdf</kbd> and <kbd>tag:exams</kbd>.'}</span></div>`)}

  if(U.view==='folder'){const id=U.folder,fl=kids(id),fi=live().filter(f=>(f.folder||null)===(id||null));
    return sec('Folders')+(fl.length?`<div class="fgrid">${fl.map(folderCard).join('')}</div>`:`<div class="empty">${EMPTY.folders}<b>Organise your academic life</b><span>Create folders to organise lectures, assignments and personal documents.</span><button class="btn primary" data-act="newFolder">${ic('plus')} Create your first folder</button></div>`)+
    sec('Files',(U.sel.size?bulkBar():'')+viewTools())+filesBlock(fi)+(id?`<div class="notes"><h3>Notes for this folder</h3><textarea id="notes" placeholder="Write anything others should know about “${esc(FO(id).name)}”…">${esc(FO(id).notes||'')}</textarea></div>`:'')}
  if(U.view==='starred'){const fi=live().filter(f=>f.starred);return sec('Starred files',(U.sel.size?bulkBar():'')+viewTools())+filesBlock(fi,{art:EMPTY.star,heading:'No starred files yet',desc:'Click the star on any file to keep it here for quick access.',btn:false})}
  if(U.view==='recent'){const fi=[...live()].sort((a,b)=>b.added-a.added).slice(0,25);return sec('Recently added',(U.sel.size?bulkBar():'')+viewTools())+filesBlock(fi,{heading:'Nothing here yet',desc:'Upload a file and it will appear here right away.',btn:false,keepOrder:true})}
  if(U.view==='tag'){const fi=live().filter(f=>f.tags.includes(U.tag));return sec('Files tagged #'+esc(U.tag),(U.sel.size?bulkBar():'')+viewTools())+filesBlock(fi,{heading:'No files with this tag',desc:'Add the tag to any file from its ⋯ menu.',btn:false})}
  if(U.view==='trash'){const fi=trashed();return sec('Trash',(U.sel.size?bulkBar(1):'')+(fi.length?`<button class="btn sm danger" data-act="emptyTrash">${ic('trash')} Empty Trash</button>`:''))+`<p style="color:var(--mu);margin:-6px 0 16px;font-size:.88em">Items are removed for good after 30 days.</p>`+filesBlock(fi,{trash:1,art:EMPTY.trash,heading:'Trash is empty',desc:'Deleted files show up here. You can restore them for up to 30 days.',btn:false})}

  if(U.view==='home'){
    const lv=live(),rc=[...lv].sort((a,b)=>b.added-a.added).slice(0,3);
    const avg=CS.count?(CS.sum/CS.count):0,mine=S.settings.myRating||0;
    const unread=S.notifications.filter(n=>!n.read).length;
    return`
    <div class="hero">
      <h1>Welcome back, ${esc(S.settings.fullname)} 👋</h1>
      <p>Keep your lectures, assignments and notes in one place, and save the lines you want to remember as flashcards.</p>
      <div class="hero-actions">
        <button class="btn primary" data-act="upload">${ic('upload')} Upload files</button>
        <button class="btn" data-act="newFolder">${ic('plus')} Create folder</button>
        <button class="btn" data-act="startTour">${ic('play')} Take the tour</button>
      </div>
    </div>

    <div class="tiles">
      <div class="tile"><div class="v">${lv.length}</div><div class="l">Your files</div></div>
      <div class="tile"><div class="v">${S.folders.length}</div><div class="l">Folders</div></div>
      <div class="tile live"><div class="v" id="csUsers">${fmtN(CS.users)}</div><div class="l">People using the hub</div></div>
      <div class="tile"><div class="v" id="csVisits">${fmtN(CS.visits)}</div><div class="l">Total visits</div></div>
    </div>

    <div class="rate">
      <div><h3>Rate KNart Hub</h3><p id="rateTxt">${CS.count?`Average ${avg.toFixed(1)} out of 5 from ${fmtN(CS.count)} rating${CS.count>1?'s':''}.`:'Be the first to rate.'}${mine?` You gave ${mine} star${mine>1?'s':''}.`:' Tap a star to rate.'}</p></div>
      <div class="stars" role="group" aria-label="Rate from 1 to 5 stars">${[5,4,3,2,1].map(v=>`<button class="${v<=mine?'on':''}" data-act="rate" data-n="${v}" aria-label="${v} star${v>1?'s':''}">${STAR_SVG}</button>`).join('')}</div>
    </div>

    <div class="quick">
      <button class="qcard" data-act="nav" data-v="activity">${ic('quote',24)}<b>Flashcards &amp; activity</b><span>Save quotes and see what happened in your account.</span></button>
      <button class="qcard" data-act="nav" data-v="howto">${ic('help',24)}<b>Help Center</b><span>Read the steps or take the tour.</span></button>
      <button class="qcard" data-act="openNotifs">${ic('bell',24)}<b>Notifications</b><span>${unread?unread+' new update'+(unread>1?'s':''):'No new notifications'}</span></button>
    </div>

    ${sec('Recent files',`<button class="btn primary" data-act="upload">${ic('upload')} Upload</button>`)}
    ${filesBlock(rc,{heading:'Nothing uploaded yet',desc:'Upload a file to see it here.',btn:false,keepOrder:true})}

    <div style="height:28px"></div>
    ${sec("What's coming new")}
    ${comingHTML()}

    <div style="height:20px"></div>
    ${sec('About the developer')}
    <div class="dev">
      <div class="dev-av">N</div>
      <div>
        <h3>Nsikan</h3>
        <div class="role">Developer · Karnat Cinematic Studio</div>
        <p>I built KNart School Management Hub to help students keep their files tidy and their revision close. A Library and Information Science student at FUTIA, I also make animated stories on YouTube at @KarnatCinematic. Your feedback shapes what comes next.</p>
        <div class="row"><a href="mailto:nsikanalbert247@gmail.com" class="btn sm">${ic('mail')} Email the developer</a><button class="btn sm" data-act="reportBug">${ic('bug')} Report a bug</button></div>
      </div>
    </div>

    <footer class="foot">
      <div><b>KNart School Management Hub</b> · Version ${VER}<br>© ${new Date().getFullYear()} KNart. All rights reserved.</div>
      <nav><button data-act="nav" data-v="howto">Help</button><button data-act="nav" data-v="activity">Activity</button><button data-act="startTour">Tour</button><button data-act="whatsNew">What’s new</button></nav>
    </footer>`}
  if(U.view==='howto'){return sec('How to use KNart School Management Hub',`<button class="btn primary" data-act="startTour">${ic('play')} Start guided tour</button>`)+`<p class="lead">New here? Follow these steps. Each card has a button so you can try it straight away.</p><div class="hgrid">${HOW.map(([i,t,d,a,b,v])=>`<div class="hcard"><div class="hic">${ic(i,20)}</div><div><h3>${t}</h3><p>${d}</p>${a?`<button class="btn sm" data-act="${a}" ${v?`data-v="${v}"`:''}>${b||'Try it'}</button>`:''}</div></div>`).join('')}</div>`}

  if(U.view==='activity')return activityHTML();

  if(U.view==='stats'){const lv=live(),by={};lv.forEach(f=>{const k=kindOf(f);(by[k]=by[k]||{n:0,s:0});by[k].n++;by[k].s+=f.size});const mx=Math.max(1,...Object.values(by).map(x=>x.s)),big=[...lv].sort((a,b)=>b.size-a.size).slice(0,5);
    return`<h2 style="margin-bottom:22px">Insights</h2><div class="tiles"><div class="tile"><div class="v">${lv.length}</div><div class="l">Files</div></div><div class="tile"><div class="v">${fmtSize(lv.reduce((a,f)=>a+f.size,0))}</div><div class="l">Used by your files</div></div><div class="tile"><div class="v" id="quota">—</div><div class="l">Browser space available</div></div></div>`+sec('By file type')+(Object.keys(by).length?`<div class="bars">${Object.entries(by).sort((a,b)=>b[1].s-a[1].s).map(([k,v])=>`<div class="bar"><span>${KT[k][0]}</span><i><b style="width:${Math.max(3,v.s/mx*100)}%;background:linear-gradient(90deg,${KT[k][1]},${shade(KT[k][1],.3)})"></b></i><small>${v.n} · ${fmtSize(v.s)}</small></div>`).join('')}</div>`:'<div class="empty"><b>No data yet</b></div>')+
    sec('Largest files')+filesBlock(big,{heading:'No files yet',desc:'Upload files to see your largest documents here.',btn:false,keepOrder:true})+'<div style="height:36px"></div>'+sec('Duplicates',`<button class="btn" data-act="dupes">${ic('copy')} Find duplicates</button>`)+`<p style="color:var(--mu);font-size:.88em">Finds files with the same name and size so you can clear out extra copies.</p>`}
  return''}

function render(keep){const w=$('#wsc'),top=keep?w.scrollTop:0;head();w.innerHTML=viewHTML();w.scrollTop=top;
  $$('img[data-thumb]',w).forEach(async im=>{const u=await urlFor(im.dataset.thumb);if(u)im.src=u});
  if(U.view==='stats'&&!U.q&&navigator.storage?.estimate)navigator.storage.estimate().then(e=>{const q=$('#quota');if(q&&e.quota)q.textContent=fmtSize(Math.max(0,e.quota-e.usage))}).catch(()=>{})}
function renderAll(keep){renderRail();renderSide();render(keep)}
function go(view,o={}){U.view=view;if('folder'in o){U.folder=o.folder;S.last=o.folder;save()}if('tag'in o)U.tag=o.tag;U.sel.clear();if(U.q&&!o.keepQ){U.q='';$('#q').value='';$('#qclr').classList.add('hide')}if(innerWidth<=900)$('#shell').classList.remove('side-open');renderAll();$('#wsc').scrollTop=0}
const openF=id=>go('folder',{folder:id||null});
const cur=()=>U.view==='folder'?(U.folder||null):null;
function uniqueName(n,folder,skip){const names=new Set(S.files.filter(f=>!f.trashed&&(f.folder||null)===(folder||null)&&f.id!==skip).map(f=>f.name.toLowerCase()));if(!names.has(n.toLowerCase()))return n;const e=ext(n),b=e?n.slice(0,-(e.length+1)):n;let i=2,c;do{c=`${b} (${i++})${e?'.'+e:''}`}while(names.has(c.toLowerCase()));return c}

/* ---------- Upload (saved in the browser: no network wait) ---------- */
async function addFile(file,folder,relName){
  const id=uid('f_');
  const ok=await putBlob(id,file);
  if(!ok)return null;
  const t=Date.now(),type=file.type||MIMES[ext(file.name)]||'',name=uniqueName(relName||file.name,folder);
  S.files.push({id,name,folder:folder||null,size:file.size,type,added:t,mod:file.lastModified||t,by:S.settings.user,starred:false,tags:[],trashed:false});
  return name}
async function runUploads(items){
  const total=items.length;if(!total)return;
  isUploading=true;updateBadges();
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  let i=0,done=0;const added=[];
  upbar(`Saving 0 of ${total}…`,3);
  const worker=async()=>{while(i<items.length){const it=items[i++];let n=null;try{n=await addFile(it.file,it.folder,it.rel)}catch(e){n=null}if(n)added.push(n);done++;upbar(`Saving ${done} of ${total}…`,done/total*100)}};
  await Promise.all(Array.from({length:Math.min(6,total)},worker));
  isUploading=false;updateBadges();
  if(added.length){const nm=added.length>3?added.slice(0,3).join(', ')+` +${added.length-3} more`:added.join(', ');log(`Uploaded ${added.length} file${added.length>1?'s':''}: ${nm}`,'upload');notif(`Uploaded ${added.length} file${added.length>1?'s':''}`)}
  save();renderAll(1);upHide();
  toast(added.length===total?`Saved ${added.length} file${added.length>1?'s':''}`:`Saved ${added.length} of ${total}. Browser space may be full.`)}
function uploadFiles(list,folder){runUploads([...list].map(f=>({file:f,folder:folder||null})))}
function uploadTree(list){list=[...list];if(!list.length)return;const base=cur(),cache={},items=[];
  for(const f of list){const parts=(f.webkitRelativePath||f.name).split('/');parts.pop();let p=base,key='';
    for(const nm of parts){key+='/'+nm;if(!cache[key]){let ex=S.folders.find(x=>x.parent===(p||null)&&x.name===nm);if(!ex){ex={id:uid('d_'),name:nm,parent:p||null,color:'gray',notes:'',created:Date.now()};S.folders.push(ex)}cache[key]=ex.id}p=cache[key]}
    items.push({file:f,folder:p||null})}
  if(base&&!S.expanded.includes(base))S.expanded.push(base);
  log(`Uploaded a folder (${list.length} files)`,'folder');runUploads(items)}

async function newFolder(parent){const n=await askText('New folder','','Folder name, for example Year 5 Reports','Create');if(!n)return;const f={id:uid('d_'),name:n,parent:parent||null,color:'gray',notes:'',created:Date.now()};S.folders.push(f);if(parent&&!S.expanded.includes(parent))S.expanded.push(parent);log(`Created folder “${n}”`,'folder');save();renderAll(1);toast(`Created “${n}”`)}
async function renameFolder(id){const f=FO(id),n=await askText('Rename folder',f.name,'','Rename');if(!n)return;log(`Renamed folder “${f.name}” to “${n}”`,'folder');f.name=n;save();renderAll(1)}
async function renameFile(id){const f=FI(id),n=await askText('Rename file',f.name,'','Rename');if(!n||n===f.name)return;const old=f.name;f.name=uniqueName(n,f.folder,id);f.mod=Date.now();log(`Renamed “${old}” to “${f.name}”`);save();renderAll(1)}
async function colorFolder(id){const f=FO(id);const c=await dialog(`<h3>Folder colour</h3><div class="sw">${Object.entries(PAL).map(([k,v])=>`<button data-c="${k}" class="${f.color===k?'on':''}" style="background:${v}" aria-label="${k}"></button>`).join('')}</div><div class="m-act"><button class="btn" data-x="c">Cancel</button></div>`,(m,done)=>{m.onclick=e=>{const b=e.target.closest('[data-c]');if(b)return done(b.dataset.c);if(e.target.closest('[data-x]'))done(null)}});if(c){f.color=c;save();renderAll(1)}}
async function moveFiles(ids){const f0=FI(ids[0]);const t=await pickFolder(`Move ${ids.length>1?ids.length+' files':'“'+f0.name+'”'} to…`,[],f0.folder||'');if(t===null)return;const sn=snap();ids.forEach(i=>{const f=FI(i);f.folder=t||null;f.name=uniqueName(f.name,t,f.id)});U.sel.clear();log(`Moved ${namesOf(ids)} to ${t?FO(t).name:'School Files'}`);save();renderAll(1);toast(`Moved to ${t?FO(t).name:'School Files'}`,sn)}
async function moveFolder(id){const ex=[id,...desc(id)];const t=await pickFolder(`Move “${FO(id).name}” to…`,ex,FO(id).parent||'');if(t===null)return;const sn=snap();FO(id).parent=t||null;if(t&&!S.expanded.includes(t))S.expanded.push(t);save();renderAll(1);toast('Folder moved',sn)}
function dropMove(ids,t){const sn=snap();let n=0;ids.forEach(i=>{const f=FI(i);if(f&&(f.folder||null)!==(t||null)){f.folder=t||null;f.name=uniqueName(f.name,t,f.id);n++}});if(!n)return;U.sel.clear();save();renderAll(1);toast(`Moved ${n} file${n>1?'s':''} to ${t?FO(t).name:'School Files'}`,sn)}
function trashFiles(ids){const nm=namesOf(ids),sn=snap();ids.forEach(i=>{const f=FI(i);if(f){f.trashed=true;f.tAt=Date.now();f.starred=false}});U.sel.clear();log(`Deleted ${nm} (moved to Trash)`,'delete');save();renderAll(1);toast(`${ids.length} file${ids.length>1?'s':''} moved to Trash`,sn)}
function restoreFiles(ids){const nm=namesOf(ids);ids.forEach(i=>{const f=FI(i);if(f){f.trashed=false;delete f.tAt;if(f.folder&&!FO(f.folder))f.folder=null;f.name=uniqueName(f.name,f.folder,f.id)}});U.sel.clear();log(`Restored ${nm}`,'restore');save();renderAll(1);toast(`Restored ${ids.length} file${ids.length>1?'s':''}`)}
async function purge(ids){if(!ids.length)return;if(!await askConfirm('Delete forever?',`${ids.length} file${ids.length>1?'s':''} will be permanently removed. This can’t be undone.`,'Delete forever',true))return;const nm=namesOf(ids);for(const i of ids)await delBlob(i);S.files=S.files.filter(f=>!ids.includes(f.id));U.sel.clear();log(`Permanently deleted ${nm}`,'delete');save();renderAll(1);toast('Deleted forever')}
async function deleteFolder(id){const f=FO(id),ids=[id,...desc(id)],nf=live().filter(x=>ids.includes(x.folder)).length;if(!await askConfirm(`Delete “${f.name}”?`,`This removes the folder${ids.length>1?` and ${ids.length-1} sub-folder${ids.length>2?'s':''}`:''}. ${nf} file${nf!==1?'s':''} will move to Trash.`,'Delete folder',true))return;const sn=snap();const par=f.parent;
  S.files.forEach(x=>{if(ids.includes(x.folder)){if(!x.trashed){x.trashed=true;x.tAt=Date.now()}x.folder=null}});S.folders=S.folders.filter(x=>!ids.includes(x.id));if(ids.includes(U.folder)){U.folder=par||null;S.last=U.folder}log(`Deleted folder “${f.name}” (${nf} file${nf!==1?'s':''} moved to Trash)`,'delete');save();renderAll(1);toast(`Deleted “${f.name}”`,sn)}
function toggleStar(ids){const all=ids.every(i=>FI(i).starred);ids.forEach(i=>FI(i).starred=!all);save();renderAll(1)}
async function tagFiles(ids){const one=ids.length===1,f0=FI(ids[0]);const all=[...new Set(live().flatMap(f=>f.tags))];
  const v=await dialog(`<h3>${one?'Tags':'Add tags'}</h3><p>Separate tags with commas. Example: exams, term 2</p><input class="field" value="${esc(one?f0.tags.join(', '):'')}" placeholder="exams, term 2, reports">${all.length?`<div class="chips">${all.slice(0,12).map(t=>`<span class="pill" data-t="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}<div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">Save tags</button></div>`,(m,done)=>{const i=$('input',m);m.onclick=e=>{const p=e.target.closest('[data-t]');if(p){const c=i.value.split(',').map(s=>s.trim()).filter(Boolean);if(!c.includes(p.dataset.t))c.push(p.dataset.t);i.value=c.join(', ');return}const x=e.target.closest('[data-x]');if(x)done(x.dataset.x==='o'?i.value:null)};i.onkeydown=e=>{if(e.key==='Enter')done(i.value)}});
  if(v===null)return;const tags=[...new Set(v.split(',').map(s=>s.trim().replace(/^#/,'').toLowerCase()).filter(Boolean))];ids.forEach(i=>{const f=FI(i);f.tags=one?tags:[...new Set([...f.tags,...tags])]});save();renderAll(1);toast('Tags saved')}
async function dupFile(id){const f=FI(id),b=await getBlob(id);if(!b)return toast('Could not read this file');const nid=uid('f_');await putBlob(nid,b);const c={...f,id:nid,name:uniqueName(f.name,f.folder),added:Date.now(),mod:Date.now(),starred:false,tags:[...f.tags]};S.files.push(c);save();renderAll(1);toast('Duplicated')}
async function download(ids){for(const id of ids){const f=FI(id);if(!f)continue;const u=await urlFor(id);if(!u){toast(`“${f.name}” has no stored data`);continue}const a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();await new Promise(r=>setTimeout(r,250))}}

/* ---------- Panels ---------- */
function openNotifPanel(){
  const p=$('#notifPanel');closeProfilePanel();
  if(p.classList.contains('show')){p.classList.remove('show');return}
  const listHtml=S.notifications.length?S.notifications.map((n,i)=>`<div class="np-item ${n.read?'':'unread'}"><div class="np-dot"></div><div class="np-txt">${esc(n.m)}<span class="np-time">${fmtDate(n.t)}</span></div><button class="np-del" data-act="delNotif" data-i="${i}" aria-label="Remove">${ic('x',14)}</button></div>`).join(''):'<div style="text-align:center;padding:30px;color:var(--mu);font-size:.9em;">No notifications yet.</div>';
  p.innerHTML=`<div class="np-head"><h3>Notifications</h3><button class="ab" data-act="closeNotifs" aria-label="Close">${ic('x',18)}</button></div><div class="np-body">${listHtml}</div><div class="np-foot"><button data-act="markRead">Mark all read</button><button data-act="clearNotifs">Clear all</button></div>`;
  p.classList.add('show');
  setTimeout(()=>{S.notifications.forEach(n=>n.read=true);save();updateBadges()},1000)}
function closeNotifPanel(){$('#notifPanel').classList.remove('show')}
function openProfilePanel(){
  const p=$('#profilePanel');closeNotifPanel();
  if(p.classList.contains('show')){p.classList.remove('show');return}
  const initials=(S.settings.fullname||'U').substring(0,2).toUpperCase(),lv=live();
  p.innerHTML=`<div class="pp-head"><div class="pp-av">${esc(initials)}</div><div class="pp-name">${esc(S.settings.fullname)}</div><div class="pp-user">@${esc(S.settings.username)}</div><div class="pp-badge">Free Plan</div></div>
  <div class="pp-body"><div class="pp-stat"><span>Email</span><b>${esc(S.settings.email)}</b></div><div class="pp-stat"><span>Total files</span><b>${lv.length}</b></div><div class="pp-stat"><span>Flashcards</span><b>${S.flash.length}</b></div></div>
  <div class="pp-foot"><button class="btn danger" data-act="logout" style="width:100%;justify-content:center;">${ic('logout',16)} Log out</button></div>`;
  p.classList.add('show')}
function closeProfilePanel(){$('#profilePanel').classList.remove('show')}

function fileMenu(id,x,y){const f=FI(id);if(f.trashed)return menu(x,y,[{t:'Restore',i:'restore',fn:()=>restoreFiles([id])},'-',{t:'Delete forever',i:'trash',danger:1,fn:()=>purge([id])}]);
  menu(x,y,[
   {t:'Preview',i:'eye',fn:()=>openViewer(id)},
   {t:'Download',i:'download',fn:()=>download([id])},
   '-',
   {t:'Rename',i:'edit',fn:()=>renameFile(id)},
   {t:'Move to…',i:'move',fn:()=>moveFiles([id])},
   {t:'Add tags',i:'tag',fn:()=>tagFiles([id])},
   {t:f.starred?'Remove star':'Star',i:'star',fn:()=>toggleStar([id])},
   {t:'Duplicate',i:'copy',fn:()=>dupFile(id)},
   '-',
   {t:'Move to Trash',i:'trash',danger:1,fn:()=>trashFiles([id])}
  ])}
function folderMenu(id,x,y){menu(x,y,[
   {t:'Open',i:'folderOpen',fn:()=>openF(id)},
   {t:'New sub-folder',i:'plus',fn:()=>newFolder(id)},
   {t:'Upload here',i:'upload',fn:()=>{upTarget=id;$('#fin').click()}},
   '-',
   {t:'Rename',i:'edit',fn:()=>renameFolder(id)},
   {t:'Change colour',i:'palette',fn:()=>colorFolder(id)},
   {t:'Move to…',i:'move',fn:()=>moveFolder(id)},
   '-',
   {t:'Delete folder',i:'trash',danger:1,fn:()=>deleteFolder(id)}
  ])}

function visibleIds(){if(U.q){if(U.q.startsWith('/'))return sortFiles(live().filter(f=>(U.hits||[]).includes(f.id))).map(f=>f.id);const tk=parseQ(U.q);return sortFiles(live().filter(f=>matchF(f,tk))).map(f=>f.id)}
  const v=U.view;let a=v==='folder'?live().filter(f=>(f.folder||null)===(U.folder||null)):v==='starred'?live().filter(f=>f.starred):v==='trash'?trashed():v==='tag'?live().filter(f=>f.tags.includes(U.tag)):v==='recent'?[...live()].sort((a,b)=>b.added-a.added).slice(0,25):v==='home'?[...live()].sort((a,b)=>b.added-a.added).slice(0,3):v==='stats'?[...live()].sort((a,b)=>b.size-a.size).slice(0,5):[];
  return(v==='recent'||v==='home'||v==='stats'?a:sortFiles(a)).map(f=>f.id)}
function openViewer(id){const f=FI(id);if(f&&f.isTour){startTour();return}const l=visibleIds();V={l:l.includes(id)?l:[id],i:0,tok:0};V.i=V.l.indexOf(id);showViewer()}
async function showViewer(){const f=FI(V.l[V.i]);if(!f)return closeViewer();const v=$('#viewer'),tok=++V.tok;v.classList.add('show');
  v.innerHTML=`<div class="vh"><div class="t"><b>${esc(f.name)}</b><small>${fmtSize(f.size)} · ${V.i+1} of ${V.l.length}</small></div><div style="display:flex;gap:4px"><button class="ab ${f.starred?'starred':''}" data-act="vStar" aria-label="Star">${ic('star')}</button><button class="ab" data-act="vDl" aria-label="Download">${ic('download')}</button><button class="ab" data-act="vClose" aria-label="Close">${ic('x')}</button></div></div><div class="vb" id="vb"><span style="opacity:.6">Loading…</span></div>`;
  const vb=$('#vb');if(V.l.length>1)vb.insertAdjacentHTML('beforeend',`<button class="vnav l" data-act="vPrev" aria-label="Previous">${ic('left')}</button><button class="vnav r" data-act="vNext" aria-label="Next">${ic('right')}</button>`);
  const k=kindOf(f),u=await urlFor(f.id);if(!V||tok!==V.tok)return;let body='';
  if(!u)body=`<div class="none"><p>This file’s data isn’t stored in this browser.</p></div>`;
  else if(k==='img')body=`<img src="${u}" alt="${esc(f.name)}">`;else if(k==='pdf')body=`<iframe src="${u}" title="${esc(f.name)}"></iframe>`;else if(k==='vid')body=`<video src="${u}" controls autoplay></video>`;else if(k==='aud')body=`<audio src="${u}" controls autoplay></audio>`;
  else if(isText(f)){const b=await getBlob(f.id);const t=b?await b.slice(0,300000).text():'';if(!V||tok!==V.tok)return;body=`<pre>${esc(t)}${b&&b.size>300000?'\n\n… preview truncated':''}</pre>`}
  else body=`<div class="none"><div class="fi k" style="background:${KT[k][1]};width:84px;height:84px;font-size:18px;border-radius:20px">${KT[k][0]}</div><b>No preview for this file type</b><button class="btn primary" data-act="vDl">${ic('download')} Download</button></div>`;
  vb.insertAdjacentHTML('afterbegin',body);const ld=vb.querySelector('span');ld&&ld.remove()}
function closeViewer(){V=null;const v=$('#viewer');v.classList.remove('show');v.innerHTML=''}
const vStep=d=>{if(!V)return;V.i=(V.i+d+V.l.length)%V.l.length;showViewer()};

/* ---------- Content search ---------- */
async function contentSearch(q){const tok=++csTok;const out=[];if(q){for(const f of live().filter(isText)){const b=await getBlob(f.id);if(!b)continue;let t='';try{t=(await b.slice(0,500000).text()).toLowerCase()}catch(e){}if(t.includes(q))out.push(f.id)}}if(tok!==csTok)return;U.hits=out;if(U.q&&U.q.startsWith('/'))render(1)}

/* ---------- PIN ---------- */
async function hashPin(p){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('lh:'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const c of 'lh:'+p)h=((h<<5)+h+c.charCodeAt(0))|0;return'x'+h}}
$('#pad').innerHTML=[1,2,3,4,5,6,7,8,9].map(n=>`<button data-p="${n}">${n}</button>`).join('')+`<button data-p="del" style="font-size:1rem">Delete</button><button data-p="0">0</button><span></span>`;
const dots=()=>$$('#pinDots i').forEach((d,i)=>d.classList.toggle('f',i<pinBuf.length));
async function pinKey(k){if(k==='del')pinBuf=pinBuf.slice(0,-1);else if(pinBuf.length<5)pinBuf+=k;dots();if(pinBuf.length===5){const ok=await hashPin(pinBuf)===S.settings.pinHash;pinBuf='';if(ok){$('#pin').classList.remove('show');dots();armLock();maybeWelcome()}else{const d=$('#pinDots');d.classList.add('shake');setTimeout(()=>{d.classList.remove('shake');dots()},400)}}}
$('#pad').onclick=e=>{const b=e.target.closest('[data-p]');if(b)pinKey(b.dataset.p)};
function lock(){if(!S||!S.settings.pinHash)return;if(T)endTour(true);closeViewer();$('#drawer').classList.remove('open');pinBuf='';dots();$('#pin').classList.add('show')}
function armLock(){clearTimeout(lockT);if(!S)return;const m=S.settings.autolock;if(S.settings.pinHash&&m>0&&!$('#pin').classList.contains('show'))lockT=setTimeout(lock,m*60000)}
['pointerdown','keydown','scroll'].forEach(ev=>addEventListener(ev,armLock,{passive:true,capture:true}));
const askPin=(title,desc)=>dialog(`<h3>${esc(title)}</h3><p>${esc(desc)}</p><input class="field" type="password" inputmode="numeric" maxlength="5" placeholder="5 digits" autocomplete="off"><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">Continue</button></div>`,(m,done)=>{const i=$('input',m);i.oninput=()=>i.value=i.value.replace(/\D/g,'');const go=()=>{if(i.value.length!==5){i.focus();return}done(i.value)};m.onclick=e=>{const x=e.target.closest('[data-x]');if(x)x.dataset.x==='o'?go():done(null)};i.onkeydown=e=>{if(e.key==='Enter')go()}});
async function setPinFlow(){if(S.settings.pinHash){const o=await askPin('Current PIN','Enter your current PIN to continue.');if(o===null||await hashPin(o)!==S.settings.pinHash){if(o!==null)toast('Wrong PIN');return false}}
  const a=await askPin('New PIN','Choose a 5-digit PIN.');if(a===null)return false;const b=await askPin('Confirm PIN','Enter the same PIN again.');if(b===null)return false;if(a!==b){toast('PINs didn’t match. Nothing changed.');return false}S.settings.pinHash=await hashPin(a);log('PIN lock turned on','security');save();armLock();toast('PIN saved');return true}
async function removePin(){const o=await askPin('Turn off PIN','Enter your current PIN.');if(o===null)return false;if(await hashPin(o)!==S.settings.pinHash){toast('Wrong PIN');return false}S.settings.pinHash=null;log('PIN lock turned off','security');save();toast('PIN lock off');return true}

/* ---------- Guided tour ---------- */
const rootStep=()=>{if(U.view!=='folder'||U.q||U.folder)go('folder',{folder:null})};
const TOUR=[
 {t:'Welcome to KNart School Management Hub v4',d:'This short tour shows you where everything is. Press Next to continue, or Skip tour to go straight to the hub.'},
 {s:'#q',t:'Search',d:'Type a file name, folder or #tag here. Tip: start with / to search inside text files.'},
 {s:'#backBtn',t:'Back',d:'Takes you up one level, from a folder to the folder that holds it. It is greyed out when you are already at the top.'},
 {s:'.rbtn[data-v=home]',t:'Home',d:'Your overview: your recent files, how many people use the hub, a star rating, what is coming next and who built it.'},
 {s:'.rbtn[data-v=folder]',t:'Files',d:'All your folders and files live here. Click it any time to come back to your folders.'},
 {s:'#tree',side:1,t:'Folder list',d:'Every folder is listed here. Click one to open it. Click the small arrow to show the folders inside. The number is how many files it holds.'},
 {s:'#wh',root:1,t:'Workspace header',d:'This area shows where you are. Use the buttons on the right to create a new folder or upload files directly here.'},
 {s:()=>$('#wsc .fgrid')||$('#wsc .empty'),root:1,t:'Your folders',d:'Click a folder to open it. Use the Options button (or right-click) to rename, colour, move or delete it.'},
 {s:()=>{const s=$$('#wsc .sec')[1];return s&&s.nextElementSibling},root:1,t:'Your files',d:'Click a file to preview it. Click a column title to sort.'},
 {s:'.rbtn[data-v=activity]',t:'Activity',d:'Save flashcards of things people said in class, and see your uploads, deleted files and sign-ins.'},
 {s:'.rbtn[data-v=stats]',t:'Insights',d:'See how much space your files use, which file types you have, and find duplicate files.'},
 {s:'#topProfileBtn',t:'Your profile',d:'Click your avatar to see your account details and log out.'},
 {t:'You’re ready',d:'That is everything you need to get started. Create a folder, upload your first files, and open Help whenever you need it.'}];
function startTour(){if(T)return;$('#drawer').classList.remove('open');closeMenu();closeViewer();closeNotifPanel();closeProfilePanel();T={i:0,prev:{view:U.view,folder:U.folder}};
  const r=$('#tourRoot');r.innerHTML='<div class="tour-block" id="tourBlock"></div><div class="tour-hl none" id="tourHl"></div><div class="tour-card" id="tourCard" role="dialog" aria-live="polite"></div>';
  r.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;const a=b.dataset.t;if(a==='next')stepTour(1);else if(a==='back')stepTour(-1);else endTour()};showStep()}
function stepTour(d){if(!T)return;const n=T.i+d;if(n>=TOUR.length)return endTour();if(n<0)return;T.i=n;showStep()}
function endTour(silent){if(!T)return;const p=T.prev;T=null;$('#tourRoot').innerHTML='';$('#shell').classList.remove('side-open');S.settings.tourDone=true;save();
  if(!silent){go(p.view,p.view==='folder'?{folder:p.folder}:{});toast('Tour finished. Find it any time under Help.')}}
function showStep(){const st=TOUR[T.i],sh=$('#shell');closeMenu();
  if(st.root)rootStep();
  if(st.side){sh.classList.remove('collapsed');if(innerWidth<=900)sh.classList.add('side-open');if(U.tab!=='folders'||U.sq){U.tab='folders';U.sq='';$('#sq').value='';renderSide()}}else sh.classList.remove('side-open');
  const last=T.i===TOUR.length-1,first=T.i===0;
  $('#tourCard').innerHTML=`<div class="tour-step">Step ${T.i+1} of ${TOUR.length}</div><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p><div class="tour-prog"><b style="width:${(T.i+1)/TOUR.length*100}%"></b></div><div class="tour-act">${last?'':'<button class="tour-skip" data-t="skip">Skip tour</button>'}<span class="sp"></span>${first?'':'<button class="btn" data-t="back">Back</button>'}<button class="btn primary" data-t="next">${last?'Finish':first?'Start':'Next'}</button></div>`;
  const i=T.i;setTimeout(()=>{if(!T||T.i!==i)return;const el=tourEl(st);el&&el.scrollIntoView({block:'nearest',inline:'nearest'});placeTour()},60);setTimeout(()=>{if(T&&T.i===i)placeTour()},460)}
function tourEl(st){if(!st.s)return null;try{return typeof st.s==='function'?st.s():$(st.s)}catch(e){return null}}
function placeTour(){if(!T)return;const st=TOUR[T.i],el=tourEl(st),hl=$('#tourHl'),card=$('#tourCard');if(!hl||!card)return;let r=el&&el.getBoundingClientRect();if(r&&(!r.width||!r.height))r=null;
  const vw=innerWidth,vh=innerHeight;
  if(r){const p=6;hl.className='tour-hl';Object.assign(hl.style,{left:r.left-p+'px',top:r.top-p+'px',width:r.width+p*2+'px',height:r.height+p*2+'px'})}
  else{hl.className='tour-hl none';Object.assign(hl.style,{left:vw/2+'px',top:vh/2+'px',width:'0px',height:'0px'})}
  const w=Math.min(360,vw-24);card.style.width=w+'px';const h=card.offsetHeight;let x,y;
  if(!r){x=(vw-w)/2;y=(vh-h)/2}
  else{const g=16;x=Math.max(12,Math.min(r.left+r.width/2-w/2,vw-w-12));
   if(r.bottom+g+h<=vh-12)y=r.bottom+g;else if(r.top-g-h>=12)y=r.top-g-h;
   else{y=Math.max(12,Math.min(r.top+r.height/2-h/2,vh-h-12));x=(r.right+g+w<=vw-12)?r.right+g:Math.max(12,r.left-g-w);if(r.width>vw*.6){x=(vw-w)/2;y=vh-h-16}}}
  card.style.left=x+'px';card.style.top=y+'px'}
addEventListener('resize',()=>{if(T)placeTour()});
async function welcome(){if(welcoming||T)return;welcoming=true;const r=await dialog(`<h3>Welcome to KNart School Management Hub</h3><p>New here? Take a one-minute guided tour. It shows you where things are and how to add folders and files. You can skip it now and open it later from <b>Help</b>.</p><div class="m-act"><button class="btn" data-x="s">Skip for now</button><button class="btn primary" data-x="t">Start the tour</button></div>`,(m,done)=>{m.onclick=e=>{const x=e.target.closest('[data-x]');if(x)done(x.dataset.x)}});welcoming=false;
  if(r==='t')startTour();else{S.settings.tourDone=true;save()}}
function maybeWelcome(){if(!S.settings.tourDone&&!$('#pin').classList.contains('show'))setTimeout(welcome,450)}

/* ---------- Settings ---------- */
function drawer(){const s=S.settings;
  $('#drawer').innerHTML=`<div class="dh"><h3>Settings</h3><button class="ab" data-act="closeSettings" aria-label="Close settings">${ic('x')}</button></div>
  <div class="dsec"><h4>Help</h4><div class="set"><span>Guided tour</span><button class="btn sm" data-act="startTour">Start</button></div><div class="set"><span>How to use</span><button class="btn sm" data-act="openHow">Open</button></div></div>
  <div class="dsec"><h4>Appearance</h4><div class="set"><label for="s-dark">Dark mode</label><span class="tg"><input id="s-dark" type="checkbox" data-set="dark" ${s.dark?'checked':''}><i></i></span></div>
  <div class="set"><label for="s-font">Text size</label><select id="s-font" data-set="font"><option value="13" ${s.font==13?'selected':''}>Small</option><option value="15" ${s.font==15?'selected':''}>Medium</option><option value="17" ${s.font==17?'selected':''}>Large</option></select></div>
  <div class="set"><label for="s-mode">File view</label><select id="s-mode" data-set="mode"><option value="list" ${s.mode==='list'?'selected':''}>List</option><option value="grid" ${s.mode==='grid'?'selected':''}>Grid</option></select></div></div>
  <div class="dsec"><h4>Profile</h4><div class="set"><label for="s-user">Added-by name</label><input id="s-user" type="text" data-set="user" value="${esc(s.user)}" maxlength="40"></div></div>
  <div class="dsec"><h4>Security</h4><div class="set"><span>Account password</span><button class="btn sm" data-act="changePw">Change</button></div><div class="set"><label for="s-pin">PIN lock</label><span class="tg"><input id="s-pin" type="checkbox" data-set="pin" ${s.pinHash?'checked':''}><i></i></span></div>
  ${s.pinHash?`<div class="set"><span>Change PIN</span><button class="btn sm" data-act="chgPin">Change</button></div><div class="set"><label for="s-al">Auto-lock</label><select id="s-al" data-set="autolock">${[[0,'Never'],[1,'1 min'],[5,'5 min'],[15,'15 min']].map(([v,l])=>`<option value="${v}" ${s.autolock==v?'selected':''}>${l}</option>`).join('')}</select></div><div class="set"><span>Lock now</span><button class="btn sm" data-act="lockNow">Lock</button></div>`:''}</div>
  <div class="dsec"><h4>Data</h4><div class="set"><span>Export backup</span><button class="btn sm" data-act="exportBackup">Export</button></div><div class="set"><span>Import backup</span><button class="btn sm" data-act="importBackup">Import</button></div><div class="set"><span style="color:var(--danger)">Erase everything</span><button class="btn sm danger" data-act="resetAll">Erase</button></div></div>
  <div class="dsec"><h4>Keyboard shortcuts</h4><div class="set"><span>Search</span><kbd>/</kbd></div><div class="set"><span>New folder</span><kbd>N</kbd></div><div class="set"><span>Upload files</span><kbd>U</kbd></div><div class="set"><span>Select all</span><kbd>Ctrl/⌘ A</kbd></div><div class="set"><span>Move to Trash</span><kbd>Delete</kbd></div><div class="set"><span>Close / clear</span><kbd>Esc</kbd></div></div>
  <div class="dsec"><button class="btn" data-act="whatsNew" style="width:100%;justify-content:center">What’s new in version ${VER}</button><p style="color:var(--mu);font-size:.8em;text-align:center;margin-top:10px">KNart School Management Hub · Version ${VER}</p></div>`}
function applyTheme(){document.body.classList.toggle('dark',!!S.settings.dark);document.documentElement.style.setProperty('--fs',S.settings.font+'px')}

/* ---------- Backup ---------- */
const toDataURL=b=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(b)});
async function exportBackup(){toast('Preparing backup…');const files=[];for(const f of S.files){const b=await getBlob(f.id);files.push({id:f.id,data:b?await toDataURL(b):null})}
  const out=JSON.stringify({liquidhub:3,at:Date.now(),folders:S.folders,files:S.files,flash:S.flash,blobs:files});const b=new Blob([out],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`knart-hub-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);log('Exported a backup');save();toast('Backup downloaded')}
async function importBackup(file){let o;try{o=JSON.parse(await file.text());if(!o.files||!o.folders)throw 0}catch(e){return toast('That isn’t a KNart Hub backup file')}
  const mode=await dialog(`<h3>Import backup</h3><p>${o.files.length} files and ${o.folders.length} folders found. Merge adds them to what you have. Replace swaps everything.</p><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn" data-x="m">Merge</button><button class="btn primary" data-x="r">Replace all</button></div>`,(m,done)=>{m.onclick=e=>{const x=e.target.closest('[data-x]');if(x)done(x.dataset.x==='c'?null:x.dataset.x)}});if(!mode)return;
  toast('Importing…');if(mode==='r'){for(const f of S.files)await delBlob(f.id);S.files=[];S.folders=[]}
  const hf=new Set(S.folders.map(f=>f.id)),hi=new Set(S.files.map(f=>f.id));o.folders.forEach(f=>{if(!hf.has(f.id))S.folders.push(f)});
  if(Array.isArray(o.flash)){const hc=new Set(S.flash.map(c=>c.id));o.flash.forEach(c=>{if(!hc.has(c.id))S.flash.push(c)})}
  for(const f of o.files){if(hi.has(f.id))continue;const bl=(o.blobs||[]).find(b=>b.id===f.id);if(bl&&bl.data){const b=await(await fetch(bl.data)).blob();await putBlob(f.id,b)}S.files.push(f)}
  if(U.folder&&!FO(U.folder))U.folder=null;log('Imported a backup');save();renderAll();toast('Backup imported')}

/* ---------- Cloud features (Firestore). Each call is wrapped so the app keeps working if the cloud is unavailable. ---------- */
async function secLog(m){
  log(m,'security');save();
  try{await fsReady;if(currentUser)await addDoc(collection(fdb,'users',currentUser.uid,'security'),{m,t:Date.now(),dev:DEV.id,label:DEV.label})}catch(e){}}
async function loadCloudSec(){
  try{await fsReady;const s=await getDocs(query(collection(fdb,'users',currentUser.uid,'security'),orderBy('t','desc'),limit(40)));cloudSec=s.docs.map(d=>d.data());if(U&&U.view==='activity')render(1)}catch(e){}}
async function loadStats(){
  try{await fsReady;const s=await getDoc(doc(fdb,'stats','site'));if(s.exists()){const d=s.data();CS={users:d.users||0,visits:d.visits||0,sum:d.ratingSum||0,count:d.ratingCount||0}}else CS={users:0,visits:0,sum:0,count:0}}catch(e){}
  try{const r=await getDoc(doc(fdb,'ratings',currentUser.uid));if(r.exists()){S.settings.myRating=r.data().stars||0;save()}}catch(e){}
  if(U&&U.view==='home'&&!U.q)render(1)}
async function registerVisit(){
  try{
    await fsReady;const r=doc(fdb,'users',currentUser.uid),s=await getDoc(r);
    if(!s.exists()){await setDoc(r,{name:S.settings.fullname,joined:Date.now()});await setDoc(doc(fdb,'stats','site'),{users:increment(1)},{merge:true})}
    let seen=false;try{seen=sessionStorage.getItem('knart_visit')==='1'}catch(e){}
    if(!seen){await setDoc(doc(fdb,'stats','site'),{visits:increment(1)},{merge:true});try{sessionStorage.setItem('knart_visit','1')}catch(e){}}
  }catch(e){}}
async function loadComing(){
  try{await fsReady;const s=await getDoc(doc(fdb,'config','comingNew'));if(s.exists()&&s.data().text){COMING=String(s.data().text).split('\n').map(x=>x.trim()).filter(Boolean);if(U&&U.view==='home'&&!U.q)render(1)}}catch(e){}}
async function rate(n){
  const old=S.settings.myRating||0;S.settings.myRating=n;save();
  if(CS.count!=null){CS.sum=(CS.sum||0)+(n-old);if(!old)CS.count=(CS.count||0)+1}
  if(U.view==='home')render(1);
  try{
    await fsReady;const rr=doc(fdb,'ratings',currentUser.uid),s=await getDoc(rr),prev=s.exists()?(s.data().stars||0):0;
    await setDoc(rr,{stars:n,t:Date.now()});
    await setDoc(doc(fdb,'stats','site'),{ratingSum:increment(n-prev),ratingCount:increment(prev?0:1)},{merge:true});
    toast(`Thanks! You gave ${n} star${n>1?'s':''}.`)
  }catch(e){toast('Rating saved on this device. It will count once the cloud is reachable.')}}

/* ---------- Actions ---------- */
const ids1=el=>{const r=el.closest('[data-fid]');return r?r.dataset.fid:null};
const selIds=()=>[...U.sel];
const A={
openFolder:el=>openF(el.dataset.id),
toggle:el=>{const i=el.dataset.id;S.expanded=S.expanded.includes(i)?S.expanded.filter(x=>x!==i):[...S.expanded,i];save();renderSide()},
tab:el=>{U.tab=el.dataset.t;renderSide()},
nav:el=>{const v=el.dataset.v;if(v==='folder')go('folder',{folder:U.folder||null});else go(v)},
smart:el=>go(el.dataset.v),tagView:el=>go('tag',{tag:el.dataset.tag}),
back:()=>{if(U.view!=='folder'||U.q){go('folder',{folder:U.folder||null});return}const f=FO(U.folder);if(f)openF(f.parent)},
openFile:el=>{const id=ids1(el);if(id){if(FI(id).trashed)return fileMenu(id,...menuAt(el));openViewer(id)}},
selcell:el=>{const id=ids1(el);if(!id)return;U.sel.has(id)?U.sel.delete(id):U.sel.add(id);render(1)},
selall:()=>{const ids=visibleIds();const all=ids.every(i=>U.sel.has(i));ids.forEach(i=>all?U.sel.delete(i):U.sel.add(i));render(1)},
clearSel:()=>{U.sel.clear();render(1)},
star:el=>toggleStar([ids1(el)]),
fileMenu:el=>fileMenu(ids1(el),...menuAt(el)),
folderMenu:el=>folderMenu(el.closest('[data-id]').dataset.id,...menuAt(el)),
restoreOne:el=>restoreFiles([ids1(el)]),
sort:el=>{const k=el.dataset.k,s=S.settings;if(s.sortKey===k)s.sortDir*=-1;else{s.sortKey=k;s.sortDir=k==='name'||k==='by'?1:-1}save();render(1)},
setMode:el=>{S.settings.mode=el.dataset.m;save();render(1)},
upload:()=>{upTarget=cur();$('#fin').click()},uploadFolder:()=>{$('#din').click()},
newFolder:()=>newFolder(cur()),
plusMenu:el=>{const[x,y]=menuAt(el);menu(x-120,y,[{t:'New folder here',i:'folder',fn:()=>newFolder(cur())},{t:'New top-level folder',i:'plus',fn:()=>newFolder(null)},'-',{t:'Upload files',i:'upload',fn:()=>A.upload()},{t:'Upload a folder',i:'folderOpen',fn:()=>A.uploadFolder()}])},
toggleSide:()=>$('#shell').classList.toggle('collapsed'),
sbMobile:()=>{const s=$('#shell');s.classList.remove('collapsed');s.classList.toggle('side-open')},
crumb:el=>{const[x,y]=menuAt(el);const it=[{t:'School Files (all)',i:'db',fn:()=>openF(null)}];(function w(p,d){kids(p).forEach(f=>{it.push({t:f.name,i:f.id===U.folder?'folderOpen':'folder',pad:12+d*18,fn:()=>openF(f.id)});w(f.id,d+1)})})(null,0);menu(x,y,it)},
bDownload:()=>download(selIds()),bMove:()=>moveFiles(selIds()),bTag:()=>tagFiles(selIds()),bStar:()=>toggleStar(selIds()),bTrash:()=>trashFiles(selIds()),bRestore:()=>restoreFiles(selIds()),bPurge:()=>purge(selIds()),
emptyTrash:()=>purge(trashed().map(f=>f.id)),
settings:()=>{closeNotifPanel();closeProfilePanel();drawer();$('#drawer').classList.add('open')},
closeSettings:()=>$('#drawer').classList.remove('open'),
openNotifs:openNotifPanel,
closeNotifs:closeNotifPanel,
openProfile:openProfilePanel,
closeProfile:closeProfilePanel,
markRead:()=>{S.notifications.forEach(n=>n.read=true);save();updateBadges();openNotifPanel();openNotifPanel()},
clearNotifs:()=>{S.notifications=[];save();updateBadges();$('#notifPanel').classList.remove('show');openNotifPanel()},
delNotif:el=>{const i=+el.dataset.i;S.notifications.splice(i,1);save();updateBadges();$('#notifPanel').classList.remove('show');openNotifPanel()},
startTour,openHow:()=>{$('#drawer').classList.remove('open');go('howto')},
lockNow:()=>{if(!S.settings.pinHash){toast('Turn on PIN lock in Settings first');return}lock()},
chgPin:async()=>{await setPinFlow();drawer()},
exportBackup,importBackup:()=>$('#bin').click(),
logout:async()=>{if(await askConfirm('Log out','Are you sure you want to log out?','Log out',true)){try{await secLog('Logged out on '+DEV.label)}catch(e){}await signOut(auth);location.reload()}},
rate:el=>rate(+el.dataset.n),
actFilter:el=>{U.actF=el.dataset.f;render(1)},
saveFlash:()=>{const g=i=>(($('#'+i)||{}).value||'').trim();const person=g('fcPerson'),quote=g('fcQuote'),subject=g('fcSubject'),course=g('fcCourse');
  if(!person||!quote){toast('Add who said it and what they said');return}
  S.flash.unshift({id:uid('c_'),person,quote,subject,course,color:FCOL[S.flash.length%FCOL.length],t:Date.now()});
  log(`Saved a flashcard from ${person}`,'flash');save();render(1);toast('Flashcard saved')},
fcColor:async el=>{const c=S.flash.find(x=>x.id===el.closest('[data-fc]').dataset.fc);if(!c)return;
  const k=await dialog(`<h3>Flashcard colour</h3><div class="sw">${FCOL.map(n=>`<button data-c="${n}" class="${c.color===n?'on':''}" style="background:${PAL[n]}" aria-label="${n}"></button>`).join('')}</div><div class="m-act"><button class="btn" data-x="c">Cancel</button></div>`,(m,done)=>{m.onclick=e=>{const b=e.target.closest('[data-c]');if(b)return done(b.dataset.c);if(e.target.closest('[data-x]'))done(null)}});
  if(k){c.color=k;save();render(1)}},
fcDel:async el=>{const id=el.closest('[data-fc]').dataset.fc,c=S.flash.find(x=>x.id===id);if(!c)return;
  if(!await askConfirm('Delete flashcard?',`The flashcard from ${c.person} will be removed.`,'Delete',true))return;
  S.flash=S.flash.filter(x=>x.id!==id);log(`Deleted a flashcard from ${c.person}`,'flash');save();render(1);toast('Flashcard deleted')},
editComing:async()=>{
  const v=await dialog(`<h3>Edit “What’s coming new”</h3><p>One item per line. Everyone sees this on the Home page.</p><textarea class="field" id="cnText" style="min-height:150px">${esc(COMING.join('\n'))}</textarea><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">Publish</button></div>`,(m,done)=>{m.onclick=e=>{const x=e.target.closest('[data-x]');if(x)done(x.dataset.x==='o'?$('#cnText',m).value:null)}});
  if(v===null)return;const text=v.split('\n').map(x=>x.trim()).filter(Boolean).join('\n');
  try{await fsReady;await setDoc(doc(fdb,'config','comingNew'),{text,by:S.settings.email,t:Date.now()});COMING=text?text.split('\n'):[];render(1);toast('Published')}catch(e){toast('Could not publish: '+cleanErr(e))}},
changePw:()=>dialog(`<h3>Change password</h3><input type="password" class="field" id="pwOld" placeholder="Current password" autocomplete="current-password"><input type="password" class="field" id="pwNew" placeholder="New password (min 6 characters)" autocomplete="new-password"><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="o">Update password</button></div>`,(m,done)=>{
  m.onclick=async e=>{const x=e.target.closest('[data-x]');if(!x)return;if(x.dataset.x==='c')return done(null);
    const o=$('#pwOld',m).value,n=$('#pwNew',m).value;if(!o||n.length<6){toast('Enter your current password and a new one (6+ characters)');return}
    try{await reauthenticateWithCredential(currentUser,EmailAuthProvider.credential(currentUser.email,o));await updatePassword(currentUser,n);await secLog('Password changed on '+DEV.label);notif('Your password was changed');toast('Password updated');done(1)}catch(err){toast(cleanErr(err))}}}),
reportBug:()=>{
  dialog(`<h3>Report a bug</h3><p>Found an issue? Send a report to the developer.</p><textarea class="field" id="bugDesc" placeholder="Describe what happened…"></textarea><div class="m-act"><button class="btn" data-x="c">Cancel</button><button class="btn primary" data-x="s">Send report</button></div>`,(m,done)=>{
    m.onclick=e=>{
      if(e.target.closest('[data-x="s"]')){
        const d=$('#bugDesc',m).value.trim();if(!d)return toast('Please describe the bug');
        const body=encodeURIComponent("BUG REPORT\n\nDescription:\n"+d+"\n\n--- Device info ---\nApp: KNart School Management Hub v"+VER+"\nUser: "+S.settings.email+"\nDevice: "+DEV.label+"\nDate: "+new Date().toLocaleString());
        window.location.href=`mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('KNart Bug Report')}&body=${body}`;
        notif('Bug report drafted to developer');toast('Opening your email app…');done()
      }else if(e.target.closest('[data-x="c"]'))done()}})},
resetAll:async()=>{if(!await askConfirm('Erase everything?','All folders, files, flashcards, notes and settings on this device will be deleted. Export a backup first if you might need them.','Erase everything',true))return;for(const f of S.files)await delBlob(f.id);localStorage.removeItem(KEY+'_'+currentUser.uid);location.reload()},
whatsNew:()=>dialog(`<h3>What’s new in v${VER}</h3><ul><li>New Activity page with flashcards on top and a full history of your uploads, deleted files and sign-ins.</li><li>Files now save in your browser, with several saving at once.</li><li>Home shows 3 recent files, how many people use the hub, and a star rating.</li><li>“What’s coming new” and About the developer on Home.</li><li>File transfer links were removed.</li></ul><div class="m-act"><button class="btn primary" data-x="c">Got it</button></div>`,(m,done)=>{m.onclick=e=>{if(e.target.closest('[data-x]'))done(1)}}),
dupes:async()=>{const g={};live().forEach(f=>{const k=f.name.toLowerCase()+'|'+f.size;(g[k]=g[k]||[]).push(f)});const d=Object.values(g).filter(a=>a.length>1);if(!d.length)return toast('No duplicates found');const extra=d.flatMap(a=>a.slice(1));if(await askConfirm('Duplicates found',`${d.length} set${d.length>1?'s':''} of identical files. Move ${extra.length} extra cop${extra.length>1?'ies':'y'} to Trash and keep one of each?`,'Move to Trash'))trashFiles(extra.map(f=>f.id))},
clearQ:()=>{setQ('');$('#q').focus()},
undo:()=>{const t=$('#toast');if(t._u){restoreSnap(t._u);t._u=null;t.classList.remove('show')}},
vClose:closeViewer,vPrev:()=>vStep(-1),vNext:()=>vStep(1),vStar:()=>{toggleStar([V.l[V.i]]);showViewer()},vDl:()=>download([V.l[V.i]])};

document.addEventListener('click',e=>{
  if(!e.target.closest('.menu'))closeMenu();
  if(!e.target.closest('#notifPanel')&&!e.target.closest('#topNotifBtn'))closeNotifPanel();
  if(!e.target.closest('#profilePanel')&&!e.target.closest('#topProfileBtn'))closeProfilePanel();
  if(T)return;
  const el=e.target.closest('[data-act]');
  if(!el||!S)return;
  const fn=A[el.dataset.act];
  if(fn){e.preventDefault();fn(el,e)}
});
document.addEventListener('contextmenu',e=>{if(T||!S)return;const r=e.target.closest('[data-fid]');if(r){e.preventDefault();fileMenu(r.dataset.fid,e.clientX,e.clientY);return}const c=e.target.closest('.fcard[data-id],.trow2[data-id]');if(c&&c.dataset.id){e.preventDefault();folderMenu(c.dataset.id,e.clientX,e.clientY)}});
document.addEventListener('change',async e=>{
  const t=e.target,k=t.dataset&&t.dataset.set;if(!k||!S)return;
  if(k==='dark'){S.settings.dark=t.checked;applyTheme()}
  else if(k==='font'){S.settings.font=+t.value;applyTheme()}
  else if(k==='mode'){S.settings.mode=t.value;render(1)}
  else if(k==='user'){S.settings.user=t.value.trim()||'You'}
  else if(k==='autolock'){S.settings.autolock=+t.value;armLock()}
  else if(k==='pin'){const ok=t.checked?await setPinFlow():await removePin();if(!ok)t.checked=!t.checked;drawer()}
  save()});
document.addEventListener('input',e=>{
  if(e.target.id==='notes'){const f=FO(U.folder);if(f){f.notes=e.target.value;clearTimeout(A._nt);A._nt=setTimeout(save,400)}}});
document.addEventListener('keydown',e=>{
  if(!S)return;
  if($('#pin').classList.contains('show')){if(/^\d$/.test(e.key))pinKey(e.key);else if(e.key==='Backspace')pinKey('del');return}
  if(!currentUser)return;
  if(T){if(e.key==='Escape'){e.preventDefault();endTour()}else if(e.key==='ArrowRight'){e.preventDefault();stepTour(1)}else if(e.key==='ArrowLeft'){e.preventDefault();stepTour(-1)}return}
  const tg=e.target,typing=/INPUT|TEXTAREA|SELECT/.test(tg.tagName);
  if(V){if(e.key==='Escape')closeViewer();else if(e.key==='ArrowLeft')vStep(-1);else if(e.key==='ArrowRight')vStep(1);return}
  if(e.key==='Escape'){if($('#ctx'))return closeMenu();if($('#drawer').classList.contains('open'))return A.closeSettings();if($('#notifPanel').classList.contains('show'))return closeNotifPanel();if($('#profilePanel').classList.contains('show'))return closeProfilePanel();if(U.q)return A.clearQ();if(U.sel.size){U.sel.clear();render(1)}return}
  if((e.key==='Enter'||e.key===' ')&&!typing&&tg.matches('[data-act="openFolder"],[data-act="openFile"]')){e.preventDefault();tg.click();return}
  if(typing||$('.backdrop'))return;
  if(e.key==='/'){e.preventDefault();$('#q').focus()}
  else if(e.key.toLowerCase()==='n'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();newFolder(cur())}
  else if(e.key.toLowerCase()==='u'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();A.upload()}
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();visibleIds().forEach(i=>U.sel.add(i));render(1)}
  else if((e.key==='Delete'||e.key==='Backspace')&&U.sel.size){e.preventDefault();U.view==='trash'?purge(selIds()):trashFiles(selIds())}});

function setQ(v){U.q=v;$('#q').value=v;$('#qclr').classList.toggle('hide',!v);U.sel.clear();renderAll()}
$('#q').addEventListener('input',e=>{if(!S)return;U.q=e.target.value.trim();$('#qclr').classList.toggle('hide',!e.target.value);U.sel.clear();
  if(U.q.startsWith('/')){U.hits=[];clearTimeout(A._cs);A._cs=setTimeout(()=>contentSearch(U.q.substring(1).trim().toLowerCase()),250)}
  renderRail();renderSide();render()});
$('#sq').addEventListener('input',e=>{U.sq=e.target.value.trim();renderSide()});
$('#fin').onchange=e=>{uploadFiles(e.target.files,upTarget);e.target.value=''};
$('#din').onchange=e=>{uploadTree(e.target.files);e.target.value=''};
$('#bin').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&importBackup(f)};

let dc=0;const hasFiles=e=>e.dataTransfer&&[...e.dataTransfer.types].includes('Files');
document.addEventListener('dragstart',e=>{const r=e.target.closest&&e.target.closest('[data-fid]');if(!r)return;const id=r.dataset.fid;dragIds=U.sel.has(id)?[...U.sel]:[id];e.dataTransfer.setData('text/x-lh',dragIds.join(','));e.dataTransfer.effectAllowed='move'});
document.addEventListener('dragend',()=>{dragIds=null;$$('.drop').forEach(x=>x.classList.remove('drop'))});
document.addEventListener('dragenter',e=>{if(S&&currentUser&&hasFiles(e)){dc++;$('#dz').classList.add('show')}});
document.addEventListener('dragleave',e=>{if(hasFiles(e)){dc=Math.max(0,dc-1);if(!dc)$('#dz').classList.remove('show')}});
document.addEventListener('dragover',e=>{if(dragIds||hasFiles(e)){e.preventDefault();$$('.drop').forEach(x=>x.classList.remove('drop'));const t=e.target.closest&&e.target.closest('[data-drop]');t&&t.classList.add('drop')}});
document.addEventListener('drop',e=>{e.preventDefault();dc=0;$('#dz').classList.remove('show');if(!S||!currentUser)return;const t=e.target.closest&&e.target.closest('[data-drop]');$$('.drop').forEach(x=>x.classList.remove('drop'));const to=t?(t.dataset.drop||null):cur();
  if(dragIds){const ids=dragIds;dragIds=null;if(t)dropMove(ids,to)}else if(hasFiles(e)&&!$('.backdrop')&&e.dataTransfer.files.length)uploadFiles(e.dataTransfer.files,to)});
addEventListener('resize',closeMenu);

async function initData(){
  if(!S.seeded){
    const docText="Welcome to the KNart School Management Hub Documentary.\n\nThis app helps you keep your school files in order. Here is how to use it:\n\n1. FOLDERS: Use the sidebar on the left to move around. Create new folders, right-click to change their colour, or drag files into them.\n2. FILES: Press 'Upload' to save files in this browser. Click any file to preview it.\n3. FLASHCARDS: Open Activity, type who said something, what they said, the subject and the course, then save it as a flashcard.\n4. ACTIVITY: See your uploads, deleted files and sign-ins from other devices.\n5. BACKUP: Press 'Export' in Settings to keep a copy of your files and flashcards.\n6. SECURITY: Turn on the PIN lock in Settings to hide your files if you leave your device.\n\nEnjoy using the KNart Hub!";
    const docBlob=new Blob([docText],{type:'text/plain'});
    await putBlob('doc_file',docBlob);
    const f1=FI('doc_file');if(f1)f1.size=docBlob.size;
    S.seeded=true;save();
  }
  const cut=Date.now()-30*864e5,old=trashed().filter(f=>f.tAt&&f.tAt<cut);if(old.length){for(const f of old)await delBlob(f.id);S.files=S.files.filter(f=>!old.includes(f))}
  save()}

/* ---------- Auth ---------- */
const showErr=(id,msg)=>{const el=$(id);el.textContent=msg;el.style.display='block'};
const hideErrs=()=>{$$('.err-msg').forEach(e=>e.style.display='none')};
const showLoader=msg=>{$('#loginForm').classList.add('hide');$('#signupForm').classList.add('hide');$('#authLoaderWrap').classList.remove('hide');if(msg)$('#authLoaderTxt').textContent=msg};
const hideLoader=(toSignup)=>{$('#authLoaderWrap').classList.add('hide');$('#loginForm').classList.toggle('hide',!!toSignup);$('#signupForm').classList.toggle('hide',!toSignup)};
$('#linkToSignup').onclick=()=>{hideErrs();$('#loginForm').classList.add('hide');$('#signupForm').classList.remove('hide')};
$('#linkToLogin').onclick=()=>{hideErrs();$('#signupForm').classList.add('hide');$('#loginForm').classList.remove('hide')};
$('#btnLogin').onclick=async()=>{
  hideErrs();const email=$('#loginEmail').value.trim(),pass=$('#loginPassword').value;
  if(!email||!pass)return showErr('#loginErr','Please enter your email and password.');
  showLoader('Logging in…');loginFlag=true;
  try{await signInWithEmailAndPassword(auth,email,pass)}catch(error){loginFlag=false;hideLoader(false);showErr('#loginErr',cleanErr(error))}};
$('#btnSignup').onclick=async()=>{
  hideErrs();const name=$('#suName').value.trim(),user=$('#suUser').value.trim(),email=$('#suEmail').value.trim(),pass=$('#suPass').value,conf=$('#suConfirm').value,terms=$('#suTerms').checked;
  if(!name||!user||!email||!pass)return showErr('#suErr','Please fill in all fields.');
  if(pass.length<6)return showErr('#suErr','Password must be at least 6 characters.');
  if(pass!==conf)return showErr('#suErr','Passwords do not match.');
  if(!terms)return showErr('#suErr','You must accept the Terms & Conditions.');
  showLoader('Creating account…');loginFlag=true;
  try{const cred=await createUserWithEmailAndPassword(auth,email,pass);try{localStorage.setItem('knart_un_'+cred.user.uid,user)}catch(e){}await updateProfile(cred.user,{displayName:name});if(S){S.settings.fullname=name;S.settings.user=name;save();$('#headerAvatar').textContent=name.substring(0,2).toUpperCase();if(U&&U.view==='home')render(1)}}
  catch(error){loginFlag=false;hideLoader(true);showErr('#suErr',cleanErr(error))}};
$('#linkForgot').onclick=async()=>{
  const email=prompt('Enter your email address to reset your password:');if(!email)return;
  try{await sendPasswordResetEmail(auth,email.trim());toast('Password reset email sent. Check your inbox.')}catch(error){toast(cleanErr(error))}};
['loginEmail','loginPassword'].forEach(id=>$('#'+id).addEventListener('keydown',e=>{if(e.key==='Enter')$('#btnLogin').click()}));

onAuthStateChanged(auth,user=>{
  if(user){
    currentUser=user;
    const userKey=KEY+'_'+user.uid;
    try{S=JSON.parse(localStorage.getItem(userKey))}catch(e){S=null}
    if(!S||S.v!==3)S=seed();
    S.folders=S.folders||[];S.files=S.files||[];S.log=S.log||[];S.notifications=S.notifications||[];S.flash=S.flash||[];S.devices=S.devices||[];S.expanded=S.expanded||[];
    S.settings={...DEF,...S.settings};
    S.settings.email=user.email;
    S.settings.user=S.settings.user&&S.settings.user!=='You'?S.settings.user:(user.displayName||user.email.split('@')[0]);
    S.settings.fullname=user.displayName||'User';
    try{S.settings.username=localStorage.getItem('knart_un_'+user.uid)||S.settings.username||user.email.split('@')[0]}catch(e){}
    if(S.last&&!FO(S.last))S.last=null;
    U={view:'home',folder:S.last??null,q:'',sq:'',tab:'folders',tag:null,sel:new Set(),actF:'all',hits:[]};
    hideLoader(false);
    $('#authScreen').classList.add('hide');$('#mainHeader').classList.remove('hide');$('#shell').classList.remove('hide');$('#mainFab').classList.remove('hide');
    $('#headerAvatar').textContent=(S.settings.fullname||'U').substring(0,2).toUpperCase();
    applyTheme();readDefaultComing();
    initData().then(()=>{
      renderAll();updateBadges();
      if(S.settings.pinHash)lock();else{armLock();maybeWelcome()}
      if(loginFlag){loginFlag=false;const first=!S.devices.includes(DEV.id);if(first)S.devices.push(DEV.id);secLog(first?`New device signed in: ${DEV.label}`:`Signed in on ${DEV.label}`)}
      registerVisit().then(loadStats);loadComing();loadCloudSec();
    });
  }else{
    currentUser=null;
    $('#authScreen').classList.remove('hide');$('#mainHeader').classList.add('hide');$('#shell').classList.add('hide');$('#mainFab').classList.add('hide');
    $('#drawer').classList.remove('open');closeNotifPanel();closeProfilePanel();
  }
});
