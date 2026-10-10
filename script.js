const stage=document.getElementById('stage');let scale=1,snd=true,AC;
const S={lv:0,ti:0,score:0,stars:0,done:false};
const $=s=>stage.querySelector(s);
function beep(f,d=.15,t='sine'){if(!snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=.1;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const good=()=>{beep(660);setTimeout(()=>beep(880),120)},bad=()=>beep(220,.25,'triangle');
function fit(){scale=Math.min(innerWidth/960,innerHeight/540);stage.style.transform=`translate(-50%,-50%) scale(${scale})`}
addEventListener('resize',fit);fit();
const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* ---------- Фигуралар (SVG) ---------- */
const COL={circle:'#e53935',square:'#1e88e5',triangle:'#fdd835',rect:'#43a047',oval:'#8e24aa',star:'#ec407a'};
const ACC={triangle:'Үшбұрышты',square:'Шаршыны',circle:'Шеңберді',rect:'Тіктөртбұрышты',oval:'Сопақшаны',star:'Жұлдызды'};
const DIM={circle:[90,90],square:[90,90],triangle:[100,90],rect:[130,70],oval:[70,110],star:[100,95]};
function svg(t,w,h,c){c=c||COL[t];const p=`fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="3"`;let b;
 if(t=='circle'||t=='oval')b=`<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-2}" ry="${h/2-2}" ${p}/>`;
 else if(t=='triangle')b=`<polygon points="${w/2},2 ${w-2},${h-2} 2,${h-2}" ${p}/>`;
 else if(t=='star')return `<svg width="${w}" height="${h}" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="50,3 61,38 97,38 68,59 79,94 50,73 21,94 32,59 3,38 39,38" ${p}/></svg>`;
 else b=`<rect x="2" y="2" width="${w-4}" height="${h-4}" rx="6" ${p}/>`;
 return `<svg width="${w}" height="${h}">${b}</svg>`}
const starSVG=(s=40,c='#fbc02d')=>svg('star',s,s,c);
/* ---------- 1-деңгей: сахна және сұрақтар ---------- */
const O={table:{x:500,b:300,w:240,h:120},box:{x:500,b:300,w:64,h:64},book:{x:260,b:300,w:80,h:22},bear:{x:110,b:300,w:100,h:112,img:'bear'},chair:{x:710,b:300,w:80,h:120},car:{x:800,b:312,w:140,h:78,img:'car',z:2},ball:{x:500,b:180,w:60,h:60,img:'ball'}};
O.chair.z=1;
const ORD=['table','box','book','bear','chair','car','ball'];
const LR=['Сол жағында','Оң жағында'],UD=['Үстінде','Астында'];
const PAIRS=[['bear','table','Қонжық пен үстел'],['table','chair','Үстел мен орындық'],['chair','car','Орындық пен машина']];
const SQ=[
 {q:'Қонжық үстелдің қай жағында орналасқан?',o:LR,a:()=>O.bear.x<O.table.x?0:1},
 {q:'Доп үстелдің үстінде ме, астында ма?',o:UD,a:()=>O.ball.b<=O.table.b-O.table.h?0:1},
 {q:'Қорап үстелдің астында ма, үстінде ме?',o:['Астында','Үстінде'],a:()=>O.box.b-O.box.h>O.table.b-O.table.h?0:1},
 {q:'Машина орындықтың алдында ма, артында ма?',o:['Алдында','Артында'],a:()=>O.car.z>O.chair.z?0:1},
 {q:'Кітап қай заттардың арасында тұр?',o:PAIRS.map(p=>p[2]),a:()=>PAIRS.findIndex(([m,n])=>Math.min(O[m].x,O[n].x)<O.book.x&&O.book.x<Math.max(O[m].x,O[n].x))},
 {q:'Орындық үстелдің қай жағында орналасқан?',o:LR,a:()=>O.chair.x<O.table.x?0:1}];
/* ---------- 3-деңгей: композициялар [түрі,cx,cy,w,h,түсі] ---------- */
const BD={
 house:{t:'Үй құрастыр!',s:[['square',300,290,120,120,'#ffb74d'],['triangle',300,190,150,80,'#e53935'],['rect',300,320,36,60,'#1e88e5'],['square',265,265,30,30,'#4fc3f7'],['square',335,265,30,30,'#4fc3f7']]},
 rocket:{t:'Зымыран құрастыр!',s:[['rect',300,290,70,130,'#fdd835'],['triangle',300,195,70,60,'#e53935'],['triangle',255,325,40,60,'#1e88e5'],['triangle',345,325,40,60,'#1e88e5'],['circle',300,265,30,30,'#4fc3f7']]},
 tree:{t:'Шырша құрастыр!',s:[['triangle',300,220,120,100,'#43a047'],['rect',300,300,30,60,'#8d5a2b']]},
 mini:{t:'Шағын үй құрастыр!',s:[['square',300,300,100,100,'#ffb74d'],['triangle',300,215,130,70,'#e53935']]}};
const LV=[
 [{t:'sp',k:0},{t:'sp',k:1},{t:'sp',k:2},{t:'sp',k:3},{t:'sp',k:4}],
 ['triangle','square','circle','rect','oval','star'].map(s=>({t:'sh',s})),
 [{t:'bd',k:'house'},{t:'bd',k:'rocket'}],
 [{t:'sp',k:5},{t:'sh',s:'rect'},{t:'bd',k:'tree'},{t:'sp',k:2},{t:'bd',k:'mini'}]];
const LN=['Зат қайда орналасқан?','Фигураны таны!','Фигуралардан құрастыр!','Ғажайып бөлменің шебері'];
/* ---------- Экрандар ---------- */
function hud(){const n=LV[S.lv].length,d=S.ti+(S.done?1:0);return `<button class="rb" data-a="home">⌂</button><button class="rb" data-a="snd">${snd?'♪':'✕'}</button><span>${S.lv+1}-деңгей</span><div class="pg"><i style="width:${d/n*100}%"></i><b>${d}/${n}</b></div><div class="sc">★ ${S.score}</div>`}
const upd=()=>{$('#hw').innerHTML=hud()};
function menu(){S.lv=0;S.ti=0;S.score=0;S.stars=0;S.done=false;
 stage.innerHTML=`<div class="menu"><h1>Ғажайып ойыншықтар бөлмесі</h1><img class="boy" src="assets/characters/boy.png" alt=""><button class="go" data-a="start">▶ Ойынды бастау</button><button class="rb" data-a="snd">${snd?'♪':'✕'}</button></div>`}
function task(){S.done=false;const T=LV[S.lv][S.ti];
 let h=`<div class="hud" id="hw">${hud()}</div><div id="fb"></div>`;
 if(T.t=='sp')h+=tSp(T.k);else if(T.t=='sh')h+=tSh(T.s);else h+=tBd(T.k);
 h+=`<button class="big" id="nx" data-a="next">Келесі ▶</button>`;stage.innerHTML=h;
 if(T.t=='bd')bindBuild(BD[T.k].s.map(([t,cx,cy,w,h])=>({t,cx,cy,w,h})))}
function tSp(k){const q=SQ[k],ans=q.a();let h=`<div class="qb">${q.q}</div><div class="scene">`;
 for(const n of ORD){const o=O[n],st=`left:${o.x-o.w/2}px;top:${o.b-o.h}px;width:${o.w}px;height:${o.h}px`;
  if(o.img)h+=`<img src="assets/objects/${o.img}.png" style="${st}" alt="">`;
  else if(n=='table')h+=`<div class="table" style="${st}"><div class="top"></div><div class="leg" style="left:12px"></div><div class="leg" style="right:12px"></div></div>`;
  else if(n=='chair')h+=`<div class="chair" style="${st}"><i class="cb"></i><i class="cs"></i><i class="cl" style="left:6px"></i><i class="cl" style="right:6px"></i></div>`;
  else h+=`<div class="${n}" style="${st}"></div>`}
 h+=`</div><div class="opts">`;
 return h+sh(q.o.map((t,i)=>({t,ok:i==ans}))).map(x=>`<button class="opt" data-a="o" data-ok="${+x.ok}">${x.t}</button>`).join('')+'</div>'}
function tSh(s){const others=sh(Object.keys(COL).filter(x=>x!=s)).slice(0,3);
 return `<div class="qb">${ACC[s]} ${S.lv==3?'тауып, белгіле!':'таңда!'}</div><div class="shapes">`+sh([s,...others]).map(t=>`<button class="opt sh" data-a="o" data-ok="${+(t==s)}">${svg(t,...DIM[t])}</button>`).join('')+'</div>'}
function tBd(k){const b=BD[k];let h=`<div class="qb">${b.t}</div><div class="frame"></div><div class="pan"></div>`;
 b.s.forEach(([t,cx,cy,w,hh])=>h+=`<div class="gh" style="left:${cx-w/2}px;top:${cy-hh/2}px">${svg(t,w,hh,'#555')}</div>`);
 let x=660,y=135,rh=0;
 sh(b.s).sort((a,c)=>c[3]*c[4]-a[3]*a[4]).forEach(([t,cx,cy,w,hh,c])=>{if(x+w>935){x=660;y+=rh+10;rh=0}
  h+=`<div class="pc" data-t="${t}" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px">${svg(t,w,hh,c)}</div>`;x+=w+10;rh=Math.max(rh,hh)});
 return h+`<button class="big" id="chk" data-a="chk">✔ Тексеру</button>`}
function bindBuild(slots){const P=[...stage.querySelectorAll('.pc')];const R=()=>stage.getBoundingClientRect();
 window._P=P;window._S=slots;
 P.forEach(p=>{p.onpointerdown=e=>{if(S.done)return;e.preventDefault();p.setPointerCapture(e.pointerId);p.sl=null;p.style.zIndex=50;p.classList.add('dr');const r=R();p.ox=(e.clientX-r.left)/scale-p.offsetLeft;p.oy=(e.clientY-r.top)/scale-p.offsetTop;p.mv=1};
  p.onpointermove=e=>{if(!p.mv)return;const r=R();p.style.left=Math.max(0,Math.min(960-p.offsetWidth,(e.clientX-r.left)/scale-p.ox))+'px';p.style.top=Math.max(60,Math.min(540-p.offsetHeight,(e.clientY-r.top)/scale-p.oy))+'px'};
  p.onpointerup=p.onpointercancel=()=>{if(!p.mv)return;p.mv=0;p.classList.remove('dr');p.style.zIndex=10;
   const w=p.offsetWidth,h=p.offsetHeight,cx=p.offsetLeft+w/2,cy=p.offsetTop+h/2;
   const s=slots.find(s=>s.t==p.dataset.t&&s.w==w&&s.h==h&&Math.hypot(s.cx-cx,s.cy-cy)<45&&!P.some(q=>q!==p&&q.sl===s));
   if(s){p.sl=s;p.style.left=s.cx-w/2+'px';p.style.top=s.cy-h/2+'px';beep(520,.08)}}})}
function fb(ok,m){const f=$('#fb');f.className=ok?'y':'n';f.innerHTML=`<img src="assets/characters/${ok?'happy':'think'}.png" alt="">${m}`}
function win(){if(S.done)return;S.done=true;S.score+=10;S.stars++;good();fb(1,'Жарайсың! ★');$('#nx').style.display='block';upd();const c=$('#chk');if(c)c.style.display='none'}
function lose(){if(S.done)return;bad();fb(0,'Қайта байқап көр!')}
function next(){S.ti++;S.done=false;if(S.ti>=LV[S.lv].length)levelEnd();else task()}
function levelEnd(){if(S.lv==3)return final();
 stage.innerHTML=`<div class="end">${starSVG(110)}<h2>${S.lv+1}-деңгей аяқталды!</h2><div>Ұпай: ${S.score}</div><div class="row"><button data-a="lvnext">Келесі деңгей ▶</button></div></div>`}
function final(){stage.innerHTML=`<div class="end"><svg width="150" height="150" viewBox="0 0 100 100"><path d="M25 10h50v30c0 18-12 28-25 28S25 58 25 40z" fill="#fbc02d" stroke="#c88a00" stroke-width="3"/><path d="M25 18H10c0 18 6 26 17 28M75 18h15c0 18-6 26-17 28" fill="none" stroke="#c88a00" stroke-width="4"/><rect x="44" y="66" width="12" height="14" fill="#c88a00"/><rect x="30" y="80" width="40" height="10" rx="3" fill="#8d5a2b"/></svg><h2>Жарайсың! Сен ғажайып бөлменің шеберісің!</h2><div>Ұпай: ${S.score} · Орындалған тапсырма: ${S.stars} · Жұлдызшалар: ${S.stars}</div><div class="row"><button data-a="start">↻ Қайта ойнау</button><button data-a="home">⌂ Басты мәзір</button></div></div>`;good()}
stage.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a=='start'){S.lv=0;S.ti=0;S.score=0;S.stars=0;task()}
 else if(a=='lvnext'){S.lv++;S.ti=0;task()}
 else if(a=='home')menu();
 else if(a=='snd'){snd=!snd;b.textContent=snd?'♪':'✕'}
 else if(a=='next')next();
 else if(a=='o'){if(S.done)return;if(b.dataset.ok=='1'){b.classList.add('ok');win()}else{b.classList.add('no');lose()}}
 else if(a=='chk'){if(window._S.every(s=>window._P.some(p=>p.sl===s)))win();else lose()}});
menu();
