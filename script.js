document.addEventListener("DOMContentLoaded",()=>{
const $=id=>document.getElementById(id);
const loadingScreen=$("loading-screen"),world=$("world"),sunflowerField=$("sunflower-field"),
  interactiveGarden=$("interactive-garden"),flowerCount=$("flower-count"),flowerTotal=$("flower-total"),
  flowerComplete=$("flower-complete"),tulipHeart=$("tulip-heart"),heartSection=$("heart-section"),
  heartCopy=document.querySelector(".heart-copy"),stars=$("stars"),nightFireflies=$("night-fireflies"),
  fireworksCanvas=$("fireworks"),finalSection=$("final-section"),secretButton=$("secretButton"),
  secretOverlay=$("secretOverlay"),closeSecretBtn=$("closeSecret"),memoryReveal=$("memory-reveal"),memoryText=$("memory-text");

window.addEventListener("load",()=>setTimeout(()=>loadingScreen.classList.add("loaded"),700));

const rand=(a,b)=>Math.random()*(b-a)+a, randInt=(a,b)=>Math.floor(rand(a,b+1));

document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{
  const t=document.querySelector(b.dataset.scroll); if(t) t.scrollIntoView({behavior:"smooth"});
}));

/* cursor sparkle (desktop only) */
if(window.matchMedia("(hover:hover)").matches){
  let last=0;
  window.addEventListener("pointermove",e=>{
    const now=Date.now(); if(now-last<45) return; last=now;
    const s=document.createElement("span"); s.className="spark";
    s.style.left=e.clientX+"px"; s.style.top=e.clientY+"px";
    document.body.appendChild(s); setTimeout(()=>s.remove(),700);
  });
}

/* scroll reveal */
const io=new IntersectionObserver(entries=>entries.forEach(en=>{
  if(en.isIntersecting){en.target.classList.add("in"); io.unobserve(en.target);}
}),{threshold:.35});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* sunflower builder */
function makeSunflower(cls){
  const f=document.createElement("div"); f.className=`sunflower ${cls} wind`;
  const tilt=rand(-7,7), stem=rand(-5,5), head=rand(-8,8), wd=rand(2.4,4.6);
  f.style.setProperty("--tilt",tilt+"deg"); f.style.setProperty("--stem",stem+"deg");
  f.style.setProperty("--head",head+"deg"); f.style.setProperty("--wd",wd+"s");
  f.innerHTML=`<div class="stem"></div><div class="leaf l"></div><div class="leaf r"></div>
    <div class="head">${'<div class="petal"></div>'.repeat(8)}<div class="center"></div></div>`;
  return f;
}
function buildField(){
  sunflowerField.innerHTML="";
  [{c:"back",n:26,y0:42,y1:67},{c:"middle",n:32,y0:50,y1:76},{c:"front",n:22,y0:61,y1:88}].forEach(L=>{
    for(let i=0;i<L.n;i++){
      const f=makeSunflower(L),x=rand(-4,100),y=rand(L.y0,L.y1),s=L.c==="front"?rand(.78,1.16):rand(.55,.9);
      f.style.left=x+"%"; f.style.top=y+"%"; f.style.transform=`scale(${s}) rotate(${rand(-7,7)}deg)`;
      sunflowerField.appendChild(f);
    }
  });
}
buildField();

for(let i=0;i<26;i++){
  const p=document.createElement("span"); p.className="floating-particle";
  p.style.left=rand(0,100)+"%"; p.style.top=rand(20,90)+"%";
  p.style.animationDelay=rand(0,6)+"s"; p.style.animationDuration=rand(4,8)+"s";
  world.appendChild(p);
}
function makeFireflies(container,n,night){
  container.innerHTML="";
  for(let i=0;i<n;i++){
    const f=document.createElement("span"); f.className="firefly";
    f.style.left=rand(5,95)+"%"; f.style.top=rand(35,90)+"%";
    f.style.setProperty("--mx",rand(-60,60)+"px"); f.style.setProperty("--my",rand(-60,40)+"px");
    f.style.setProperty("--du",rand(3,7)+"s"); f.style.setProperty("--dl",rand(-6,0)+"s");
    if(night) f.style.opacity=".7";
    container.appendChild(f);
  }
}
makeFireflies($("fireflies"),32); makeFireflies(nightFireflies,22,true);

const butterflies=$("butterflies");
for(let i=0;i<4;i++){
  const b=document.createElement("span"); b.className="butterfly"; b.textContent="🦋";
  b.style.left=rand(10,90)+"%"; b.style.top=rand(22,65)+"%";
  b.style.setProperty("--mx",rand(-100,100)+"px"); b.style.setProperty("--my",rand(-50,50)+"px");
  b.style.setProperty("--du",rand(5,9)+"s"); b.style.animationDelay=rand(-6,0)+"s";
  butterflies.appendChild(b);
}

