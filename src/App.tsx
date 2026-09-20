import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { projects, routeCopy, stages, type Project } from "./data";

const navItems = [
  ["Work", "work"],
  ["Thinking", "thinking"],
  ["Method", "method"],
  ["House", "house"]
] as const;

function CityScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);
    camera.position.set(0, 5.8, 14);

    const cityGroup = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0xc6a15b, wireframe: true, transparent: true, opacity: 0.18 });

    for (let i = 0; i < 70; i += 1) {
      const height = 0.35 + Math.random() * 3.8;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(0.3 + Math.random(), height, 0.3 + Math.random()),
        material
      );
      building.position.set((Math.random() - 0.5) * 20, height / 2 - 2.2, (Math.random() - 0.5) * 15);
      cityGroup.add(building);
    }

    scene.add(cityGroup);
    const grid = new THREE.GridHelper(24, 24, 0xc6a15b, 0x332f27);
    grid.position.y = -2.2;
    scene.add(grid);

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
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
      renderer.setSize(innerWidth, innerHeight);
    };
    const render = (time: number) => {
      const t = time * 0.00025;
      cityGroup.rotation.y += (pointerX * 0.12 - cityGroup.rotation.y) * 0.025;
      cityGroup.rotation.x += (pointerY * 0.035 - cityGroup.rotation.x) * 0.025;
      cityGroup.position.y = Math.sin(t) * 0.12;
      cityGroup.scale.setScalar(0.45 + targetState * 0.55);
      grid.material.opacity = 0.1 + targetState * 0.16;
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
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

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
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} aria-labelledby="dTitle" onClose={onClose}>
      <button className="close" type="button" aria-label="Close project dossier" onClick={onClose}>×</button>
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
      <CityScene />

      <header className="nav">
        <a className="brand" href="#top" onClick={closeMenu}>MERIDIAN HOUSE</a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((value) => !value)}>
          <span>Menu</span>
        </button>
        <nav id="primary-nav" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          {navItems.map(([label, id]) => (
            <a key={id} className={active === id ? "active" : ""} href={"#" + id} onClick={closeMenu}>{label}</a>
          ))}
          <a className="cta" href="#conversation" onClick={closeMenu}>Start a conversation</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">ARCHITECTURE · RESEARCH · URBAN INTELLIGENCE</p>
            <h1>Before we build the thing, we understand the system.</h1>
            <p className="lede">Meridian House studies the forces around a place before proposing what belongs there. Architecture is one part of the answer.</p>
            <a className="scroll" href="#arrival"><span aria-hidden="true">↓</span> Enter the house</a>
          </div>
          <div className="hero-index" aria-hidden="true"><span>MH</span><span>00 / 08</span></div>
        </section>

        <section id="arrival" className="statement section-rule">
          <div className="section-meta"><p className="kicker">ARRIVAL</p><span>01</span></div>
          <div><h2>A city is not infrastructure.<br /><em>It is behaviour at scale.</em></h2><p>Every project sits inside a larger system of movement, capital, culture, technology, memory and human behaviour. We study those relationships before deciding what to change.</p></div>
        </section>

        <section id="method" className="method section-rule">
          <div className="sticky">
            <div className="section-meta"><p className="kicker">HOW WE THINK</p><span>02</span></div>
            <h2>Method is not a sequence.<br /><em>It is a loop.</em></h2>
            <div className="stage" aria-live="polite">
              <span className="stage-no">{String(stageIndex + 1).padStart(2, "0")}</span>
              <strong>{stages[stageIndex][0]}</strong>
              <p>{stages[stageIndex][1]}</p>
            </div>
            <p className="loop-note">The final step returns to the first.</p>
          </div>
          <div className="steps" aria-label="Meridian House method">
            {stages.map(([title, description], index) => (
              <article className={"step " + (stageIndex === index ? "is-active" : "")} data-stage={index} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="work section-rule">
          <div className="section-meta"><p className="kicker">SELECTED WORK · FICTIONAL PROTOTYPES</p><span>03</span></div>
          <div className="section-heading"><h2>Projects are records of decisions.</h2><p>Each case asks what was understood before the intervention was drawn.</p></div>
          <div className="cards">
            {projects.map((item, index) => (
              <button className="card" type="button" key={item.title} onClick={() => setProject(item)}>
                <span className="card-no">{String(index + 1).padStart(2, "0")}</span><small>{item.location}</small><h3>{item.title}</h3><p>{item.body}</p><span className="card-link">Open dossier <b aria-hidden="true">↗</b></span>
              </button>
            ))}
          </div>
          <p className="prototype-note">These are fictional internal case studies created for the Meridian House prototype.</p>
        </section>

        <section id="thinking" className="thinking section-rule">
          <div className="section-meta"><p className="kicker">FIELD NOTE 001</p><span>04</span></div>
          <div><blockquote>“A boundary on a map is rarely a boundary in reality.”</blockquote><div className="notes"><span>Precision is a form of care.</span><span>Growth ≠ development.</span><span>Observe again.</span></div></div>
        </section>

        <section id="house" className="house section-rule">
          <div><div className="section-meta"><p className="kicker">THE HOUSE</p><span>05</span></div><h2>Different disciplines.<br /><em>One coherent view.</em></h2><p className="discipline-line">Architecture & Spatial Design · Research · Urban Intelligence · Technology & Modelling · Strategic Planning · Advisory</p></div>
          <aside><p className="person"><strong>Dr. Amara Okafor</strong><br />Founder & Principal Strategist</p><p>Meridian House is an institutional practice. The people behind it bring architecture, research, data, technology and strategy into the same room.</p><p className="prototype-note">Institutional biography is fictional prototype content.</p></aside>
        </section>

        <section id="conversation" className="conversation section-rule">
          <div className="section-meta"><p className="kicker">BEGIN SOMEWHERE</p><span>06</span></div>
          <div><h2>What brings you here?</h2><p className="conversation-intro">There is no required starting point. Choose the sentence closest to the situation you're actually facing.</p>
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
