/* NetAcademy Pro · app.js (único JavaScript del sitio)
   Solo contiene comportamiento: el contenido de cada página vive en su propio HTML. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const BUNDLE=document.body.dataset.page==="bundle";
let S={done:{},xp:0,ans:{},labs:{}},chart,Qs="";
try{S=Object.assign(S,JSON.parse(localStorage.getItem("na")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("na",JSON.stringify(S))}catch(e){}};
(function(){const r=document.documentElement,b=$("#theme");let t=null;try{t=localStorage.getItem("na-theme")}catch(e){}
 const dark=()=>r.dataset.theme==="dark"||(r.dataset.theme!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);
 if(t)r.dataset.theme=t;const paint=()=>b.textContent=dark()?"Modo claro":"Modo oscuro";paint();
 b.onclick=()=>{r.dataset.theme=dark()?"light":"dark";try{localStorage.setItem("na-theme",r.dataset.theme)}catch(e){}paint()}})();
function route(){if(!BUNDLE)return document.body.dataset.page;let p=(location.hash.slice(1)||"home").replace(/^lab-.*/,"labs");return $('.page[data-route="'+p+'"]')?p:"home"}
const labSel=()=>(location.hash.match(/^#lab-(\w+)/)||[])[1]||null;
const getQ=()=>BUNDLE?Qs:(new URLSearchParams(location.search).get("q")||"");
function ticks(){$$("aside a.nav[data-id]").forEach(a=>{const k=a.querySelector(".ck");if(k)k.textContent=S.done[a.dataset.id]?"✓":""})}
function paintDone(){$$(".done-btn").forEach(b=>b.textContent=S.done[b.dataset.topic]?"Estudiado ✓":"Marcar como estudiado")}
/* ----- Inicio ----- */
function homeInit(){const cv=$("#ch1");if(!cv)return;
 const nd=Object.keys(S.done).length,nl=Object.keys(S.labs).length,nq=Object.values(S.ans).filter(a=>a).length,tT=+$("#p-t").dataset.of,tL=+$("#p-l").dataset.of,tQ=+$("#p-q").dataset.of;
 $("#lvl").textContent="Nivel "+(1+Math.floor(S.xp/100))+" · "+S.xp+" XP";$("#p-t").textContent=nd;$("#p-l").textContent=nl;$("#p-q").textContent=nq;
 if(window.Chart){try{chart&&chart.destroy()}catch(e){}chart=new Chart(cv,{type:"bar",data:{labels:["Temas","Prácticas","Preguntas"],datasets:[{data:[nd/tT*100,nl/tL*100,nq/tQ*100],backgroundColor:"#049FD9"}]},options:{scales:{y:{max:100,beginAtZero:true,title:{display:true,text:"% completado"}}},plugins:{legend:{display:false}}}})}
 $$("[data-n]").forEach(e=>{const n=+e.dataset.n;let v=0;const k=setInterval(()=>{v+=Math.ceil(n/30);if(v>=n){v=n;clearInterval(k)}e.textContent="+"+v},30)})}
/* ----- Laboratorios ----- */
let L=null;
function norm(s){return s.trim().replace(/\s+/g," ").toLowerCase().replace(/^conf( t| term| terminal)?$/,"configure terminal").replace(/^en$/,"enable").replace(/^int /,"interface ").replace(/^sh /,"show ").replace(/^show run$/,"show running-config").replace(/^show ip int(erface)? br(ief)?$/,"show ip interface brief").replace(/^no sh$/,"no shutdown").replace(/^sw /,"switchport ").replace(/^wr$/,"write").replace(/^wr mem$/,"write memory").replace(/^ex$/,"exit")}
function subOf(c){return /^interface \S+\.\d+/.test(c)?"config-subif":/^interface/.test(c)?"config-if":/^router /.test(c)?"config-router":/^vlan \d+$/.test(c)?"config-vlan":/^ip access-list standard/.test(c)?"config-std-nacl":/^ip access-list/.test(c)?"config-ext-nacl":/^line /.test(c)?"config-line":/^ip dhcp pool/.test(c)?"dhcp-config":/^crypto isakmp policy/.test(c)?"config-isakmp":""}
const P=()=>L.host+(L.lvl===0?"> ":L.lvl===1?"# ":L.lvl===2?"(config)# ":"("+L.sub+")# ");
function out(t){const d=document.createElement("div");d.textContent=t;$("#out").appendChild(d);$("#tm").scrollTop=1e6}
function paintLab(){L.tasks.forEach((t,i)=>t[3].classList.toggle("ok",L.done.has(i)));L.sec.querySelector(".cnt").textContent="("+L.done.size+"/"+L.tasks.length+")";$("#pr").textContent=P()}
function bad(m){out("% Invalid input detected at '^' marker. "+(m||""))}
function checkLab(c){L.tasks.forEach((t,i)=>{if(!L.done.has(i)&&t[1].test(c))L.done.add(i)});paintLab();
 if(L.done.size===L.tasks.length){if(!S.labs[L.id]){S.labs[L.id]=1;S.xp+=50;save()}$("#fin").innerHTML='<div class="okbox"><b>Práctica completada.</b> Ganaste 50 XP la primera vez que la terminas. Pasa a la siguiente o repasa la teoría del tema.</div>'}}
function runLab(raw){const l=norm(raw);out(P()+raw);if(!l)return;
 const dO=l.startsWith("do "),c=dO?l.slice(3):l;
 if(l==="?"){out("Comandos show disponibles: "+Object.keys(L.show).join(" | ")+"\nTareas pendientes: "+(L.tasks.length-L.done.size));return}
 if(c==="enable"){if(L.lvl===0)L.lvl=1;return}
 if(c==="disable"){L.lvl=0;return}
 if(c==="configure terminal"){if(L.lvl<1)return bad("Usa «enable» primero.");L.lvl=2;return}
 if(c==="exit"){L.lvl=L.lvl>2?2:Math.max(0,L.lvl-1);return}
 if(c==="end"){if(L.lvl>1)L.lvl=1;return}
 if(/^(show|ping|copy|write|clear|traceroute|terminal|debug)\b/.test(c)){
  if(L.lvl<1)return bad("Usa «enable» primero.");
  if(L.lvl>1&&!dO)return bad("En modo configuración usa «do» antes del comando.");
  if(c==="show running-config")out("Building configuration...\n"+(L.hist.join("\n")||"(sin cambios todavía)"));
  else if(c.startsWith("show"))out(L.show[c]||"% Comando no incluido en esta práctica. Escribe ? para ver los disponibles.");
  else if(c.startsWith("ping"))out(L.tasks.every((t,i)=>L.done.has(i)||/ping/.test(t[1].source))?"Type escape sequence to abort.\n!!!!!\nSuccess rate is 100 percent (5/5)":".....\nSuccess rate is 0 percent (0/5). Revisa direccionamiento y rutas.");
  else if(/^(copy|write)/.test(c))out("Building configuration...\n[OK]");
  checkLab(c);return}
 if(L.lvl<2)return bad("Entra primero a «configure terminal».");
 if(c.startsWith("hostname "))L.host=raw.trim().split(" ")[1]||L.host;
 const s=subOf(c);if(s){L.sub=s;L.lvl=3}
 L.hist.push(raw.trim());checkLab(c)}
function startLab(id){const sec=$('.lab-sec[data-lab="'+id+'"]');
 L={id,sec,host:sec.dataset.host,lvl:0,sub:"",done:new Set(),hist:[],
  tasks:[...sec.querySelectorAll("li[data-re]")].map(li=>[li.textContent.trim(),new RegExp(li.dataset.re),li.dataset.sol,li]),
  show:Object.fromEntries([...sec.querySelectorAll("pre[data-cmd]")].map(p=>[p.dataset.cmd,p.textContent]))};
 sec.querySelector(".sol").hidden=true;sec.querySelector(".lab-sol").textContent="Ver solución";
 $("#out").innerHTML="";$("#fin").innerHTML="";out("Práctica lista. Escribe «enable» y luego «configure terminal». Usa ? para ayuda.");paintLab()}
function labsShow(){let id=labSel();if(id&&!$('.lab-sec[data-lab="'+id+'"]'))id=null;
 $$(".lab-sec").forEach(s=>s.hidden=s.dataset.lab!==id);$("#labs-list").hidden=!!id;$("#term-wrap").hidden=!id;
 $$("[data-lab-badge]").forEach(b=>{if(S.labs[b.dataset.labBadge])b.textContent="Completada ✓"});
 if(id)startLab(id)}
/* ----- Referencia de comandos ----- */
let cSel="all",cQ="";
function cmdsApply(){$$(".chip").forEach(c=>c.classList.toggle("on",c.dataset.s===cSel));let any=false;
 $$(".cmd-sec").forEach(s=>{const ok=cSel==="all"||s.dataset.topic===cSel;let v=0;s.querySelectorAll(".cb").forEach(b=>{const m=ok&&(!cQ||b.textContent.toLowerCase().includes(cQ));b.hidden=!m;if(m)v++});s.hidden=!v;any=any||v>0});$("#cmd-none").hidden=any}
/* ----- Certificaciones ----- */
function revealQ(card,pick){card.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.o===card.dataset.ok)b.classList.add("ok");else if(b.dataset.o===pick)b.classList.add("bad")});card.querySelector(".ex").hidden=false}
function certInit(){$$(".q").forEach(c=>{if(S.ans[+c.dataset.q]!==undefined)revealQ(c,null)})}
/* ----- Buscador ----- */
function searchApply(){const raw=getQ(),v=raw.toLowerCase().trim();$("#q").value=raw;
 if(!v){$("#sr-res").hidden=true;$("#sr-msg").hidden=false;$("#sr-title").textContent="Buscador técnico";return}
 $("#sr-msg").hidden=true;$("#sr-res").hidden=false;$("#sr-title").textContent="Resultados para «"+v+"»";
 let c=0,t=0;$$("#sr-res tr[data-k]").forEach(r=>{const m=r.dataset.k.includes(v);r.hidden=!m;if(m)c++});
 $$("#sr-res .sr-t").forEach(a=>{const m=a.dataset.k.includes(v);a.hidden=!m;if(m)t++});
 $("#sr-nocmd").hidden=c>0;$("#sr-notopic").hidden=t>0}
