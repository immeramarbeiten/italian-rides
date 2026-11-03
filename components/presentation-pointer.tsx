"use client";

import { useEffect, useState } from "react";

/** Recording aid: follows real pointer events and marks actual clicks only. */
export function PresentationPointer() {
  const [active,setActive] = useState(false);
  const [point,setPoint] = useState<{x:number;y:number}|null>(null);
  const [click,setClick] = useState<{x:number;y:number;id:number}|null>(null);
  useEffect(()=>{
    const flag=new URLSearchParams(window.location.search).get("record");
    if(flag === "0") sessionStorage.removeItem("italian-rides-recording");
    else if(flag === "1") sessionStorage.setItem("italian-rides-recording","1");
    if(sessionStorage.getItem("italian-rides-recording")!=="1") return;
    setActive(true); document.documentElement.classList.add("recording-presentation");
    const move=(event:PointerEvent)=>setPoint({x:event.clientX,y:event.clientY});
    const down=(event:PointerEvent)=>{setPoint({x:event.clientX,y:event.clientY});setClick({x:event.clientX,y:event.clientY,id:performance.now()})};
    window.addEventListener("pointermove",move);window.addEventListener("pointerdown",down);
    return ()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerdown",down);document.documentElement.classList.remove("recording-presentation")};
  },[]);
  if(!active) return null;
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
    {click && <span key={click.id} className="presentation-click absolute size-12 rounded-full border-2 border-ink" style={{left:click.x-24,top:click.y-24}}/>}
    {point && <svg width="30" height="38" viewBox="0 0 30 38" className="absolute drop-shadow-lg" style={{left:point.x-2,top:point.y-2}}><path d="M3 2 L3 31 L11 24 L17 36 L23 33 L17 22 L28 21 Z" fill="#171310" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>}
  </div>;
}
