import {useEffect,useRef} from "react";

/**
 * Subtle "constellation" background.
 * - Small green / gold points drift slowly and join up with faint lines when close.
 * - On devices with a mouse, nearby points are gently drawn towards the pointer.
 * - Pauses when the tab is hidden, is skipped entirely for prefers-reduced-motion,
 *   and uses fewer points on small screens to protect performance.
 * It is purely decorative (aria-hidden) and sits behind all content.
 */

type Particle={x:number;y:number;vx:number;vy:number;r:number;gold:boolean;phase:number};

const GREEN="184,255,85";
const GOLD="214,181,109";

export default function ParticleField(){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    if(!ctx) return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const finePointer=window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let width=0;
    let height=0;
    let dpr=1;
    let particles:Particle[]=[];
    let frame=0;
    let running=true;
    const pointer={x:-9999,y:-9999,active:false};

    const build=()=>{
      width=window.innerWidth;
      height=window.innerHeight;
      dpr=1;
      canvas.width=Math.floor(width*dpr);
      canvas.height=Math.floor(height*dpr);
      canvas.style.width=`${width}px`;
      canvas.style.height=`${height}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const target=width<760?18:Math.min(42,Math.max(24,Math.round((width*height)/42000)));
      particles=Array.from({length:target},()=>({
        x:Math.random()*width,
        y:Math.random()*height,
        vx:(Math.random()-.5)*.22,
        vy:(Math.random()-.5)*.22,
        r:Math.random()*1.4+.6,
        gold:Math.random()<.14,
        phase:Math.random()*Math.PI*2,
      }));
    };

    let lastDraw=0;
    const draw=(time:number)=>{
      if(!running) return;
      frame=window.requestAnimationFrame(draw);
      if(time-lastDraw<32) return; // ~30fps is plenty for a slow ambient layer
      lastDraw=time;
      if(document.documentElement.classList.contains("lite-motion")){
        ctx.clearRect(0,0,width,height);
        return;
      }
      ctx.clearRect(0,0,width,height);
      const link=width<760?95:135;
      const linkSq=link*link;

      for(const p of particles){
        p.x+=p.vx;
        p.y+=p.vy;
        if(p.x<-20) p.x=width+20; else if(p.x>width+20) p.x=-20;
        if(p.y<-20) p.y=height+20; else if(p.y>height+20) p.y=-20;

        if(pointer.active){
          const dx=pointer.x-p.x;
          const dy=pointer.y-p.y;
          const d2=dx*dx+dy*dy;
          if(d2<190*190&&d2>1){
            const pull=(1-Math.sqrt(d2)/190)*.012;
            p.x+=dx*pull;
            p.y+=dy*pull;
          }
        }
      }

      for(let i=0;i<particles.length;i++){
        const a=particles[i];
        for(let j=i+1;j<particles.length;j++){
          const b=particles[j];
          const dx=a.x-b.x;
          const dy=a.y-b.y;
          const d2=dx*dx+dy*dy;
          if(d2<linkSq){
            const alpha=(1-d2/linkSq)*.16;
            ctx.strokeStyle=`rgba(${GREEN},${alpha.toFixed(3)})`;
            ctx.lineWidth=.6;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
        if(pointer.active){
          const dx=a.x-pointer.x;
          const dy=a.y-pointer.y;
          const d2=dx*dx+dy*dy;
          if(d2<170*170){
            const alpha=(1-Math.sqrt(d2)/170)*.34;
            ctx.strokeStyle=`rgba(${GREEN},${alpha.toFixed(3)})`;
            ctx.lineWidth=.8;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(pointer.x,pointer.y);
            ctx.stroke();
          }
        }
      }

      for(const p of particles){
        const twinkle=.35+.3*Math.sin(time/900+p.phase);
        ctx.fillStyle=`rgba(${p.gold?GOLD:GREEN},${twinkle.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }

    };

    const onPointerMove=(event:PointerEvent)=>{
      if(!finePointer) return;
      pointer.x=event.clientX;
      pointer.y=event.clientY;
      pointer.active=true;
    };
    const onPointerLeave=()=>{pointer.active=false;};
    const onVisibility=()=>{
      if(document.hidden){
        running=false;
        window.cancelAnimationFrame(frame);
      }else if(!running){
        running=true;
        frame=window.requestAnimationFrame(draw);
      }
    };
    let resizeTimer=0;
    const onResize=()=>{
      window.clearTimeout(resizeTimer);
      resizeTimer=window.setTimeout(build,150);
    };

    build();
    frame=window.requestAnimationFrame(draw);
    window.addEventListener("pointermove",onPointerMove,{passive:true});
    document.documentElement.addEventListener("pointerleave",onPointerLeave);
    document.addEventListener("visibilitychange",onVisibility);
    window.addEventListener("resize",onResize);

    return ()=>{
      running=false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove",onPointerMove);
      document.documentElement.removeEventListener("pointerleave",onPointerLeave);
      document.removeEventListener("visibilitychange",onVisibility);
      window.removeEventListener("resize",onResize);
    };
  },[]);

  return <canvas ref={canvasRef} className="ambient-particles" aria-hidden="true"/>;
}