/* interactive sunflowers */
const flowerMessages=["A little sunshine for you.","You found one 🌻","I hope you're smiling.","This one's for you.","Keep going...","Almost there.","One small flower at a time."];
let found=0; const total=5; flowerTotal.textContent=total;
const positions=[{x:19,y:56},{x:37,y:47},{x:54,y:61},{x:71,y:49},{x:83,y:60}];
positions.forEach((pos,index)=>{
  const f=makeSunflower("interactive-flower");
  f.style.left=pos.x+"%"; f.style.top=pos.y+"%"; f.style.setProperty("--tilt",rand(-7,7)+"deg");
  f.addEventListener("click",e=>{
    if(f.classList.contains("found")) return;
    f.classList.add("found"); found++; flowerCount.textContent=found;
    burst(e.clientX,e.clientY); message(e.clientX,e.clientY,flowerMessages[index%flowerMessages.length]);
    if(found>=total) flowerComplete.classList.add("show");
  });
  interactiveGarden.appendChild(f);
});
function burst(x,y){
  for(let i=0;i<5;i++){
    const p=document.createElement("span"); p.className="flower-burst"; p.textContent="✦";
    p.style.left=(x+rand(-25,25))+"px"; p.style.top=(y+rand(-10,10))+"px"; p.style.animationDelay=(i*.05)+"s";
    document.body.appendChild(p); setTimeout(()=>p.remove(),1200);
  }
}
function message(x,y,msg){
  const p=document.createElement("div"); p.className="flower-message"; p.textContent=msg;
  p.style.left=x+"px"; p.style.top=y+"px"; document.body.appendChild(p); setTimeout(()=>p.remove(),1900);
}

/* memory notes */
const memoryMessages={"note-one":"Sometimes a random laugh can become one of the nicest parts of a day.",
  "note-two":"Late conversations have a funny way of becoming memories.",
  "note-three":"Even the smallest updates can make someone feel a little closer.",
  "note-four":"Sometimes simply being there is already enough."};
document.querySelectorAll(".memory-note").forEach(n=>n.addEventListener("click",()=>{
  const key=[...n.classList].find(c=>c.startsWith("note-"));
  memoryText.textContent=memoryMessages[key]||"Some things are better remembered than explained.";
  memoryReveal.classList.add("show");
}));
document.querySelector(".close-memory").addEventListener("click",()=>memoryReveal.classList.remove("show"));
memoryReveal.addEventListener("click",e=>{if(e.target===memoryReveal) memoryReveal.classList.remove("show");});

/* tulip heart */
function makeTulip(x,y){
  const t=document.createElement("div"); t.className="tulip";
  t.style.left=x+"%"; t.style.top=y+"%";
  t.style.setProperty("--tt",rand(-10,10)+"deg"); t.style.setProperty("--sa",rand(-7,7)+"deg");
  t.innerHTML=`<div class="tflower"></div><div class="tstem"></div><div class="tleaf l"></div><div class="tleaf r"></div>`;
  return t;
}
function buildHeart(){
  tulipHeart.innerHTML="";
  const outerCount=window.innerWidth<700?54:72, points=[];
  for(let i=0;i<outerCount;i++){
    const t=(Math.PI*2*i)/outerCount;
    const rx=16*Math.pow(Math.sin(t),3);
    const ry=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    points.push({x:50+rx*2.35,y:51-ry*2.1});
  }
  [[31,39],[39,33],[50,30],[61,33],[69,39],[34,48],[43,43],[57,43],[66,48],[39,57],[61,57],[45,65],[55,65]]
    .forEach(p=>points.push({x:p[0],y:p[1]}));
  points.sort((a,b)=>a.y-b.y);
  points.forEach(pt=>{const t=makeTulip(pt.x,pt.y); t.style.zIndex=Math.round(pt.y); tulipHeart.appendChild(t);});
  const g=document.createElement("div"); g.className="heart-ground"; tulipHeart.appendChild(g);
}
buildHeart();

function updateHeartProgress(){
  const rect=heartSection.getBoundingClientRect(), vh=window.innerHeight;
  const start=vh*.85, end=vh*.15;
  let progress=(start-rect.top)/(start-end); progress=Math.max(0,Math.min(1,progress));
  const tulips=tulipHeart.querySelectorAll(".tulip");
  const visibleCount=Math.floor(progress*tulips.length);
  tulips.forEach((t,i)=>t.classList.toggle("visible",i<visibleCount));
  heartCopy.classList.toggle("hide",progress>.18);
  heartSection.classList.toggle("complete",progress>=.92);
}

