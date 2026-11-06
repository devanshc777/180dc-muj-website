import {useState,useEffect,useLayoutEffect,useRef} from "react";
import {Link,NavLink,Outlet,useLocation} from "react-router-dom";
import {Menu,X,ArrowUpRight} from "lucide-react";
import ParticleField from "./ParticleField";

const links=[["/about","About Us"],["/impact","Impact"],["/services","Services"],["/people","People"],["/join","Join Us"]];

/** Elements that fade / slide in when they scroll into view. */
const REVEAL_SELECTOR=[
  ".section",".pagehero",".homecopy",".orbital",".card",".rows > div",".faq details",
  ".enquiry form",".hero-stamp",".checklist li",".metricpreview b",".client-placeholder",
].join(", ");

/** Number elements that count up once visible (only if they contain a real number). */
const COUNTER_SELECTOR=".metric strong, .metric-value, .metricpreview b";

/** Buttons that gently lean towards the pointer on desktop. */
const MAGNET_SELECTOR=".goldbtn, .work-link";

/** Elements that show a click ripple. */
const RIPPLE_SELECTOR=".goldbtn, .work-link";

/** Anything that should make the custom cursor ring grow. */
const INTERACTIVE_SELECTOR="a, button, summary, input, select, textarea, label, .card";

type Magnet={el:HTMLElement;x:number;y:number};

/** Count a number up inside the first text node of an element, e.g. "120+" or "1,500". */
function runCounter(el:HTMLElement){
  const node=el.firstChild;
  if(!node||node.nodeType!==Node.TEXT_NODE) return;
  const raw=node.nodeValue??"";
  const match=raw.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if(!match) return;
  const [,prefix,numberText,suffix]=match;
  const hasComma=numberText.includes(",");
  const decimals=(numberText.split(".")[1]||"").length;
  const target=parseFloat(numberText.replace(/,/g,""));
  if(!isFinite(target)||target<=0) return;
  const duration=1400;
  const start=performance.now();
  const format=(value:number)=>{
    const fixed=value.toFixed(decimals);
    return hasComma?Number(fixed).toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals}):fixed;
  };
  const step=(now:number)=>{
    const t=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-t,4);
    node.nodeValue=`${prefix}${format(target*eased)}${suffix}`;
    if(t<1) window.requestAnimationFrame(step);
    else node.nodeValue=raw;
  };
  node.nodeValue=`${prefix}${format(0)}${suffix}`;
  window.requestAnimationFrame(step);
}

