import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Compass, Copy, Menu, MessageSquareText, MousePointer2, Sparkles, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildPrompt, getPromptScore, reviewPrompt, type PromptDetails } from './engine';
import { buildDiagnosticReport, challengeOptions, followUpFor, type DiagnosticAnswers } from './diagnostic';

gsap.registerPlugin(ScrollTrigger);
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const examples = [
  { label: 'Writing', icon: 'Aa', title: 'Make a first draft feel like you', prompt: 'Draft a welcome email for new members of a neighborhood gardening club. The audience is curious beginners, not experienced gardeners. Keep it warm, under 180 words, and include one clear next step: RSVP for the Saturday garden tour. Avoid corporate language.' },
  { label: 'Learning', icon: '∿', title: 'Understand a hard idea', prompt: 'Teach me the basics of compound interest as if I am a curious high-school student. Use one everyday example with simple numbers, explain each step, then ask me one question to check my understanding. Avoid finance jargon unless you define it.' },
  { label: 'Research', icon: '⌕', title: 'Compare options without the noise', prompt: 'Compare these three project-management tools for a five-person volunteer team. Focus on ease of use, free-plan limits, and sharing. Use a table, cite sources for current features, flag anything you cannot verify, and end with a recommendation based on those priorities.' },
  { label: 'Work', icon: '↗', title: 'Turn a messy brief into a plan', prompt: 'Turn the notes below into a practical two-week launch plan for a small product team. Group work by owner and week, show dependencies, and flag missing decisions. Do not invent dates or owners. Keep it to one page and put the three riskiest assumptions first.' },
];

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    const currentRoute = location.pathname.split('/').filter(Boolean);
    const title = location.pathname === '/' ? 'Clarity Engine — Learn to prompt with intention' : `${currentRoute[currentRoute.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} — Clarity Engine`;
    document.title = title;
  }, [location.pathname]);
  useEffect(() => {
    const update = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll', String(distance > 0 ? window.scrollY / distance : 0));
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="app-shell">
    <div className="progress" aria-hidden="true"><span /></div>
    <header className="nav">
      <Link to="/" className="brand" aria-label="Clarity Engine home"><span className="brand-mark"><Compass size={16}/></span> clarity<span className="brand-light">engine</span></Link>
      <button className="mobile-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19}/> : <Menu size={19}/>}</button>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        <NavLink to="/method">The method</NavLink><NavLink to="/examples">Prompt library</NavLink><NavLink to="/about">Our approach</NavLink>
      </nav>
      <Link className="nav-cta" to="/practice">Improve a prompt <ArrowRight size={14}/></Link>
    </header>
    <Routes>
      <Route element={<><Outlet/><SiteFooter/></>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/method" element={<MethodPage/>}/>
        <Route path="/examples" element={<ExamplesPage/>}/>
        <Route path="/practice" element={<PracticePage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  </div>;
}

function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const mobile = window.matchMedia('(max-width: 650px)').matches;
      // Deliberately different travel speeds create visible depth, not just entrance fades.
      gsap.to('.hero-orb', { yPercent: mobile ? 105 : 58, xPercent: mobile ? -12 : -5, scale: mobile ? 1.3 : 1.16, rotate: 16, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.to('.hero-art', { yPercent: mobile ? 42 : 28, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.to('.hero-copy', { y: mobile ? -100 : -70, opacity: mobile ? 0.35 : 0.6, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.fromTo('.home-reveal-item', { y: 34, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: .65, ease: 'power2.out', scrollTrigger: { trigger: '.home-reveal', start: 'top 72%', once: true } });
      gsap.to('.sun-disc', { yPercent: mobile ? -82 : -48, xPercent: mobile ? -18 : -9, scale: mobile ? 1.28 : 1.12, ease: 'none', scrollTrigger: { trigger: '.home-reveal', start: 'top bottom', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.to('.horizon-line', { xPercent: mobile ? 22 : -10, yPercent: mobile ? -35 : 0, rotate: -7, ease: 'none', scrollTrigger: { trigger: '.home-reveal', start: 'top bottom', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.to('.reveal-side', { y: mobile ? -120 : -65, ease: 'none', scrollTrigger: { trigger: '.home-reveal', start: 'top bottom', end: 'bottom top', scrub: 0.45, invalidateOnRefresh: true } });
      gsap.to('.context-bridge-intro', { yPercent: mobile ? -16 : -10, ease: 'none', scrollTrigger: { trigger: '.context-bridge', start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
      gsap.to('.context-steps', { yPercent: mobile ? 12 : 7, ease: 'none', scrollTrigger: { trigger: '.context-bridge', start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
      gsap.to('.home-example-heading', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '.home-example', start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
      gsap.fromTo('.compare-card.rough', { x: mobile ? -36 : -70, rotate: mobile ? -2 : -3, opacity: .55 }, { x: 0, rotate: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.home-example', start: 'top 85%', end: 'center center', scrub: 0.5, invalidateOnRefresh: true } });
      gsap.fromTo('.compare-card.clear', { x: mobile ? 36 : 70, rotate: mobile ? 2 : 3, opacity: .55 }, { x: 0, rotate: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.home-example', start: 'top 75%', end: 'center center', scrub: 0.5, invalidateOnRefresh: true } });
      gsap.to('.closing-art', { yPercent: mobile ? -32 : -22, rotate: mobile ? 7 : 4, ease: 'none', scrollTrigger: { trigger: '.home-cta', start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true } });
      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, []);
  const tryPrompt = (prompt: string) => navigate('/practice', { state: { prompt } });
  return <main className="page home-page">
    <section className="home-hero">
      <div className="hero-grain"/>
      <div className="hero-copy"><p className="eyebrow"><span className="status-dot"/> A practical tool for getting more useful results from AI</p><h1>Turn vague asks<br/>into <em>clear prompts.</em></h1><p className="hero-intro">Clarity Engine helps you explain what you need, add the details AI is missing, and build a clearer instruction. Learn the method, explore examples, or improve a prompt of your own.</p><div className="hero-actions"><Link className="button bright" to="/practice">Build a better prompt <ArrowRight size={16}/></Link><Link className="hero-text-link" to="/method">See the method <ArrowDown size={14}/></Link></div></div>
      <div className="hero-art prompt-art" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-orb"><div className="orb-core"/><span className="orb-line"/><span className="orb-line second"/></div><div className="hero-label label-top">INTENT → CONTEXT</div><div className="hero-label label-bottom">A BETTER QUESTION</div><span className="spark spark-a">✳</span><span className="spark spark-b">✳</span><div className="prompt-chip chip-one">“Make it clearer”</div><div className="prompt-chip chip-two">“For whom?”</div></div>
      <div className="hero-bottom"><span>LESS GUESSING / MORE SIGNAL</span><a href="#reveal" aria-label="Scroll to explore"><ArrowDown size={16}/></a><span>SCROLL TO EXPLORE</span></div><div className="hero-index">CE—01</div>
    </section>
    <section className="context-bridge" aria-labelledby="context-bridge-title">
      <div className="context-bridge-intro">
        <p className="eyebrow">SO, WHAT IS CLARITY ENGINE?</p>
        <h2 id="context-bridge-title">A practical way to<br/><em>get your point across.</em></h2>
        <p>It is a free prompt-learning workshop. You bring an idea or a rough instruction; Clarity Engine helps you spot what is missing and shape it into something more useful.</p>
        <p className="context-privacy"><Check size={14}/> Your draft stays in this browser. The current workshop uses a transparent checklist—not an AI rewrite service.</p>
      </div>
      <div className="context-steps" aria-label="How Clarity Engine works">
        <article><span>01</span><div><h3>Describe the task</h3><p>Start with what you want help with, even if it is messy.</p></div></article>
        <article><span>02</span><div><h3>Add the missing details</h3><p>Clarify context, audience, format, and boundaries that matter.</p></div></article>
        <article><span>03</span><div><h3>Build a clearer prompt</h3><p>Review the signals, create a structured version, then copy it into the AI tool you use.</p></div></article>
        <Link className="context-try-link" to="/practice">Try it with your own prompt <ArrowRight size={15}/></Link>
      </div>
    </section>
    <section className="home-reveal scene" id="reveal"><div className="reveal-backdrop" aria-hidden="true"><div className="sun-disc"/><div className="horizon-line"/><div className="orbit-word">BETTER INPUT, BETTER COLLABORATION</div></div><div className="home-reveal-zone"><p className="eyebrow home-reveal-item">THE PROMPT IS THE START OF THE CONVERSATION</p><h2 className="home-reveal-item">Less “guess what<br/>I mean.” More<br/><em>let’s make this.</em></h2><p className="home-reveal-item reveal-note">Give the model a destination, the useful details, and a shape for the answer. Then refine what comes back.</p><Link className="text-link home-reveal-item" to="/method">Explore the Clarity Loop <ArrowRight size={15}/></Link></div><div className="reveal-side">A skill you can<br/>practice anywhere</div></section>
    <section className="home-example scene"><div className="home-example-heading"><p className="eyebrow">WATCH A PROMPT GET CLEARER</p><h2>Small details.<br/><em>Different result.</em></h2><p>Move from a broad request to a brief the model can actually work with.</p></div><div className="compare-stage"><article className="compare-card rough"><span className="compare-label"><i/> THE FIRST ASK</span><p>“Write a post about our event.”</p><small>It has a topic, but no audience, purpose, or shape.</small></article><div className="compare-arrow"><span><ArrowRight size={18}/></span><b>ADD THE MISSING SIGNAL</b></div><article className="compare-card clear"><span className="compare-label"><i/> WITH INTENTION</span><p>“Write a friendly Instagram caption inviting local families to our Saturday repair café. Mention free entry, repairs for small household items, and the 10–2 time. Keep it under 80 words and end with a clear invitation.”</p><small>Same idea. A destination, context, and constraints.</small><button onClick={() => tryPrompt('Write a post about our event.')}>Try improving this prompt <ArrowUpRight size={14}/></button></article></div></section>
    <section className="home-paths scene"><div className="home-path-head"><div><p className="eyebrow">A PRACTICE, NOT A BAG OF TRICKS</p><h2>Learn it by<br/><em>using it.</em></h2></div><p>Build a mental model, see strong examples, then put your own words through the workshop.</p></div><div className="path-grid"><Link to="/method" className="path-card path-method"><span>01 / UNDERSTAND</span><BookOpen size={22}/><h3>Learn the Clarity Loop</h3><p>A reusable way to think through intent, context, direction, and output.</p><b>Explore the method <ArrowRight size={14}/></b></Link><Link to="/examples" className="path-card path-library"><span>02 / GET INSPIRED</span><MessageSquareText size={22}/><h3>Browse real examples</h3><p>See how the same prompt changes for writing, learning, research, and work.</p><b>Open the prompt library <ArrowRight size={14}/></b></Link><Link to="/practice" className="path-card path-practice"><span>03 / MAKE IT YOURS</span><MousePointer2 size={22}/><h3>Try your own prompt</h3><p>Get a useful review and shape a clearer version around your goal.</p><b>Enter the workshop <ArrowRight size={14}/></b></Link></div></section>
    <section className="home-cta scene"><div className="closing-art" aria-hidden="true"><div className="final-orbit"><span/><span/><span/></div><div className="closing-star">✳</div></div><div className="closing-copy"><p className="eyebrow">START WITH WHAT YOU HAVE</p><h2>Bring the rough<br/>draft. Leave with<br/><em>a clearer ask.</em></h2><p>No jargon to memorize. No perfect prompt required. Just a better way to work it out.</p><Link className="button bright" to="/practice">Open the prompt workshop <ArrowRight size={15}/></Link></div></section>
  </main>;
}

const loopSteps = [
  { num: '01', key: 'Intent', title: 'Name the change you want', desc: 'Say what the model should help you achieve. Lead with an action and a useful end point.', cue: 'What should be different when this is done?', glyph: '↗' },
  { num: '02', key: 'Context', title: 'Share what it can’t know', desc: 'Add the background, people, and situation that change what a good answer looks like.', cue: 'What would a capable collaborator ask you first?', glyph: '◎' },
  { num: '03', key: 'Direction', title: 'Give it a way to work', desc: 'Set a perspective, approach, or tone. A small amount of direction can prevent a generic response.', cue: 'What lens or voice will help here?', glyph: '⌁' },
  { num: '04', key: 'Output', title: 'Describe a useful answer', desc: 'Choose format, length, constraints, and how you’ll judge whether the result works.', cue: 'What should the answer look and feel like?', glyph: '▤' },
];

function PageHero({ eyebrow, title, accent, intro, mark }: {eyebrow:string;title:string;accent:string;intro:string;mark:string}) {
  return <section className={`page-hero page-hero-${mark}`}><div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}<br/><em>{accent}</em></h1><p>{intro}</p></div><div className={`page-hero-art art-${mark}`} aria-hidden="true"><span className="hero-art-mark">{mark === 'method' ? '↗' : mark === 'examples' ? 'Aa' : mark === 'about' ? '✳' : '◎'}</span><span className="page-orbit orbit-a"/><span className="page-orbit orbit-b"/><span className="page-orbit orbit-c"/><i className="art-label">CLARITY ENGINE / FIELD NOTES</i></div></section>;
}

function MethodPage() {
  return <main className="page method-page"><PageHero eyebrow="A SIMPLE FRAMEWORK, USED FLEXIBLY" title="The Clarity" accent="Loop." intro="A practical mental model for writing prompts that give AI enough to do useful work — without turning every ask into a novel." mark="method"/><section className="method-intro"><p className="eyebrow">FOUR SIGNALS TO SEND</p><h2>Think it through.<br/><em>Then write it down.</em></h2><p>These pieces can appear in any order. Some tasks need all four; simple asks may only need one or two.</p></section><section className="loop-list">{loopSteps.map((step,i)=><article className={`loop-step loop-${i+1}`} key={step.key}><div className="loop-step-index">{step.num}<span> / THE LOOP</span></div><div className="loop-glyph" aria-hidden="true">{step.glyph}</div><div className="loop-step-copy"><p className="eyebrow">{step.key.toUpperCase()}</p><h3>{step.title}</h3><p>{step.desc}</p><div className="reflection"><span>ASK YOURSELF</span><b>{step.cue}</b></div></div></article>)}</section><section className="method-notes"><div><span>THE LOOP IS A STARTING POINT</span><p>Prompting is iterative. Read the answer, notice the gap, and give the model a better next instruction.</p></div><Link className="button bright" to="/practice">Practice the loop <ArrowRight size={15}/></Link></section><IterationStrip/></main>;
}

function IterationStrip(){return <section className="iteration-strip"><p className="eyebrow">THE MOST USEFUL PROMPTS ARE OFTEN A CONVERSATION</p><div className="iteration-flow"><span>Ask</span><ArrowRight size={16}/><span>Review</span><ArrowRight size={16}/><span>Refine</span><ArrowRight size={16}/><span>Repeat</span></div><p>Tell the model what to keep, change, or rethink. Your first prompt does not need to do all the work.</p></section>}

function ExamplesPage() {
  const navigate = useNavigate();
  return <main className="page examples-page"><PageHero eyebrow="A LIBRARY OF PROMPTS WITH PURPOSE" title="See the" accent="difference." intro="Browse real starting points, notice the details doing the work, and adapt them to your own task." mark="examples"/><section className="examples-intro"><p className="eyebrow">CHOOSE A PLACE TO START</p><h2>Useful beats<br/><em>impressive.</em></h2><p>Each example names a goal, gives the model context, and asks for an answer that fits the situation.</p></section><section className="example-library">{examples.map((item,i)=><article key={item.label} className={`library-card library-${i+1}`}><div className="library-card-top"><span className="library-icon">{item.icon}</span><span>0{i+1} / {item.label.toUpperCase()}</span><button aria-label={`Use ${item.label} example`} onClick={()=>navigate('/practice',{state:{prompt:item.prompt}})}><ArrowUpRight size={16}/></button></div><h3>{item.title}</h3><div className="library-prompt"><span>THE PROMPT</span><p>{item.prompt}</p></div><div className="library-signals"><span>{i===0?'AUDIENCE · LENGTH · ACTION':i===1?'ROLE · EXAMPLE · CHECK-IN':i===2?'COMPARISON · SOURCES · UNCERTAINTY':'CONTEXT · FORMAT · BOUNDARIES'}</span><button onClick={()=>navigate('/practice',{state:{prompt:item.prompt}})}>Make it yours <ArrowRight size={14}/></button></div></article>)}</section><section className="examples-foot"><p>Have a prompt already?</p><Link to="/practice" className="button bright">Bring it to the workshop <ArrowRight size={15}/></Link></section></main>;
}

function PracticePage() {
  const location = useLocation();
  const [draft, setDraft] = useState('');
  const [details, setDetails] = useState<PromptDetails>({goal:'',context:'',audience:'',format:'',constraints:'',voice:'clear'});
  const [result, setResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState<'diagnosis' | 'workshop'>('diagnosis');
  const [questionStep, setQuestionStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({challenge:'',clarity:'',frequency:'',example:''});
  useEffect(() => {
    const prompt = (location.state as {prompt?:string}|null)?.prompt;
    if (prompt) { setDraft(prompt); setDetails(current => ({...current,goal:prompt})); setResult(false); }
  }, [location.state]);
  const checks = reviewPrompt(draft);
  const score = getPromptScore(draft);
  const improved = buildPrompt(details);
  const report = buildDiagnosticReport(answers);
  const followUp = followUpFor(answers.challenge);
  const put = (key: keyof PromptDetails, value: string) => { setDetails(current => ({...current,[key]:value})); setResult(false); };
  const copy = async () => { try { await navigator.clipboard.writeText(improved); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const beginWorkshop = () => setStage('workshop');
  return <main className="page practice-page">
    <PageHero eyebrow="THE CLARITY ENGINE DIAGNOSTIC" title="Understand the" accent="real problem." intro="Before we improve a prompt, let’s understand what is getting in the way. Your answers shape a working hypothesis—not a judgment." mark="practice"/>
    {stage === 'diagnosis' ? <>
      <section className="diagnosis-intro">
        <div><p className="eyebrow">FIRST, LET’S UNDERSTAND</p><h2>Don't treat the symptom<br/><em>before we know the cause.</em></h2></div>
        <p>Think of this like a careful check-up. We’ll look at what happens, how clearly you can identify the gap, and whether it is a recurring pattern. Then you can confirm or correct what we understood.</p>
      </section>
      <section className="diagnostic-workflow" aria-live="polite">
        <div className="diagnostic-progress"><span>DIAGNOSTIC INTERVIEW</span><div className="diagnostic-progress-track"><i style={{width: `${Math.min(100, ((questionStep + 1) / 4) * 100)}%`}}/></div><span>0{Math.min(questionStep + 1,4)} / 04</span></div>
        {questionStep === 0 && <div className="diagnostic-question">
          <p className="eyebrow">01 / THE SYMPTOM</p><h2>When you work with AI, what tends to go wrong?</h2><p className="diagnostic-support">Choose the one that feels closest. You don't need to know the reason yet.</p>
          <div className="diagnostic-options">{challengeOptions.map((option,i)=><button key={option.value} className={answers.challenge === option.value ? 'diagnostic-option selected' : 'diagnostic-option'} onClick={()=>setAnswers(current=>({...current,challenge:option.value,clarity:current.challenge === option.value ? current.clarity : ''}))} aria-pressed={answers.challenge === option.value}><span className="diagnostic-option-number">0{i+1}</span><span className="diagnostic-option-copy"><b>{option.label}</b><small>{option.detail}</small></span><span className="diagnostic-radio"/></button>)}</div>
          <div className="diagnostic-actions"><span>There are no right or wrong answers.</span><button className="button bright" disabled={!answers.challenge} onClick={()=>setQuestionStep(1)}>Continue <ArrowRight size={15}/></button></div>
        </div>}
        {questionStep === 1 && <div className="diagnostic-question">
          <p className="eyebrow">02 / YOUR AWARENESS</p><h2>{followUp.prompt}</h2><p className="diagnostic-support">This helps us distinguish a communication gap from a problem that is still hard to describe.</p>
          <div className="diagnostic-options">{followUp.options.map((option,i)=><button key={option.value} className={answers.clarity === option.value ? 'diagnostic-option selected' : 'diagnostic-option'} onClick={()=>setAnswers(current=>({...current,clarity:option.value}))} aria-pressed={answers.clarity === option.value}><span className="diagnostic-option-number">0{i+1}</span><span className="diagnostic-option-copy"><b>{option.label}</b><small>{option.detail}</small></span><span className="diagnostic-radio"/></button>)}</div>
          <div className="diagnostic-actions"><button className="text-link" onClick={()=>setQuestionStep(0)}>Back</button><button className="button bright" disabled={!answers.clarity} onClick={()=>setQuestionStep(2)}>Continue <ArrowRight size={15}/></button></div>
        </div>}
        {questionStep === 2 && <div className="diagnostic-question">
          <p className="eyebrow">03 / THE PATTERN</p><h2>How often does this happen?</h2><p className="diagnostic-support">Frequency gives us context. One difficult task does not automatically mean you have a general skill gap.</p>
          <div className="diagnostic-options">{[
            {value:'once' as const,label:'This was a one-off',detail:'It happened in one specific situation.'},
            {value:'sometimes' as const,label:'It happens sometimes',detail:'Some tasks go well; others do not.'},
            {value:'often' as const,label:'It happens often',detail:'I run into this across many tasks.'},
          ].map((option,i)=><button key={option.value} className={answers.frequency === option.value ? 'diagnostic-option selected' : 'diagnostic-option'} onClick={()=>setAnswers(current=>({...current,frequency:option.value}))} aria-pressed={answers.frequency === option.value}><span className="diagnostic-option-number">0{i+1}</span><span className="diagnostic-option-copy"><b>{option.label}</b><small>{option.detail}</small></span><span className="diagnostic-radio"/></button>)}</div>
          <label className="diagnostic-example"><span>OPTIONAL / A REAL EXAMPLE</span><textarea value={answers.example} onChange={e=>setAnswers(current=>({...current,example:e.target.value}))} placeholder="What did you ask for, what did you get, and what did you expect instead?" rows={3} maxLength={1200}/><small>A real example can help us test the hypothesis later. Please avoid sharing sensitive information.</small></label>
          <div className="diagnostic-actions"><button className="text-link" onClick={()=>setQuestionStep(1)}>Back</button><button className="button bright" disabled={!answers.frequency} onClick={()=>setQuestionStep(3)}>Review my diagnosis <ArrowRight size={15}/></button></div>
        </div>}
        {questionStep === 3 && <div className="diagnostic-report">
          <p className="eyebrow"><span className="status-dot"/> 04 / YOUR WORKING HYPOTHESIS</p><h2>{report.title}</h2><p className="diagnostic-report-lead">{report.evidence}</p>
          <div className="diagnostic-report-grid"><article><span>WHAT YOUR ANSWERS SUGGEST</span><p>{report.pattern}</p></article><article><span>WHAT WE STILL DON'T KNOW</span><p>{report.uncertainty}</p></article></div>
          {answers.example.trim() && <blockquote className="diagnostic-quote"><span>YOUR EXAMPLE</span>{answers.example}</blockquote>}
          <div className="diagnostic-focus"><span>A USEFUL NEXT STEP</span><p>{report.focus}</p></div>
          <p className="diagnostic-disclaimer">This is a transparent, rule-based hypothesis—not a psychological assessment and not a final verdict. You know your situation better than this checklist does.</p>
          <div className="diagnostic-actions"><button className="text-link" onClick={()=>setQuestionStep(0)}>That doesn't quite fit — revisit answers</button><button className="button bright" onClick={beginWorkshop}>That sounds right — continue <ArrowRight size={15}/></button></div>
        </div>}
      </section>
    </> : <>
      <section className="confirmed-diagnosis"><div><p className="eyebrow"><span className="status-dot"/> DIAGNOSIS CONFIRMED BY YOU</p><h2>Now we can work on<br/><em>the right thing.</em></h2><p>{report.title}. {report.focus}</p></div><button className="text-link" onClick={()=>{setStage('diagnosis');setQuestionStep(3);}}>Review diagnosis <ArrowRight size={14}/></button></section>
      <section className="practice-intro"><div><p className="eyebrow">PHASE 02 / PROBLEM-SOLVING</p><h2>Turn insight into<br/><em>clear instructions.</em></h2></div><p>Your draft stays in this browser. This workshop uses a transparent checklist and prompt builder; there’s no hidden AI rewrite.</p></section>
      <section className="workshop-layout"><div className="draft-column"><div className="workshop-section-label"><span>01</span><div><b>Bring your first ask</b><small>Write what you’d normally type. Rough is useful.</small></div></div><textarea className="draft-input" aria-label="Your draft prompt" placeholder="e.g. Help me plan a trip to Japan" value={draft} onChange={e=>{setDraft(e.target.value);setDetails(current=>({...current,goal:e.target.value}));setResult(false)}} maxLength={1200}/><div className="draft-foot"><span>{draft.length} / 1,200</span><span>YOUR WORDS, YOUR DIRECTION</span></div><div className="review-box"><div className="review-head"><div><p className="eyebrow">PROMPT SIGNAL CHECK</p><h3>{draft.trim()?`${score}% signal coverage`:'A quick look at what helps'}</h3></div><div className="score-ring" style={{'--score':`${score}%`} as React.CSSProperties}><span>{draft.trim()?score:'—'}</span></div></div><p className="review-note">A checklist for useful detail—not a grade. Keep the parts that fit your task.</p><div className="signal-list">{checks.map(check=><div className={`signal-item ${check.present?'signal-present':''}`} key={check.label}><span className="signal-check">{check.present?<Check size={13}/>:<span/>}</span><div><b>{check.label}</b><p>{check.present?'Your prompt gives a useful signal here.':check.tip}</p></div></div>)}</div></div></div>
        <div className="builder-column"><div className="workshop-section-label"><span>02</span><div><b>Add the useful details</b><small>Only fill in what makes this task clearer.</small></div></div><label className="field-label">What should the model help you do?<textarea value={details.goal} onChange={e=>put('goal',e.target.value)} placeholder="Describe the task and what a good result would do." rows={3}/></label><label className="field-label">What background should it know?<textarea value={details.context} onChange={e=>put('context',e.target.value)} placeholder="Relevant facts, situation, or material to use." rows={3}/></label><div className="two-fields"><label className="field-label">Who is this for?<input value={details.audience} onChange={e=>put('audience',e.target.value)} placeholder="Reader, team, or perspective"/></label><label className="field-label">What should the answer look like?<input value={details.format} onChange={e=>put('format',e.target.value)} placeholder="Format, length, structure"/></label></div><label className="field-label">Any boundaries to keep in mind?<textarea value={details.constraints} onChange={e=>put('constraints',e.target.value)} placeholder="What to include, avoid, or keep within a limit." rows={2}/></label><label className="field-label">Choose a voice<select value={details.voice} onChange={e=>put('voice',e.target.value)}><option value="clear">Clear and direct</option><option value="warm">Warm and human</option><option value="bold">Confident and decisive</option><option value="playful">Light and playful</option></select></label><button className="button builder-button" onClick={()=>setResult(true)}>Build my clearer prompt <Sparkles size={15}/></button></div></section>
      {result&&<section className="built-prompt" aria-live="polite"><div className="built-head"><div><p className="eyebrow"><span className="status-dot"/> YOUR CLEARER PROMPT</p><h2>A better starting<br/><em>point, in your voice.</em></h2></div><button className="copy-button" onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy prompt'}</button></div><pre>{improved}</pre><div className="built-foot"><span>BUILT FROM YOUR INPUT / REVIEW BEFORE YOU USE</span><Link to="/method">Why these parts help <ArrowRight size={13}/></Link></div></section>}
      <section className="practice-footer-note"><span>KEEP THE ITERATION GOING</span><p>Use the result, notice what’s missing, and give your next instruction with that new information.</p><Link to="/examples">Need inspiration? Browse examples <ArrowRight size={14}/></Link></section>
    </>}
  </main>;
}

function AboutPage(){return <main className="page about-page"><PageHero eyebrow="A MORE HUMAN WAY TO WORK WITH AI" title="Clarity is a" accent="collaboration." intro="Clarity Engine is a practice space for people who want to get more thoughtful, useful work from AI — without pretending there’s one magic prompt." mark="about"/><section className="about-statement"><p className="eyebrow">WHAT WE BELIEVE</p><h2>Good prompting is<br/>a way of <em>thinking.</em></h2><p>It asks you to notice what you want, what the model needs to know, and what a good answer would look like. That’s a useful habit whether you’re using AI for work, learning, or making something new.</p></section><section className="principle-grid"><article><span>01</span><h3>Specificity over secret formulas</h3><p>There isn’t a hidden phrase that makes every model brilliant. Clear goals and relevant details travel further.</p></article><article><span>02</span><h3>Iteration over perfection</h3><p>Your first prompt starts the exchange. Read the response and guide the next step.</p></article><article><span>03</span><h3>Judgment stays with you</h3><p>AI can help draft, explore, and explain. You decide what is accurate, useful, and worth sharing.</p></article></section><section className="about-cta"><div className="about-mark">✳</div><div><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Try it with<br/><em>something real.</em></h2></div><Link className="button bright" to="/practice">Open the workshop <ArrowRight size={15}/></Link></section></main>}

function NotFound(){return <main className="page not-found"><span>404 / LOST THE THREAD?</span><h1>Let’s find<br/><em>the signal.</em></h1><p>That page isn’t here. The useful next step is.</p><Link to="/" className="button bright">Back to clarity <ArrowRight size={15}/></Link></main>}

function SiteFooter(){return <footer className="site-footer"><Link to="/" className="brand"><span className="brand-mark"><Compass size={16}/></span> clarity<span className="brand-light">engine</span></Link><div className="footer-links"><Link to="/method">The method</Link><Link to="/examples">Prompt library</Link><Link to="/about">Our approach</Link><Link to="/practice">Prompt workshop</Link></div><span className="footer-note">BETTER QUESTIONS, BETTER COLLABORATION</span></footer>}

export default function App(){return <BrowserRouter basename={base}><Layout/></BrowserRouter>}
