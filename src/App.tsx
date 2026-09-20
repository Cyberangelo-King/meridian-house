import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { projects, routeCopy, stages, type Project } from "./data";

const navItems = [
  ["Work", "work"],
  ["Thinking", "thinking"],
  ["Method", "method"],
  ["House", "house"]
] as const;

const layers = [
  ["MOVEMENT", "How people, goods and information move through a place."],
  ["WATER", "The systems that cross boundaries without respecting them."],
  ["ECONOMY", "Production, capital and the informal systems underneath growth."],
  ["MEMORY", "What a place carries forward, even after its buildings change."]
] as const;

function CityScene({ layerIndex }: { layerIndex: number }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.4));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);
    camera.position.set(0, 5.8, 14);

    const cityGroup = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xd2a85f, wireframe: true, transparent: true, opacity: 0.16 });

    for (let i = 0; i < 82; i += 1) {
      const height = 0.25 + Math.random() * 4.2;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(0.25 + Math.random() * 1.15, height, 0.25 + Math.random() * 1.15),
        material.clone()
      );
      building.position.set((Math.random() - 0.5) * 21, height / 2 - 2.25, (Math.random() - 0.5) * 15);
      cityGroup.add(building);
    }
    scene.add(cityGroup);

    const grid = new THREE.GridHelper(25, 25, 0xd2a85f, 0x3c3933);
    grid.position.y = -2.25;
    scene.add(grid);

    const lines = new THREE.Group();
    for (let i = 0; i < 8; i += 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10 + i * 2.7, -2.18, -7),
        new THREE.Vector3(-4 + i * 1.1, -1.8, 7)
      ]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x7f9ab0, transparent: true, opacity: 0.22 }));
      lines.add(line);
    }
    scene.add(lines);

    let pointerX = 0;
    let pointerY = 0;
    let targetState = 0;
    let frame = 0;

    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / innerWidth - 0.5;
      pointerY = event.clientY / innerHeight - 0.5;
    };
    const onScroll = () => {
      targetState = Math.min(1, Math.max(0, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.4));
      renderer.setSize(innerWidth, innerHeight);
    };
    const render = (time: number) => {
      const t = time * 0.00025;
      cityGroup.rotation.y += (pointerX * 0.14 + layerIndex * 0.025 - cityGroup.rotation.y) * 0.025;
      cityGroup.rotation.x += (pointerY * 0.04 - cityGroup.rotation.x) * 0.025;
      cityGroup.position.y = Math.sin(t) * 0.11;
      cityGroup.scale.setScalar(0.44 + targetState * 0.58);
      lines.rotation.y += (pointerX * 0.06 - lines.rotation.y) * 0.02;
      lines.children.forEach((line, index) => {
        line.position.y = Math.sin(t * 2 + index) * 0.03 * (layerIndex + 1);
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(render);
    };

    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onPointer);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      cityGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((item) => item.dispose());
          else object.material.dispose();
        }
      });
      lines.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [layerIndex]);

  return <div id="city" ref={hostRef} aria-hidden="true" />;
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => { event.preventDefault(); onClose(); };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} aria-labelledby="dTitle" onClose={onClose}>
      <button className="close" type="button" aria-label="Close project dossier" onClick={onClose}>×</button>
      <div className="dossier-visual" aria-hidden="true"><span>{project?.location ?? "MERIDIAN"}</span><b>FIELD / {project ? "03" : "00"}</b></div>
      <p className="kicker">PROJECT DOSSIER</p>
      {project && (
        <>
          <p className="dossier-location">{project.location}</p>
          <h2 id="dTitle">{project.title}</h2>
          <p id="dBody">{project.body}</p>
          <div className="dossier-grid">
            <div><span>QUESTION</span><strong>{project.question}</strong></div>
            <div><span>METHOD</span><strong>{project.method}</strong></div>
          </div>
        </>
      )}
      <p className="mono">FICTIONAL CASE STUDY · INTERNAL PROTOTYPE</p>
    </dialog>
  );
}

