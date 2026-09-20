const stages=[
["OBSERVE","Look before proposing. Site, people, context, evidence and constraints become the first material."],
["MAP","Make relationships visible. Geography, movement, capital, infrastructure and behaviour become legible."],
["UNDERSTAND","Find the forces underneath the visible problem and identify what the brief is really asking."],
["QUESTION","Challenge assumptions, boundaries and inherited answers before committing to form."],
["DESIGN","Turn understanding into an intervention with a clear argument."],
["TEST","Model consequences, expose weak assumptions and iterate before reality does it for us."],
["BUILD / ADVISE","Equip the client and specialist teams to act with coherent documentation and decisions."],
["OBSERVE AGAIN","Return to the field. The work changes the system, so the system becomes evidence for what comes next."]
];

const projects=[
{location:"LAGOS · CIVIC",title:"Lagos Civic Exchange",body:"A civic and mobility system studied as one urban condition. The engagement looks beyond the visible public-space brief to movement, access, programme, surrounding commerce and the behaviours those systems produce.",question:"How does a civic place work when movement is treated as part of the architecture?",method:"Observe · Map · Understand · Design · Test"},
{location:"ABA · INDUSTRIAL",title:"Aba Production City",body:"An industrial growth question approached through production networks, labour, logistics, movement and place. The project treats the production ecosystem as the subject rather than the building alone.",question:"What infrastructure does a production city actually need to keep producing?",method:"Map · Understand · Question · Design · Test"},
{location:"MAKOKO · WATER EDGE",title:"Water Edge Study",body:"A water-edge investigation that treats the shoreline as a living system. Settlement, access, ecology, livelihoods and development pressure are considered together.",question:"Where does the project boundary end when the water keeps moving?",method:"Observe · Map · Question · Test · Observe Again"},
{location:"LEKKI · LOGISTICS",title:"Logistics & Coastal Plan",body:"A systems study connecting freight, access, coastal conditions and development pressure. The work explores how infrastructure decisions compound across a growing territory.",question:"What happens when logistics, coastline and development are planned as separate systems?",method:"Observe · Map · Understand · Model · Advise"}
];

const stageNo=document.querySelector("#stageNo");
const stageTitle=document.querySelector("#stageTitle");
const stageText=document.querySelector("#stageText");
const stepEls=[...document.querySelectorAll(".step")];

function setStage(index){
  const stage=stages[index];
  if(!stage) return;
  stageNo.textContent=String(index+1).padStart(2,"0");
  stageTitle.textContent=stage[0];
  stageText.textContent=stage[1];
  stepEls.forEach((el,i)=>el.classList.toggle("is-active",i===index));
}

if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) setStage(Number(entry.target.dataset.stage));
    });
  },{rootMargin:"-35% 0px -45% 0px",threshold:0});
  stepEls.forEach(el=>observer.observe(el));
}else{
  stepEls.forEach((el,i)=>el.addEventListener("mouseenter",()=>setStage(i)));
}

const nav=document.querySelector("[data-nav]");
addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30),{passive:true});

const menuToggle=document.querySelector(".menu-toggle");
const primaryNav=document.querySelector("#primary-nav");
menuToggle?.addEventListener("click",()=>{
  const open=primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded",String(open));
});
primaryNav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  primaryNav.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded","false");
}));

const dossier=document.querySelector("#dossier");
const dTitle=document.querySelector("#dTitle");
const dBody=document.querySelector("#dBody");
const dLocation=document.querySelector("#dLocation");
const dQuestion=document.querySelector("#dQuestion");
const dMethod=document.querySelector("#dMethod");
const closeButton=dossier?.querySelector(".close");
let lastTrigger=null;

document.querySelectorAll(".card").forEach(button=>{
  button.addEventListener("click",()=>{
    const project=projects[Number(button.dataset.project)];
    if(!project||!dossier) return;
    lastTrigger=button;
    dLocation.textContent=project.location;
    dTitle.textContent=project.title;
    dBody.textContent=project.body;
    dQuestion.textContent=project.question;
    dMethod.textContent=project.method;
    dossier.showModal();
  });
});
closeButton?.addEventListener("click",()=>dossier.close());
dossier?.addEventListener("close",()=>lastTrigger?.focus());
dossier?.addEventListener("click",event=>{
  if(event.target===dossier) dossier.close();
});