/* stars */
function makeStars(container,n){
  container.innerHTML="";
  for(let i=0;i<n;i++){
    const s=document.createElement("span"); s.className="star";
    s.style.left=rand(0,100)+"%"; s.style.top=rand(0,100)+"%";
    s.style.setProperty("--du",rand(2,5)+"s"); s.style.animationDelay=rand(-5,0)+"s";
    container.appendChild(s);
  }
}
makeStars(stars,100);
makeStars($("secret-stars"),80);
(function secretPetals(){
  const c=$("secret-petals");
  for(let i=0;i<22;i++){
    const p=document.createElement("span"); p.className="secret-petal";
    p.style.left=rand(0,100)+"%"; p.style.setProperty("--du",rand(7,14)+"s");
    p.style.setProperty("--dl",rand(-14,0)+"s"); p.style.setProperty("--mx",rand(-150,150)+"px");
    c.appendChild(p);
  }
})();

secretButton.addEventListener("click",()=>{secretOverlay.classList.add("open"); document.body.style.overflow="hidden";});
function closeSecret(){secretOverlay.classList.remove("open"); document.body.style.overflow="";}
closeSecretBtn.addEventListener("click",closeSecret);
secretOverlay.addEventListener("click",e=>{if(e.target===secretOverlay) closeSecret();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&secretOverlay.classList.contains("open")) closeSecret();});

/* parallax + heart progress */
let ticking=false;
function tick(){
  const sy=window.scrollY, sun=$("sun"), mountains=document.querySelector(".mountains");
  if(sun) sun.style.transform=`translateY(${sy*.08}px)`;
  if(mountains) mountains.style.transform=`translateY(${sy*.025}px)`;
  document.querySelectorAll(".cloud").forEach((c,i)=>c.style.transform=`translateX(${sy*(.01+i*.006)}px)`);
  updateHeartProgress(); ticking=false;
}
window.addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(tick); ticking=true;}},{passive:true});

/* fireworks — multicolor */
const ctx=fireworksCanvas.getContext("2d");
let started=false; const rockets=[], parts=[];
const palette=["255,214,90","239,143,166","135,206,235","255,180,220","200,180,255"];
function resize(){fireworksCanvas.width=innerWidth; fireworksCanvas.height=innerHeight;}
resize(); window.addEventListener("resize",resize);
class Rocket{
  constructor(tx,ty){this.x=rand(innerWidth*.2,innerWidth*.8); this.y=innerHeight+20; this.tx=tx; this.ty=ty;
    this.speed=rand(5,8); this.trail=[]; this.color=palette[randInt(0,palette.length-1)];}
  update(){this.trail.push({x:this.x,y:this.y}); if(this.trail.length>10) this.trail.shift();
    const dx=this.tx-this.x, dy=this.ty-this.y, d=Math.hypot(dx,dy);
    if(d<10){explode(this.tx,this.ty,this.color); return false;}
    this.x+=(dx/d)*this.speed; this.y+=(dy/d)*this.speed; return true;}
  draw(){ctx.beginPath(); ctx.moveTo(this.x,this.y);
    const p=this.trail[Math.max(0,this.trail.length-2)]; if(p) ctx.lineTo(p.x,p.y);
    ctx.strokeStyle=`rgba(${this.color},.85)`; ctx.lineWidth=2; ctx.stroke();}
}
class Spark{
  constructor(x,y,color){const a=rand(0,Math.PI*2), sp=rand(1,6);
    this.x=x; this.y=y; this.vx=Math.cos(a)*sp; this.vy=Math.sin(a)*sp;
    this.life=rand(55,100); this.maxLife=this.life; this.size=rand(1,2.7); this.color=color;}
  update(){this.x+=this.vx; this.y+=this.vy; this.vy+=.035; this.vx*=.985; this.vy*=.985; this.life--; return this.life>0;}
  draw(){const a=this.life/this.maxLife; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.color},${a})`; ctx.fill();}
}
function explode(x,y,color){for(let i=0;i<randInt(35,65);i++) parts.push(new Spark(x,y,color));}
function launch(){rockets.push(new Rocket(rand(innerWidth*.15,innerWidth*.85),rand(innerHeight*.12,innerHeight*.52)));}
function animate(){
  ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
  for(let i=rockets.length-1;i>=0;i--){const r=rockets[i]; const alive=r.update(); r.draw(); if(!alive) rockets.splice(i,1);}
  for(let i=parts.length-1;i>=0;i--){const p=parts[i]; const alive=p.update(); p.draw(); if(!alive) parts.splice(i,1);}
  requestAnimationFrame(animate);
}
animate();
function startFireworks(){
  if(started) return; started=true; let c=0;
  const iv=setInterval(()=>{launch(); c++; if(c>=12) clearInterval(iv);},650);
}
function checkFinal(){
  const rect=finalSection.getBoundingClientRect();
  if(rect.top<innerHeight*.65) startFireworks();
}
window.addEventListener("scroll",checkFinal,{passive:true});
finalSection.addEventListener("click",e=>{
  const rect=finalSection.getBoundingClientRect();
  explode(e.clientX,e.clientY-rect.top,palette[randInt(0,palette.length-1)]);
});

tick(); checkFinal();
});