export default function Layout(){
  const [open,setOpen]=useState(false);
  const loc=useLocation();
  const headerRef=useRef<HTMLElement>(null);
  const ringRef=useRef<HTMLDivElement>(null);
  const dotRef=useRef<HTMLDivElement>(null);
  const bgRef=useRef<HTMLDivElement>(null);
  const progressRef=useRef<HTMLDivElement>(null);
  const heroRef=useRef<HTMLElement|null>(null);
  const openRef=useRef(false);
  const magnetsRef=useRef<Magnet[]>([]);

  useEffect(()=>{openRef.current=open;},[open]);

  useEffect(()=>{
    setOpen(false);
    window.scrollTo({top:0,behavior:"instant" as ScrollBehavior});
  },[loc.pathname]);

  /* ── Global motion: pointer light, cursor ring, parallax, tilt, magnets, ripples, scroll ── */
  useEffect(()=>{
    const root=document.documentElement;
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine=window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const s={
      tx:window.innerWidth/2,ty:window.innerHeight*.35, // pointer target
      cx:window.innerWidth/2,cy:window.innerHeight*.35, // smoothed cursor ring
      tmx:0,tmy:0,mx:0,my:0,                            // normalised -1..1 pointer for parallax
      pointerIn:false,
      lastY:window.scrollY,
    };
    let raf=0;
    let activeCard:HTMLElement|null=null;
    let scrollTicking=false;

    const schedule=()=>{if(!raf) raf=window.requestAnimationFrame(tick);};

    function tick(){
      raf=0;
      let moving=false;

      if(fine&&!reduce){
        const dx=s.tx-s.cx;
        const dy=s.ty-s.cy;
        s.cx+=dx*.22;
        s.cy+=dy*.22;
        s.mx+=(s.tmx-s.mx)*.07;
        s.my+=(s.tmy-s.my)*.07;
        const hero=heroRef.current;
        if(hero&&window.scrollY<1100){
          hero.style.setProperty("--mx",s.mx.toFixed(3));
          hero.style.setProperty("--my",s.my.toFixed(3));
        }
        if(ringRef.current) ringRef.current.style.transform=`translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
        if(dotRef.current) dotRef.current.style.transform=`translate3d(${s.tx.toFixed(1)}px,${s.ty.toFixed(1)}px,0)`;
        if(Math.abs(dx)>.1||Math.abs(dy)>.1||Math.abs(s.tmx-s.mx)>.001||Math.abs(s.tmy-s.my)>.001) moving=true;

        for(const m of magnetsRef.current){
          const rect=m.el.getBoundingClientRect();
          const centreX=rect.left+rect.width/2-m.x;
          const centreY=rect.top+rect.height/2-m.y;
          const dxm=s.tx-centreX;
          const dym=s.ty-centreY;
          const dist=Math.hypot(dxm,dym);
          const reach=rect.width/2+55;
          let targetX=0;
          let targetY=0;
          if(s.pointerIn&&rect.width>0&&dist<reach){
            const pull=(1-dist/reach)*.3;
            targetX=Math.max(-9,Math.min(9,dxm*pull));
            targetY=Math.max(-7,Math.min(7,dym*pull));
          }
          m.x+=(targetX-m.x)*.18;
          m.y+=(targetY-m.y)*.18;
          if(Math.abs(m.x)<.04&&Math.abs(m.y)<.04&&targetX===0&&targetY===0){
            m.x=0;m.y=0;
            m.el.style.removeProperty("translate");
          }else{
            m.el.style.translate=`${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
            moving=true;
          }
        }
      }
      if(moving) schedule();
    }

    const resetCard=(card:HTMLElement|null)=>{
      if(!card) return;
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    };

    const onPointerMove=(event:PointerEvent)=>{
      if(event.pointerType==="touch") return;
      s.tx=event.clientX;
      s.ty=event.clientY;
      s.tmx=(event.clientX/window.innerWidth-.5)*2;
      s.tmy=(event.clientY/window.innerHeight-.5)*2;
      s.pointerIn=true;
      const bg=bgRef.current;
      if(bg){
        bg.style.setProperty("--pointer-x",`${event.clientX}px`);
        bg.style.setProperty("--pointer-y",`${event.clientY}px`);
      }

      if(fine&&!reduce){
        if(!root.classList.contains("has-cursor")){
          s.cx=event.clientX;
          s.cy=event.clientY;
          root.classList.add("has-cursor");
        }
        const target=event.target as Element|null;
        root.classList.toggle("cursor-active",!!target?.closest(INTERACTIVE_SELECTOR));

        // Card spotlight + gentle 3D tilt
        const card=target?.closest<HTMLElement>(".card")??null;
        if(activeCard&&activeCard!==card) resetCard(activeCard);
        activeCard=card;
        if(card){
          const rect=card.getBoundingClientRect();
          const px=(event.clientX-rect.left)/rect.width;
          const py=(event.clientY-rect.top)/rect.height;
          card.style.setProperty("--card-x",`${event.clientX-rect.left}px`);
          card.style.setProperty("--card-y",`${event.clientY-rect.top}px`);
          card.style.setProperty("--ry",`${((px-.5)*5).toFixed(2)}deg`);
          card.style.setProperty("--rx",`${(-(py-.5)*3.5).toFixed(2)}deg`);
        }

        // Hero grid that lights up under the pointer
        const hero=target?.closest<HTMLElement>(".homehero, .pagehero");
        if(hero){
          const rect=hero.getBoundingClientRect();
          hero.style.setProperty("--hx",`${event.clientX-rect.left}px`);
          hero.style.setProperty("--hy",`${event.clientY-rect.top}px`);
        }
      }
      schedule();
    };

    const onPointerLeave=()=>{
      s.pointerIn=false;
      s.tmx=0;
      s.tmy=0;
      root.classList.remove("has-cursor","cursor-active","cursor-down");
      resetCard(activeCard);
      activeCard=null;
      schedule();
    };

    const onPointerDown=(event:PointerEvent)=>{
      if(event.pointerType==="touch"&&reduce) return;
      root.classList.add("cursor-down");
      if(reduce) return;
      const target=(event.target as Element|null)?.closest<HTMLElement>(RIPPLE_SELECTOR);
      if(!target) return;
      const rect=target.getBoundingClientRect();
      const size=Math.max(rect.width,rect.height)*1.6;
      const ripple=document.createElement("span");
      ripple.className="ripple";
      ripple.setAttribute("aria-hidden","true");
      ripple.style.width=ripple.style.height=`${size}px`;
      ripple.style.left=`${event.clientX-rect.left-size/2}px`;
      ripple.style.top=`${event.clientY-rect.top-size/2}px`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend",()=>ripple.remove(),{once:true});
    };
    const onPointerUp=()=>root.classList.remove("cursor-down");

    // Scroll progress, parallax offset and a navigation bar that tucks away while reading
    const updateScroll=()=>{
      scrollTicking=false;
      const y=window.scrollY;
      const max=document.documentElement.scrollHeight-window.innerHeight;
      progressRef.current?.style.setProperty("--scroll-progress",`${(max>0?y/max:0)*100}%`);
      if(heroRef.current&&y<1100) heroRef.current.style.setProperty("--sy",String(Math.round(y)));
      const header=headerRef.current;
      if(header){
        header.dataset.scrolled=y>16?"true":"false";
        if(!reduce){
          if(y>s.lastY+6&&y>180&&!openRef.current) header.dataset.hidden="true";
          else if(y<s.lastY-6||y<180) header.dataset.hidden="false";
        }
      }
      s.lastY=y;
    };
    const onScroll=()=>{
      if(!scrollTicking){
        scrollTicking=true;
        window.requestAnimationFrame(updateScroll);
      }
    };

    // Low-power fallback: if the first second runs slowly, switch the heaviest effects off.
    let probeId=0;
    const probeTimer=window.setTimeout(()=>{
      let frames=0;
      const begin=performance.now();
      const count=(now:number)=>{
        frames++;
        if(now-begin<1200) probeId=window.requestAnimationFrame(count);
        else if(frames/((now-begin)/1000)<32) root.classList.add("lite-motion");
      };
      probeId=window.requestAnimationFrame(count);
    },900);

    updateScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("pointermove",onPointerMove,{passive:true});
    window.addEventListener("pointerdown",onPointerDown,{passive:true});
    window.addEventListener("pointerup",onPointerUp,{passive:true});
    document.documentElement.addEventListener("pointerleave",onPointerLeave);

    return ()=>{
      window.cancelAnimationFrame(raf);
      window.clearTimeout(probeTimer);
      window.cancelAnimationFrame(probeId);
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("pointermove",onPointerMove);
      window.removeEventListener("pointerdown",onPointerDown);
      window.removeEventListener("pointerup",onPointerUp);
      document.documentElement.removeEventListener("pointerleave",onPointerLeave);
      root.classList.remove("has-cursor","cursor-active","cursor-down");
    };
  },[]);

  /* ── Per-page: scroll-reveal, number counters and magnetic-button list ── */
  useLayoutEffect(()=>{
    const targets=Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const timers:number[]=[];

    heroRef.current=document.querySelector<HTMLElement>(".homehero, .pagehero");
    magnetsRef.current=Array.from(document.querySelectorAll<HTMLElement>(MAGNET_SELECTOR)).map(el=>({el,x:0,y:0}));

    targets.forEach(el=>{
      el.classList.add("motion-reveal");
      const parent=el.parentElement;
      if(parent&&el.matches(".card, .rows > div, .checklist li, .metricpreview b, .client-placeholder")){
        const index=Array.prototype.indexOf.call(parent.children,el) as number;
        el.style.setProperty("--reveal-delay",`${(index%4)*90}ms`);
      }
    });

    const finish=(el:HTMLElement)=>{
      el.classList.add("motion-done");
      el.style.removeProperty("--reveal-delay");
    };

    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion||!("IntersectionObserver" in window)){
      targets.forEach(el=>{el.classList.add("is-visible");finish(el);});
      return ()=>{magnetsRef.current=[];};
    }

    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const el=entry.target as HTMLElement;
        el.classList.add("is-visible");
        observer.unobserve(el);
        if(el.matches(COUNTER_SELECTOR)) runCounter(el);
        el.querySelectorAll<HTMLElement>(COUNTER_SELECTOR).forEach(runCounter);
        timers.push(window.setTimeout(()=>finish(el),1300));
      });
    },{threshold:0.12,rootMargin:"0px 0px -35px 0px"});
    targets.forEach(el=>observer.observe(el));

    return ()=>{
      observer.disconnect();
      timers.forEach(id=>window.clearTimeout(id));
      magnetsRef.current=[];
    };
  },[loc.pathname]);

  return <div className="shell">
    <div className="ambient-bg" aria-hidden="true" ref={bgRef}>
      <span className="ambient-orb ambient-orb-one"/><span className="ambient-orb ambient-orb-two"/>
      <span className="ambient-orb ambient-orb-three"/><span className="ambient-grid"/>
      <ParticleField/>
      <span className="ambient-noise"/>
    </div>
    <div className="scroll-progress" aria-hidden="true" ref={progressRef}/>
    <div className="cursor-ring" ref={ringRef} aria-hidden="true"/>
    <div className="cursor-dot" ref={dotRef} aria-hidden="true"/>
    <header className="nav" ref={headerRef}>
      <Link to="/" className="brand"><img src="https://cdn.prod.website-files.com/63b610d81215b25001c51b2b/6473fd944a0547694b03e237_180DC_Logo_white.avif" alt="180 Degrees Consulting"/><small>MANIPAL UNIVERSITY JAIPUR</small></Link>
      <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
      <nav className={open?"links open":"links"}>{links.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}>{label}</NavLink>)}<Link className="work-link" to="/work-with-us">Work With Us <ArrowUpRight size={15}/></Link></nav>
    </header>
    <main className="page-stage" key={loc.pathname}><Outlet/></main>
    <footer><Link to="/" className="footbrand">180° <span>DEGREES CONSULTING · MUJ</span></Link><div className="footlinks">{links.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}<Link to="/work-with-us">Work With Us</Link></div><small>Student-led consulting for social impact · <a href="mailto:jaipur@180dc.org">jaipur@180dc.org</a></small></footer>
  </div>;
}
