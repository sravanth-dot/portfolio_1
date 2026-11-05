(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));

// ---------- Theme (remembered, falls back to system setting)
let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
root.dataset.theme=saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};

// ---------- Toast
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1800)};

// ---------- Mobile menu
const burger=$('#burger'),menu=$('#menu');
const closeMenu=()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded','false')};
burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
$$('#menu a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// ---------- Scroll progress, back-to-top, active nav link
const bar=$('#progress'),topBtn=$('#top-btn');
const onScroll=()=>{const h=root.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%';topBtn.hidden=scrollY<600};
addEventListener('scroll',onScroll,{passive:true});onScroll();
topBtn.onclick=()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'});
const links=$$('#menu a');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));

// ---------- Reveal on scroll
const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rev.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>rev.observe(el));

// ---------- Typing roles in the hero
const roles=['full-stack web apps','Java back ends','SQL-powered features','clean, responsive UIs','things that solve problems'];
(async()=>{const el=$('#typed');if(reduce){return}
  let i=0;await sleep(1800);
  for(;;){const w=roles[i%roles.length];
    for(let n=w.length;n>=0;n--){el.textContent=w.slice(0,n);await sleep(28)}
    i++;const nx=roles[i%roles.length];
    for(let n=1;n<=nx.length;n++){el.textContent=nx.slice(0,n);await sleep(65)}
    await sleep(1800)}})();

// ---------- Hero spotlight + photo tilt + card tilt (mouse only)
if(fine&&!reduce){
  const hero=$('.hero');
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});
  const tilt=(el,max)=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      el.style.transform=`rotateY(${(x-.5)*max}deg) rotateX(${(.5-y)*max}deg)`;
      el.style.setProperty('--gx',x*100+'%');el.style.setProperty('--gy',y*100+'%')});
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
  };
  tilt($('#tilt'),14);
  $$('.tilt-card').forEach(c=>tilt(c,6));
}

// ---------- Particle network background
(function(){
  const cv=$('#bg');if(!cv||reduce)return;
  const ctx=cv.getContext('2d');let w,h,pts=[],mouse={x:-999,y:-999},run=true;
  const size=()=>{const d=Math.min(devicePixelRatio||1,2);w=cv.width=innerWidth*d;h=cv.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);w=innerWidth;h=innerHeight;
    const n=Math.round(Math.min(70,w*h/22000));pts=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};
  size();addEventListener('resize',size);
  addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
  document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run)frame()});
  const frame=()=>{if(!run)return;ctx.clearRect(0,0,w,h);
    const col=getComputedStyle(root).getPropertyValue('--accent').trim()||'#2a56e0';ctx.fillStyle=col;ctx.strokeStyle=col;
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<120){p.x+=dx/d*1.2;p.y+=dy/d*1.2}
      ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,6.283);ctx.fill()}
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<130){ctx.globalAlpha=(1-d/130)*.35;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    requestAnimationFrame(frame)};
  frame();
})();

// ---------- Run main()
const lines=['> javac Developer.java','> java Developer','Hello, I am Sravanth Kumar Reddy.','CGPA: 8.54 | Problems solved: 150+','Ready to build. Open to internships.'];
let busy=false;
$('#run').onclick=async()=>{if(busy)return;busy=true;const o=$('#out');o.textContent='';
  for(const l of lines){for(const ch of l){o.textContent+=ch;await sleep(l[0]==='>'?22:12)}o.textContent+='\n';await sleep(260)}
  busy=false};

// ---------- Project filter and details
$$('.chip').forEach(b=>b.onclick=()=>{$$('.chip').forEach(c=>{c.classList.toggle('active',c===b)});let shown=0;
  $$('.project').forEach(p=>{const ok=b.dataset.f==='all'||p.dataset.tags.split(' ').includes(b.dataset.f);p.hidden=!ok;if(ok){shown++;p.classList.remove('pop');void p.offsetWidth;p.classList.add('pop')}});
  $('#empty').hidden=shown>0});
$$('.toggle').forEach(b=>b.onclick=()=>{const m=$('.more',b.parentElement),open=m.hidden;m.hidden=!open;b.textContent=open?'Hide details':'Show details';b.setAttribute('aria-expanded',open)});

// ---------- Skills tabs
const skills={lang:['Java','C'],web:['HTML','CSS','JavaScript','React.js','REST APIs','JSON'],data:['SQL','MySQL','JDBC'],core:['Object-Oriented Programming','Data Structures and Algorithms','Problem solving','Teamwork'],tools:['Git','GitHub','VS Code','Postman','Apache Tomcat']};
const show=k=>{const p=$('#skill-panel');p.innerHTML='';skills[k].forEach((s,i)=>{const e=document.createElement('span');e.textContent=s;e.style.animationDelay=(reduce?0:i*55)+'ms';p.appendChild(e)})};
const tabs=$$('.tab');
const pick=t=>{tabs.forEach(x=>{const on=x===t;x.classList.toggle('active',on);x.setAttribute('aria-selected',on)});show(t.dataset.t)};
tabs.forEach(t=>t.onclick=()=>pick(t));
$('.tabs').addEventListener('keydown',e=>{const i=tabs.indexOf(document.activeElement);if(i<0)return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];n.focus();pick(n);e.preventDefault()}});
show('lang');

// ---------- Count-up stats
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
  const el=e.target,end=+el.dataset.count,d=+(el.dataset.dec||0),suf=el.dataset.suffix||'',t0=performance.now();
  const step=t=>{const k=reduce?1:Math.min((t-t0)/1100,1),ease=1-Math.pow(1-k,3);el.textContent=(end*ease).toFixed(d)+(k===1?suf:'');if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.6});
$$('[data-count]').forEach(el=>io.observe(el));

// ---------- Copy buttons
$$('.copy').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('Copied: '+b.dataset.copy)}catch(e){toast('Copy failed. Select the text instead.')}});

// ---------- Contact form: opens the visitor's email app (no backend needed)
const fn=$('#f-name'),fm=$('#f-mail'),fg=$('#f-msg'),err=$('#f-err');
fg.addEventListener('input',()=>{$('#cnt').textContent=fg.value.length});
[fn,fm,fg].forEach(i=>i.addEventListener('input',()=>i.classList.remove('bad')));
$('#send').onclick=()=>{const n=fn.value.trim(),m=fm.value.trim(),g=fg.value.trim();
  const okMail=/^\S+@\S+\.\S+$/.test(m);
  fn.classList.toggle('bad',!n);fm.classList.toggle('bad',!okMail);fg.classList.toggle('bad',!g);
  if(!n||!okMail||!g){err.textContent='Enter your name, a valid email and a message.';return}
  err.textContent='';toast('Opening your email app…');
  location.href='mailto:thappetasravanth@gmail.com?subject='+encodeURIComponent('Portfolio message from '+n)+'&body='+encodeURIComponent(g+'\n\nFrom: '+n+' ('+m+')')};
$('#yr').textContent=new Date().getFullYear();
})();