export default function App() {
  const [active, setActive] = useState("work");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const [layerIndex, setLayerIndex] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section!));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const steps = [...document.querySelectorAll<HTMLElement>(".step")];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setStageIndex(Number((entry.target as HTMLElement).dataset.stage ?? 0))),
      { rootMargin: "-35% 0px -45% 0px" }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".nav");
    const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 30);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <CityScene layerIndex={layerIndex} />

      <header className="nav">
        <a className="brand" href="#top" onClick={closeMenu}>MERIDIAN HOUSE</a>
        <div className="nav-status" aria-hidden="true"><span className="status-dot" /> LAGOS / FIELD MODE</div>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((value) => !value)}><span>Menu</span></button>
        <nav id="primary-nav" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          {navItems.map(([label, id]) => <a key={id} className={active === id ? "active" : ""} href={"#" + id} onClick={closeMenu}>{label}</a>)}
          <a className="cta" href="#conversation" onClick={closeMenu}>Start a conversation</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">ARCHITECTURE · RESEARCH · URBAN INTELLIGENCE</p>
            <h1>Before we build the thing, <span>we understand the system.</span></h1>
            <p className="lede">Meridian House studies the forces around a place before proposing what belongs there. Architecture is one part of the answer.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#arrival" onClick={() => setEntered(true)}>Enter the house <span>↘</span></a>
              <button className="button button-quiet" type="button" onClick={() => document.getElementById("layers")?.scrollIntoView({ behavior: "smooth" })}>Explore the city <span>⌁</span></button>
            </div>
          </div>
          <div className={"hero-index " + (entered ? "is-entered" : "")} aria-hidden="true">
            <span>MH / 00</span><i /><span>06.5244° N</span><span>03.3792° E</span>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>THE</span><strong>HOUSE</strong><small>OF SYSTEMS</small></div>
        </section>

        <section id="arrival" className="statement section-rule">
          <div className="section-meta"><p className="kicker">ARRIVAL</p><span>01</span></div>
          <div><p className="overline">A DIFFERENT STARTING POINT</p><h2>A city is not infrastructure.<br /><em>It is behaviour at scale.</em></h2><p>Every project sits inside a larger system of movement, capital, culture, technology, memory and human behaviour. We study those relationships before deciding what to change.</p></div>
        </section>

        <section className="story section-rule" aria-labelledby="story-title">
          <div className="story-rail" aria-hidden="true">
            <span className="kicker">THE MERIDIAN IDEA</span>
            <div className="story-line"><i /></div>
            <span>02 → 04</span>
          </div>
          <div className="story-scenes">
            <article className="story-scene scene-place">
              <span className="scene-index">01 / PLACE</span>
              <h2 id="story-title">Every project<br /><em>starts somewhere.</em></h2>
              <p>A street. A shoreline. A district. A piece of land. But the visible place is only the surface.</p>
              <div className="scene-mark mark-orbit" aria-hidden="true"><i /><b /></div>
            </article>
            <article className="story-scene scene-system">
              <span className="scene-index">02 / SYSTEM</span>
              <h2>Underneath it,<br /><em>everything is moving.</em></h2>
              <p>People move. Water moves. Money moves. Information moves. Memory moves. The project enters that motion.</p>
              <div className="scene-mark mark-grid" aria-hidden="true"><i /><i /><i /><i /><b /></div>
            </article>
            <article className="story-scene scene-question">
              <span className="scene-index">03 / QUESTION</span>
              <h2>So we ask<br /><em>what is really happening?</em></h2>
              <p>Before form, there is observation. Before certainty, there is evidence. Before an answer, there is a better question.</p>
              <div className="scene-mark mark-cross" aria-hidden="true"><i /><b /></div>
            </article>
            <article className="story-scene scene-intervention">
              <span className="scene-index">04 / INTERVENTION</span>
              <h2>Then we decide<br /><em>what should change.</em></h2>
              <p>Architecture, strategy, research and intelligence become tools for making the system more legible and the next decision more precise.</p>
              <div className="scene-mark mark-field" aria-hidden="true"><i /><b /><small>OBSERVE AGAIN</small></div>
            </article>
          </div>
        </section>

        <section id="layers" className="layers section-rule">
          <div className="layers-copy">
            <div className="section-meta"><p className="kicker">READ THE CITY</p><span>02</span></div>
            <p className="overline">ONE PLACE / MANY SYSTEMS</p>
            <h2>The city changes<br /><em>when the layer changes.</em></h2>
            <p className="layer-description">{layers[layerIndex][1]}</p>
            <div className="layer-controls" role="tablist" aria-label="Urban systems">
              {layers.map(([title], index) => <button key={title} className={layerIndex === index ? "is-active" : ""} type="button" role="tab" aria-selected={layerIndex === index} onClick={() => setLayerIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span>{title}<b>↗</b></button>)}
            </div>
          </div>
          <div className="layer-art" aria-hidden="true">
            <div className={"art-grid layer-" + layerIndex}>
              <span className="art-circle" /><span className="art-route route-a" /><span className="art-route route-b" /><span className="art-block block-a" /><span className="art-block block-b" /><span className="art-block block-c" />
              <small>MERIDIAN / URBAN FIELD</small><strong>0{layerIndex + 1}</strong>
            </div>
          </div>
        </section>

        <section className="manifesto section-rule" aria-label="Meridian House proposition">
          <p className="manifesto-small">WE DO NOT BEGIN WITH THE BUILDING.</p>
          <div className="manifesto-word" aria-hidden="true"><span>PLACE</span><span>SYSTEM</span><span>QUESTION</span><span>DECISION</span></div>
          <p className="manifesto-copy">We begin with the relationships that make the building, district or intervention matter.</p>
        </section>

        <section id="method" className="method section-rule">
          <div className="sticky">
            <div className="section-meta"><p className="kicker">HOW WE THINK</p><span>03</span></div>
            <h2>Method is not a sequence.<br /><em>It is a loop.</em></h2>
            <div className="stage" aria-live="polite"><span className="stage-no">{String(stageIndex + 1).padStart(2, "0")}</span><strong>{stages[stageIndex][0]}</strong><p>{stages[stageIndex][1]}</p><div className="stage-progress" aria-hidden="true"><i style={{ width: ((stageIndex + 1) / stages.length) * 100 + "%" }} /></div></div>
            <p className="loop-note">The final step returns to the first.</p>
          </div>
          <div className="steps" aria-label="Meridian House method">
            {stages.map(([title, description], index) => <article className={"step " + (stageIndex === index ? "is-active" : "")} data-stage={index} key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section id="work" className="work section-rule">
          <div className="section-meta"><p className="kicker">SELECTED WORK · FICTIONAL PROTOTYPES</p><span>04</span></div>
          <div className="section-heading"><h2>Projects are records of decisions.</h2><p>Each case asks what was understood before the intervention was drawn.</p></div>
          <div className="project-list">
            {projects.map((item, index) => (
              <button className="project-row" type="button" key={item.title} onClick={() => setProject(item)}>
                <span className="project-number">0{index + 1}</span><span className="project-location">{item.location}</span>
                <span className="project-title">{item.title}</span><span className="project-arrow">↗</span>
                <span className={"project-image project-image-" + index} aria-hidden="true"><i /><b>{String(index + 1).padStart(2, "0")}</b></span>
              </button>
            ))}
          </div>
          <p className="prototype-note">These are fictional internal case studies created for the Meridian House prototype.</p>
        </section>

        <section id="thinking" className="thinking section-rule">
          <div className="section-meta"><p className="kicker">FIELD NOTE 001</p><span>05</span></div>
          <div><blockquote>“A boundary on a map is rarely a boundary in reality.”</blockquote><div className="notes"><span>Precision is a form of care.</span><span>Growth ≠ development.</span><span>Observe again.</span></div></div>
        </section>

        <section id="house" className="house section-rule">
          <div><div className="section-meta"><p className="kicker">THE HOUSE</p><span>06</span></div><p className="overline">THE PEOPLE BEHIND THE VIEW</p><h2>Different disciplines.<br /><em>One coherent view.</em></h2><p className="discipline-line">Architecture & Spatial Design · Research · Urban Intelligence · Technology & Modelling · Strategic Planning · Advisory</p></div>
          <aside><div className="portrait" aria-hidden="true"><span>AO</span><i /></div><p className="person"><strong>Dr. Amara Okafor</strong><br />Founder & Principal Strategist</p><p>Meridian House is an institutional practice. The people behind it bring architecture, research, data, technology and strategy into the same room.</p><p className="prototype-note">Institutional biography is fictional prototype content.</p></aside>
        </section>

        <section id="conversation" className="conversation section-rule">
          <div className="section-meta"><p className="kicker">BEGIN SOMEWHERE</p><span>07</span></div>
          <div><p className="overline">THE NEXT QUESTION</p><h2>What brings you here?</h2><p className="conversation-intro">There is no required starting point. Choose the sentence closest to the situation you're actually facing.</p>
            <div className="routes">{Object.keys(routeCopy).map((item) => <button key={item} type="button" aria-pressed={route === item} onClick={() => setRoute(item)}>{item}<span aria-hidden="true">→</span></button>)}</div>
            {route && <div className="route-response" aria-live="polite"><span className="kicker">SELECTED ROUTE</span><strong>{route}</strong><p>{routeCopy[route]}</p><button className="text-button" type="button" onClick={() => setRoute(null)}>Choose another route</button></div>}
          </div>
        </section>
      </main>

      <footer className="footer"><span>MERIDIAN HOUSE</span><span>ARCHITECTURE · RESEARCH · URBAN INTELLIGENCE</span><span>PROTOTYPE / 2026</span></footer>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
      <noscript><div className="noscript">JavaScript is disabled. The immersive experience requires JavaScript.</div></noscript>
    </>
  );
}
