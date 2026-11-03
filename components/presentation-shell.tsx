"use client";


export function PresentationShell({start}: {start:string}) {
  return <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#e9eaed] p-4 sm:p-10" style={{backgroundImage:"radial-gradient(ellipse at 15% 10%,#f2d8b6 0%,transparent 49%),radial-gradient(ellipse at 88% 90%,#899ec3 0%,transparent 58%),linear-gradient(135deg,#e8dfd3,#c8d3e0)"}}>
    <div className="flex h-full max-h-[1100px] w-full max-w-[1800px] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_32px_100px_#19232c30]">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-zinc-200 bg-[#f8f8f9] px-5"><span className="size-2.5 rounded-full bg-[#ee6a5e]"/><span className="size-2.5 rounded-full bg-[#f4bd4f]"/><span className="size-2.5 rounded-full bg-[#61c454]"/><p className="mx-auto truncate px-5 text-xs text-zinc-500">ITALIAN RIDES · LIVE PRODUCT DEMO</p><span className="w-10"/></div>
      <iframe title="Italian Rides interactive demo" src={`${start}${start.includes("?")?"&":"?"}record=1`} className="min-h-0 w-full flex-1 border-0 bg-white"/>
    </div>
  </div>;
}
