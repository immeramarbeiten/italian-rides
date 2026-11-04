import React from 'react';
import {AbsoluteFill,Audio,Composition,OffthreadVideo,Sequence,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import manifest from './film-scenes.json';

const FPS=30;
function Scene({scene}) {
 const f=useCurrentFrame();
 const opacity=interpolate(f,[0,12,scene.frames-12,scene.frames],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const titleOpacity=interpolate(f,[12,22,Math.min(120,scene.frames-25),Math.min(140,scene.frames-10)],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const drift=Math.sin(f/110)*12;
 return <AbsoluteFill style={{opacity,fontFamily:'Arial, sans-serif',overflow:'hidden',background:'linear-gradient(125deg,#eacba7 0%,#ced4e4 52%,#899bc8 100%)'}}>
   <div style={{position:'absolute',inset:-130,background:`radial-gradient(ellipse at ${18+drift/4}% 15%,#f7e5cb 0%,transparent 48%),radial-gradient(ellipse at ${80-drift/4}% 92%,#6a81b6 0%,transparent 58%)`}}/>
   {scene.id==='close' ? <div style={{position:'absolute',left:190,top:310,color:'#17202e'}}><div style={{fontSize:25,letterSpacing:6,fontWeight:600}}>ITALIAN RIDES</div><div style={{fontSize:78,lineHeight:1.04,fontWeight:700,marginTop:32,maxWidth:1200}}>Know your machine.<br/>Keep it moving.</div><div style={{fontSize:28,marginTop:38,color:'#435064'}}>From a photograph to a useful next step.</div></div> : <div style={{position:'absolute',left:52,top:32,width:1816,height:1022,overflow:'hidden',borderRadius:25,boxShadow:'0 34px 90px #23334b44',transform:`scale(${interpolate(f,[0,scene.frames],[1.0,1.025])})`}}><OffthreadVideo src={staticFile(`clips/${scene.id}.mp4`)} style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>}
   {scene.id!=='close' && <div style={{position:'absolute',left:88,bottom:72,opacity:titleOpacity,color:'#fff',background:'#17212eea',padding:'16px 23px',borderRadius:9,fontSize:25,fontWeight:650,letterSpacing:.2}}>{scene.title}</div>}
   {scene.note && <div style={{position:'absolute',right:87,top:60,color:'#29354b',background:'#fffffff0',padding:'10px 15px',borderRadius:7,fontSize:17,fontWeight:600}}>{scene.note}</div>}
   <Sequence from={Math.round(.65*FPS)}><Audio src={staticFile(`voice/${scene.id}.wav`)} volume={1}/></Sequence>
 </AbsoluteFill>;
}
function Film(){const total=manifest.reduce((n,s)=>n+s.frames,0);let at=0;return <AbsoluteFill><Audio src={staticFile('ambient-bed.wav')} volume={0.25} />{manifest.map(s=>{let from=at;at+=s.frames;return <Sequence key={s.id} from={from} durationInFrames={s.frames}><Scene scene={s}/></Sequence>})}</AbsoluteFill>}
function Root(){let frames=manifest.reduce((n,s)=>n+s.frames,0);return <Composition id="ItalianRides" component={Film} durationInFrames={frames} fps={FPS} width={1920} height={1080}/>}
registerRoot(Root);