const routeCopy={
"We have an ambition.":"Bring us the ambition before it becomes a fixed solution. We can help clarify the system, the questions and the work required.",
"We have a site.":"A site is more than a boundary. Tell us what you know about it and what you are considering, and we can begin from context.",
"We have a project in motion.":"Bring the current state, the assumptions and the points of friction. The next useful step may be design, research, testing or independent advice.",
"We have a question.":"Good. Questions are often where useful work begins. Tell us what you are trying to understand.",
"We need an independent view.":"Bring the decision you are trying to make and the evidence you already have. Independence starts with a clear question.",
"We want to collaborate.":"Tell us what you are building, researching or convening and where another discipline could make the work stronger."
};
const routeResponse=document.querySelector("#routeResponse");
const routeTitle=document.querySelector("#routeTitle");
const routeText=document.querySelector("#routeText");
const resetRoute=document.querySelector("#resetRoute");

document.querySelectorAll("[data-route]").forEach(button=>{
  button.addEventListener("click",()=>{
    const route=button.dataset.route;
    routeTitle.textContent=route;
    routeText.textContent=routeCopy[route]||"Start with the problem. We can work from there.";
    routeResponse.hidden=false;
    document.querySelectorAll("[data-route]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    routeResponse.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
  });
});
resetRoute?.addEventListener("click",()=>{
  routeResponse.hidden=true;
  document.querySelectorAll("[data-route]").forEach(b=>b.removeAttribute("aria-pressed"));
});

const sectionLinks=[...document.querySelectorAll('.nav nav a[href^="#"]')];
const sections=sectionLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
if("IntersectionObserver" in window){
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        sectionLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")===`#${entry.target.id}`));
      }
    });
  },{rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section=>sectionObserver.observe(section));
}

function initCity(){
  if(!window.THREE||matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host=document.querySelector("#city");
  if(!host) return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));
  renderer.setSize(innerWidth,innerHeight);
  host.appendChild(renderer.domElement);
  camera.position.set(0,5.8,14);

  const cityGroup=new THREE.Group();
  const material=new THREE.MeshBasicMaterial({color:0xc6a15b,wireframe:true,transparent:true,opacity:.18});
  for(let i=0;i<70;i++){
    const h=.35+Math.random()*3.8;
    const w=.3+Math.random()*1;
    const d=.3+Math.random()*1;
    const building=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    building.position.set((Math.random()-.5)*20,h/2-2.2,(Math.random()-.5)*15);
    cityGroup.add(building);
  }
  scene.add(cityGroup);
  const grid=new THREE.GridHelper(24,24,0xc6a15b,0x332f27);
  grid.position.y=-2.2;
  scene.add(grid);

  let pointerX=0,pointerY=0;
  addEventListener("pointermove",event=>{
    pointerX=(event.clientX/innerWidth-.5);
    pointerY=(event.clientY/innerHeight-.5);
  },{passive:true});

  let targetState=0;
  const onScroll=()=>{
    targetState=Math.min(1,Math.max(0,scrollY/(document.documentElement.scrollHeight-innerHeight)));
  };
  addEventListener("scroll",onScroll,{passive:true});
  onScroll();

  let rafId=0;
  const render=time=>{
    const t=time*.00025;
    cityGroup.rotation.y+=(pointerX*.12-cityGroup.rotation.y)*.025;
    cityGroup.rotation.x+=(pointerY*.035-cityGroup.rotation.x)*.025;
    cityGroup.position.y=Math.sin(t)*.12;
    const reveal=.45+targetState*.55;
    cityGroup.scale.setScalar(reveal);
    grid.material.opacity=.10+targetState*.16;
    renderer.render(scene,camera);
    rafId=requestAnimationFrame(render);
  };
  rafId=requestAnimationFrame(render);

  addEventListener("resize",()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));
    renderer.setSize(innerWidth,innerHeight);
  });

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){cancelAnimationFrame(rafId);}
    else{rafId=requestAnimationFrame(render);}
  });
}
if(document.readyState==="loading") addEventListener("DOMContentLoaded",initCity);
else initCity();
