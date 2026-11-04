import {useState,useEffect} from "react";
import {Link,NavLink,Outlet,useLocation} from "react-router-dom";
import {Menu,X,ArrowUpRight} from "lucide-react";

const links=[["/about","About Us"],["/impact","Impact"],["/services","Services"],["/people","People"],["/join","Join Us"]];

export default function Layout(){
  const [open,setOpen]=useState(false);
  const loc=useLocation();

  useEffect(()=>{
    setOpen(false);
    window.scrollTo({top:0,behavior:"instant" as ScrollBehavior});
  },[loc.pathname]);

  // Ambient pointer lighting, scroll progress and accessible reveal-on-scroll effects.
  useEffect(()=>{
    const root=document.documentElement;
    let ticking=false;
    const updateProgress=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      const progress=max>0?window.scrollY/max:0;
      root.style.setProperty("--scroll-progress",`${progress*100}%`);
      ticking=false;
    };
    const onScroll=()=>{if(!ticking){window.requestAnimationFrame(updateProgress);ticking=true;}};
    const onPointer=(event:PointerEvent)=>{
      root.style.setProperty("--pointer-x",`${event.clientX}px`);
      root.style.setProperty("--pointer-y",`${event.clientY}px`);
    };
    updateProgress();
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("pointermove",onPointer,{passive:true});

    const targets=document.querySelectorAll<HTMLElement>(
      ".section, .pagehero, .homecopy, .orbital, .card, .rows > div, .faq details, .enquiry form, .hero-stamp"
    );
    targets.forEach((el,index)=>{
      el.classList.add("motion-reveal");
      if(el.classList.contains("card")) el.style.setProperty("--reveal-delay",`${(index%4)*85}ms`);
    });
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion||!("IntersectionObserver" in window)){
      targets.forEach(el=>el.classList.add("is-visible"));
    }else{
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },{threshold:0.12,rootMargin:"0px 0px -35px 0px"});
      targets.forEach(el=>observer.observe(el));
      return ()=>{
        observer.disconnect();
        window.removeEventListener("scroll",onScroll);
        window.removeEventListener("pointermove",onPointer);
      };
    }
    return ()=>{
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("pointermove",onPointer);
    };
  },[loc.pathname]);

  return <div className="shell">
    <div className="ambient-bg" aria-hidden="true">
      <span className="ambient-orb ambient-orb-one"/><span className="ambient-orb ambient-orb-two"/>
      <span className="ambient-orb ambient-orb-three"/><span className="ambient-grid"/><span className="ambient-noise"/>
    </div>
    <div className="scroll-progress" aria-hidden="true"/>
    <header className="nav">
      <Link to="/" className="brand"><img src="https://cdn.prod.website-files.com/63b610d81215b25001c51b2b/6473fd944a0547694b03e237_180DC_Logo_white.avif" alt="180 Degrees Consulting"/><small>MANIPAL UNIVERSITY JAIPUR</small></Link>
      <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
      <nav className={open?"links open":"links"}>{links.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}>{label}</NavLink>)}<Link className="work-link" to="/work-with-us">Work With Us <ArrowUpRight size={15}/></Link></nav>
    </header>
    <main className="page-stage"><Outlet/></main>
    <footer><Link to="/" className="footbrand">180° <span>DEGREES CONSULTING · MUJ</span></Link><div className="footlinks">{links.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}<Link to="/work-with-us">Work With Us</Link></div><small>Student-led consulting for social impact · <a href="mailto:jaipur@180dc.org">jaipur@180dc.org</a></small></footer>
  </div>;
}
