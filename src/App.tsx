import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Compass, MoveUpRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createGuidance, type ProblemKind } from './engine';

gsap.registerPlugin(ScrollTrigger);
const chapters = [
  { n: '01', title: 'Name the knot', sub: 'Start where you are.', tone: 'one' },
  { n: '02', title: 'See what matters', sub: 'Separate the signal from the noise.', tone: 'two' },
  { n: '03', title: 'Find your leverage', sub: 'Notice what is yours to influence.', tone: 'three' },
  { n: '04', title: 'Try a new angle', sub: 'A small experiment creates movement.', tone: 'four' },
];

function App() {
  const root = useRef<HTMLDivElement>(null);
  const [problem, setProblem] = useState('');
  const [kind, setKind] = useState<ProblemKind>('stuck');
  const [impact, setImpact] = useState('medium');
  const [control, setControl] = useState('some');
  const [showResult, setShowResult] = useState(false);
  const [galleryStep, setGalleryStep] = useState(1);
  const result = createGuidance({ problem, kind, impact, control });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mobile = window.matchMedia('(max-width: 800px)').matches;
      if (reduced) return;
      gsap.to('.hero-orb', { yPercent: 26, scale: 1.18, rotate: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-copy', { y: 110, opacity: 0.18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo('.reveal', { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: '.reveal-zone', start: 'top 72%' } });
      if (!mobile) gsap.to('.gallery-track', { xPercent: -75, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top top', end: '+=2200', pin: true, scrub: 1, snap: 1 / 3, invalidateOnRefresh: true, onUpdate: self => setGalleryStep(Math.min(4, Math.floor(self.progress * 4) + 1)) } });
      gsap.utils.toArray<HTMLElement>('.tunnel-card').forEach((card, index) => gsap.fromTo(card, { z: -500, rotateY: index % 2 ? 22 : -22, opacity: 0, scale: 0.65 }, { z: 0, rotateY: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 38%', scrub: true } }));
      gsap.fromTo('.final-orbit', { scale: 0.52, rotate: -24, opacity: 0.35 }, { scale: 1, rotate: 0, opacity: 1, scrollTrigger: { trigger: '.closing', start: 'top 80%', end: 'center center', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll', String(range > 0 ? window.scrollY / range : 0));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
  }, []);

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  return <div ref={root}>
    <div className="progress" aria-hidden="true"><span /></div>
    <header className="nav"><a href="#top" className="brand"><span className="brand-mark"><Compass size={16} /></span> clarity<span className="brand-light">engine</span></a><a className="nav-link" href="#method">The method <ArrowUpRight size={14} /></a><button className="nav-cta" onClick={() => goTo('workshop')}>Find my next step <ArrowRight size={14} /></button></header>

    <main id="top">
      <section className="hero scene">
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> A calmer way through the hard part</p>
          <h1>Make room<br />for <em>clarity.</em></h1>
          <p className="hero-intro">When everything feels tangled, the next step doesn’t have to. Bring the problem as it is. Leave with a way forward.</p>
          <button className="button bright" onClick={() => goTo('workshop')}>Untangle a problem <ArrowRight size={16} /></button>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-orb"><div className="orb-core"/><span className="orb-line"/><span className="orb-line second"/></div><div className="hero-label label-top">PAUSE / NOTICE</div><div className="hero-label label-bottom">A LITTLE MORE SPACE</div><span className="spark spark-a">✳</span><span className="spark spark-b">✳</span></div>
        <div className="hero-bottom"><span>01 — A place to begin</span><button onClick={() => goTo('reveal')} aria-label="Scroll to explore"><ArrowDown size={16} /></button><span>SCROLL TO FIND YOUR THREAD</span></div>
        <div className="hero-index">CE—01</div>
      </section>

      <section className="reveal scene" id="reveal">
        <div className="reveal-backdrop" aria-hidden="true"><div className="sun-disc"/><div className="horizon-line"/><div className="orbit-word">SPACE TO THINK</div></div>
        <div className="reveal-content reveal-zone"><p className="eyebrow reveal">THE MOMENT BEFORE THE MOVE</p><h2 className="reveal">You don’t need<br />the whole answer.<br /><em>Just a clear next one.</em></h2><p className="reveal reveal-note">Clarity is not a lightning strike. It’s the quiet shift that lets you see what’s actually in front of you.</p><button className="text-link reveal" onClick={() => goTo('method')}>Here’s how we get there <ArrowDown size={14}/></button></div>
        <div className="reveal-side">A guided process<br/>for real life</div>
      </section>

      <section className="method scene" id="method">
        <div className="section-heading"><p className="eyebrow">A FOUR-PART PRACTICE</p><h2>From tangled<br/>to <em>possible.</em></h2><p>Not a shortcut around complexity. A way to meet it with more intention.</p></div>
        <div className="gallery"><div className="gallery-track">{chapters.map((chapter, i) => <article className={`chapter ${chapter.tone}`} key={chapter.n}><span className="chapter-number">{chapter.n} <span>— 04</span></span><div className="chapter-art" aria-hidden="true"><div className="chapter-shape"><span>{['?', '◎', '↗', '✳'][i]}</span></div><div className="chapter-ring ring-a"/><div className="chapter-ring ring-b"/><span className="chapter-coordinate">{['START HERE', 'ZOOM IN', 'LOOK OUT', 'MOVE SMALL'][i]}</span></div><div className="chapter-copy"><h3>{chapter.title}</h3><p>{chapter.sub}</p></div></article>)}</div><div className="gallery-footer"><span>SCROLL TO MOVE THROUGH THE METHOD</span><div className="gallery-progress"><span style={{ width: `${galleryStep * 25}%` }} /></div><span>0{galleryStep}/04</span></div></div>
      </section>

      <section className="tunnel scene">
        <div className="tunnel-heading"><p className="eyebrow">A DIFFERENT KIND OF MOMENTUM</p><h2>Small moves.<br/><em>Real movement.</em></h2></div>
        <div className="tunnel-space"><article className="tunnel-card card-back"><span>01 / NOTICE</span><b>What is<br/>actually happening?</b><i>Start with what you know.</i></article><article className="tunnel-card card-mid"><span>02 / CHOOSE</span><b>What matters<br/>most right now?</b><i>Make room for your priorities.</i></article><article className="tunnel-card card-front"><span>03 / TRY</span><b>What is one<br/>thing you can test?</b><i>Progress begins with a signal.</i></article><div className="tunnel-axis"/></div>
        <p className="tunnel-caption">You don’t have to leap. You only have to make the next move visible.</p>
      </section>

      <section className="workshop scene" id="workshop">
        <div className="workshop-intro"><p className="eyebrow">YOUR CLARITY SESSION <span>· 3 MINUTES</span></p><h2>Let’s find<br/>your <em>thread.</em></h2><p>A few thoughtful questions. A practical frame. One action that belongs to you.</p><div className="privacy-note"><span className="privacy-dot"/>Your answers stay in this browser.</div></div>
        <div className="workbench">
          <div className="workbench-top"><span><Sparkles size={14}/> THE CLARITY DESK</span><span>01 — 04</span></div>
          <label htmlFor="problem">What feels tangled right now?</label><textarea id="problem" value={problem} onChange={e => { setProblem(e.target.value); setShowResult(false); }} placeholder="Put it in your own words. It doesn’t need to be polished." maxLength={500}/>
          <fieldset><legend>What kind of knot is it closest to?</legend><div className="choice-grid">{([['decision','A decision'],['overwhelm','Too much at once'],['people','A people problem'],['stuck','Feeling stuck']] as [ProblemKind,string][]).map(([value,label])=><button type="button" className={`choice ${kind===value?'selected':''}`} onClick={()=>{setKind(value);setShowResult(false)}} key={value}>{kind===value&&<Check size={13}/>} {label}</button>)}</div></fieldset>
          <div className="select-row"><label>How much is at stake?<select value={impact} onChange={e=>setImpact(e.target.value)}><option value="low">A little</option><option value="medium">A fair amount</option><option value="high">A lot</option></select></label><label>How much can you influence?<select value={control} onChange={e=>setControl(e.target.value)}><option value="little">Not much</option><option value="some">Some of it</option><option value="most">Quite a bit</option></select></label></div>
          <button className="button submit" onClick={()=>setShowResult(true)}>Get a clearer next step <ArrowRight size={15}/></button>
          {showResult&&<div className="result" aria-live="polite"><div className="result-head"><span className="result-icon"><Sparkles size={15}/></span><div><p className="eyebrow">A FRAME TO TRY ON</p><h3>{result.frame}</h3></div></div><div className="result-grid"><div><span>YOUR SMALL EXPERIMENT</span><p>{result.experiment}</p></div><div><span>START HERE</span><p>{result.firstStep}</p></div></div><p className="result-avoid"><b>One thing to watch:</b> {result.avoid}</p></div>}
          <div className="workbench-foot">NO PERFECT ANSWERS NEEDED <span>✳</span> JUST A PLACE TO BEGIN</div>
        </div>
      </section>

      <section className="closing scene">
        <div className="closing-art" aria-hidden="true"><div className="final-orbit"><span/><span/><span/></div><div className="closing-star">✳</div></div>
        <div className="closing-copy"><p className="eyebrow">ONE THING AT A TIME</p><h2>The way forward<br/>starts <em>right here.</em></h2><p>You already did the hardest part: you paused long enough to look.</p><button className="button bright" onClick={()=>{setProblem('');setShowResult(false);goTo('workshop')}}>Start again, with clarity <MoveUpRight size={15}/></button></div>
        <footer><a className="brand" href="#top"><span className="brand-mark"><Compass size={16} /></span> clarity<span className="brand-light">engine</span></a><span>MADE FOR THE MOMENTS THAT MATTER</span><button onClick={()=>goTo('top')}>BACK TO TOP ↑</button></footer>
      </section>
    </main>
  </div>;
}

export default App;