/* ----- Router y arranque ----- */
function show(){const p=route();
 if(BUNDLE){$$(".page").forEach(s=>s.hidden=s.dataset.route!==p);const vh=$("#vh");if(vh){vh.hidden=p!=="home";dispatchEvent(new Event("resize"))}
  $$("aside a.nav").forEach(a=>{const on=a.dataset.p===p;a.classList.toggle("on",on);if(on)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  scrollTo(0,0);const h=$('.page[data-route="'+p+'"] h2,.page[data-route="'+p+'"] h3');document.title=(h?h.textContent:"NetAcademy Pro")+" · NetAcademy Pro"}
 ticks();paintDone();
 if(p==="home")homeInit();else if(p==="labs")labsShow();else if(p==="cmds")cmdsApply();else if(p==="cert")certInit();else if(p==="buscar")searchApply()}
document.addEventListener("click",e=>{let b;
 if(b=e.target.closest(".done-btn")){const t=b.dataset.topic;if(!S.done[t]){S.done[t]=1;S.xp+=20;save();ticks()}paintDone();return}
 if(b=e.target.closest(".opt")){const c=b.closest(".q"),i=+c.dataset.q,ok=b.dataset.o===c.dataset.ok;if(S.ans[i]===undefined){S.ans[i]=ok;if(ok)S.xp+=10;save()}revealQ(c,b.dataset.o);return}
 if(b=e.target.closest(".chip")){cSel=b.dataset.s;cmdsApply();return}
 if(b=e.target.closest(".cp")){const tx=b.closest(".cb").querySelector("pre").textContent;
  const ok=()=>{b.textContent="Copiado ✓";setTimeout(()=>b.textContent="Copiar",1500)};
  const fb=()=>{try{const t=document.createElement("textarea");t.value=tx;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();ok()}catch(x){b.textContent="Selecciona y copia"}};
  try{navigator.clipboard.writeText(tx).then(ok,fb)}catch(x){fb()}return}
 if(b=e.target.closest(".lab-hint")){const i=L.tasks.findIndex((t,k)=>!L.done.has(k));out(i<0?"Ya completaste todas las tareas.":"Pista → "+L.tasks[i][0]+"\n"+L.tasks[i][2]);return}
 if(b=e.target.closest(".lab-sol")){const p=L.sec.querySelector(".sol");p.hidden=!p.hidden;p.textContent=L.tasks.map(t=>t[2]).join("\n");b.textContent=p.hidden?"Ver solución":"Ocultar solución";return}
 if(b=e.target.closest(".lab-reset")){startLab(L.id);return}
 if(e.target.closest("#tm"))$("#ti").focus()});
if($("#cf"))$("#cf").oninput=e=>{cQ=e.target.value.toLowerCase().trim();cmdsApply()};
if($("#ti"))$("#ti").onkeydown=e=>{if(e.key!=="Enter"||!L)return;const v=e.target.value;e.target.value="";runLab(v);paintLab()};
$("#sf").addEventListener("submit",e=>{if(BUNDLE){e.preventDefault();Qs=$("#q").value;if(location.hash==="#buscar")show();else location.hash="buscar"}});
addEventListener("hashchange",show);

function calc(){const f=()=>{const p=$("#ip").value.split(".").map(Number),c=+$("#cd").value;if(p.length!==4||p.some(x=>!(x>=0&&x<=255))||!(c>=0&&c<=32)){$("#res").innerHTML="<tr><td>Introduce una IPv4 válida y un CIDR de 0 a 32.</td></tr>";return}
 const ip=((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0,m=c?(0xFFFFFFFF<<(32-c))>>>0:0,n=(ip&m)>>>0,b=(n|(~m>>>0))>>>0,s=x=>[x>>>24,(x>>>16)&255,(x>>>8)&255,x&255].join(".");
 const h=c>=31?(c==32?1:2):Math.pow(2,32-c)-2;
 $("#res").innerHTML=[["Máscara",s(m)],["Wildcard",s(~m>>>0)],["Red",s(n)],["Broadcast",s(b)],["Rango útil",c>=31?"—":s(n+1)+" – "+s(b-1)],["Hosts útiles",h]].map(r=>`<tr><th>${r[0]}</th><td class="mono">${r[1]}</td></tr>`).join("")};
 $("#ip").oninput=f;$("#cd").oninput=f;f()}
function spfInit(){const N={R1:[40,100],R2:[170,30],R3:[170,170],R4:[300,100],R5:[385,100]},E=[["R1","R2",10],["R1","R3",5],["R2","R4",5],["R3","R4",10],["R4","R5",1],["R2","R3",2]];
 const draw=(vis,tree)=>{$("#sv").innerHTML=E.map(e=>{const a=N[e[0]],b=N[e[1]],on=tree.includes(e[0]+e[1])||tree.includes(e[1]+e[0]);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${on?"#049FD9":"#8aa0ba"}" stroke-width="${on?4:1.5}"/><text x="${(a[0]+b[0])/2}" y="${(a[1]+b[1])/2-4}" font-size="11" fill="currentColor">${e[2]}</text>`}).join("")+Object.keys(N).map(k=>`<circle cx="${N[k][0]}" cy="${N[k][1]}" r="16" fill="${vis[k]!=null?"#049FD9":"#1B365D"}"/><text x="${N[k][0]}" y="${N[k][1]+4}" font-size="11" fill="#fff" text-anchor="middle">${k}</text>`).join("")};
 draw({},[]);
 $("#run").onclick=async()=>{const d={R1:0},prev={},done=new Set(),tree=[];const sl=ms=>new Promise(r=>setTimeout(r,ms));
  while(done.size<5){const u=Object.keys(d).filter(k=>!done.has(k)).sort((a,b)=>d[a]-d[b])[0];if(!u)break;done.add(u);if(prev[u])tree.push(prev[u]+u);
   E.forEach(e=>{const v=e[0]===u?e[1]:e[1]===u?e[0]:null;if(v&&!done.has(v)&&(d[v]==null||d[u]+e[2]<d[v])){d[v]=d[u]+e[2];prev[v]=u}});
   $("#st").textContent=`Fijado ${u} (coste ${d[u]})`;draw(d,tree);await sl(900)}
  $("#st").textContent="Árbol SPF completo"}}


/* ===== Header estilo video ===== */
(function(){
const c=document.getElementById("vc");if(!c)return;const x=c.getContext("2d"),still=matchMedia("(prefers-reduced-motion:reduce)").matches;
let W,H,N=[],P=[],play=!still,t0=performance.now(),last=t0;
function size(){const r=c.parentElement.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
 const n=Math.round(Math.min(70,W/22));N=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,h:Math.random()<.12}))}
function near(){const E=[];for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const d=Math.hypot(N[i].x-N[j].x,N[i].y-N[j].y);if(d<150)E.push([i,j,d])}return E}
function frame(now){
 const dt=now-last;last=now;
 x.clearRect(0,0,W,H);
 if(play)N.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1});
 const E=near();
 E.forEach(e=>{x.strokeStyle="rgba(4,159,217,"+(.35*(1-e[2]/150))+")";x.lineWidth=1;x.beginPath();x.moveTo(N[e[0]].x,N[e[0]].y);x.lineTo(N[e[1]].x,N[e[1]].y);x.stroke()});
 if(play&&E.length&&Math.random()<.12&&P.length<30){const e=E[Math.floor(Math.random()*E.length)];P.push({a:e[0],b:e[1],p:0})}
 P=P.filter(k=>k.p<1);
 P.forEach(k=>{if(play)k.p+=.02;const a=N[k.a],b=N[k.b],px=a.x+(b.x-a.x)*k.p,py=a.y+(b.y-a.y)*k.p;x.fillStyle="#fff";x.shadowColor="#049FD9";x.shadowBlur=12;x.beginPath();x.arc(px,py,2.2,0,6.3);x.fill();x.shadowBlur=0});
 N.forEach(n=>{x.fillStyle=n.h?"#049FD9":"rgba(190,225,245,.7)";x.beginPath();x.arc(n.x,n.y,n.h?4:2,0,6.3);x.fill();if(n.h){x.strokeStyle="rgba(4,159,217,.5)";x.beginPath();x.arc(n.x,n.y,9+Math.sin(now/400)*3,0,6.3);x.stroke()}});
 if(!still)requestAnimationFrame(frame)}
size();addEventListener("resize",size);
requestAnimationFrame(frame);
})();


if($("#ip"))calc();
if($("#sv"))spfInit();
show();
