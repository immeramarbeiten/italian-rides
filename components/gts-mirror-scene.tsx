"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import type { GtsPilotId } from "@/lib/gts-pilot";
import * as THREE from "three";

// A visual study based on the available reference images, not measured factory geometry.
const chrome = { color: "#d5d8d5", metalness: 0.94, roughness: 0.16 };
const darkMetal = { color: "#535a58", metalness: 0.82, roughness: 0.28 };
const rubber = { color: "#171b1b", metalness: 0.02, roughness: 0.86 };

/** Sculpt a softly tapered headset from cross-sections instead of a single oval. */
function makeHousing() {
  const profile = new THREE.SplineCurve([
    new THREE.Vector2(0, 0.18), new THREE.Vector2(0.30, 0.25),
    new THREE.Vector2(0.57, 0.23), new THREE.Vector2(0.80, 0.15),
    new THREE.Vector2(1, 0.10),
  ]);
  const pts = profile.getPoints(80);
  const vertices: number[] = [], indices: number[] = [];
  const around = 64;
  for (let i = 0; i <= 80; i++) {
    const x = -1 + i / 40;
    const a = Math.abs(x);
    const p = pts.reduce((prev, cur) => Math.abs(cur.x-a) < Math.abs(prev.x-a) ? cur : prev);
    const height = p.y;
    const depth = .19 + .12 * (1 - a * a);
    for (let j = 0; j <= around; j++) {
      const t = (j / around) * Math.PI * 2;
      // Full crown above, flatter lower contour, rounded front and back.
      vertices.push(x, Math.sin(t) * height + .025, Math.cos(t) * depth);
    }
  }
  for (let i = 0; i < 80; i++) for (let j = 0; j < around; j++) {
    const a = i * (around + 1) + j, b = a + around + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Rod({ start, end, radius, name }: { start: [number,number,number]; end: [number,number,number]; radius: number; name: string }) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
  const middle = a.clone().add(b).multiplyScalar(.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), b.clone().sub(a).normalize());
  return <mesh name={name} position={middle} quaternion={quaternion}><cylinderGeometry args={[radius,radius,a.distanceTo(b),32]}/><meshStandardMaterial {...chrome}/></mesh>;
}

function Headlamp() {
  return <group name="headlamp-assembly" position={[0,.01,.30]}>
    <mesh name="headlamp-surround" scale={[.32,.34,.15]}><sphereGeometry args={[1,64,40]}/><meshStandardMaterial color="#bdc1bd" metalness={.5} roughness={.26}/></mesh>
    <mesh name="headlamp-bezel" position={[0,0,.13]}><torusGeometry args={[.267,.024,16,72]}/><meshStandardMaterial {...chrome}/></mesh>
    <mesh name="headlamp-gasket" position={[0,0,.135]}><torusGeometry args={[.242,.01,10,72]}/><meshStandardMaterial {...rubber}/></mesh>
    <mesh name="headlamp-reflector" position={[0,0,.12]}><circleGeometry args={[.239,72]}/><meshStandardMaterial color="#a6afb0" metalness={.88} roughness={.2} side={THREE.DoubleSide}/></mesh>
    <mesh name="headlamp-lens" position={[0,0,.15]}><circleGeometry args={[.233,72]}/><meshPhysicalMaterial color="#e5efee" metalness={.18} roughness={.1} transparent opacity={.36} depthWrite={false} side={THREE.DoubleSide}/></mesh>
    <mesh name="headlamp-bulb" position={[0,0,.154]}><sphereGeometry args={[.048,32,20]}/><meshStandardMaterial color="#e4e5dd" metalness={.7} roughness={.2}/></mesh>
    {Array.from({length:12},(_,i) => <mesh key={i} position={[0,0,.145]} rotation={[0,0,i*Math.PI/6]}><planeGeometry args={[.006,.42]}/><meshStandardMaterial color="#f0f2ee" metalness={.6} roughness={.3} side={THREE.DoubleSide}/></mesh>)}
  </group>;
}

function Control({ side }: { side: "left" | "right" }) {
  const sign = side === "left" ? -1 : 1;
  const lever = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(sign*.98,-.075,.12), new THREE.Vector3(sign*1.13,-.19,.22),
    new THREE.Vector3(sign*1.39,-.22,.24), new THREE.Vector3(sign*1.55,-.19,.19),
  ]), [sign]);
  return <group name={`control-${side}`}>
    <mesh name={`switch-housing-${side}`} position={[sign*.95,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.125,.13,.19,48]}/><meshStandardMaterial color="#363a39" metalness={.12} roughness={.55}/></mesh>
    <mesh name={`grip-${side}`} position={[sign*1.22,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.115,.11,.42,48]}/><meshStandardMaterial {...rubber}/></mesh>
    {Array.from({length:13},(_,i) => <mesh key={i} position={[sign*(1.035+i*.03),0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.114,.006,8,36]}/><meshStandardMaterial color="#424744" roughness={.8}/></mesh>)}
    <mesh name={`bar-end-${side}`} position={[sign*1.45,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.092,.105,.035,32]}/><meshStandardMaterial {...chrome}/></mesh>
    <mesh name={`brake-lever-${side}`}><tubeGeometry args={[lever,48,.024,16,false]}/><meshStandardMaterial {...chrome}/></mesh>
    <mesh position={[sign*.985,-.07,.13]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.045,.045,.06,32]}/><meshStandardMaterial {...darkMetal}/></mesh>
    <mesh name={`switch-${side}`} position={[sign*.94,.035,.123]}><boxGeometry args={[.09,.05,.015]}/><meshStandardMaterial color={side === "right" ? "#9f3a30" : "#222625"} roughness={.55}/></mesh>
  </group>;
}

function Mirror({ side, selected }: { side: "left" | "right"; selected: boolean }) {
  const sign = side === "left" ? -1 : 1;
  const start: [number,number,number] = [sign*.74,.20,-.035];
  const bend: [number,number,number] = [sign*.85,.48,-.04];
  const end: [number,number,number] = [sign*1.13,1.08,-.045];
  return <group name={`gts125-mirror-${side}`}>
    <mesh name={`mirror-boot-${side}`} position={start}><cylinderGeometry args={[.07,.085,.10,40]}/><meshStandardMaterial {...rubber}/></mesh>
    <mesh name={`mirror-nut-${side}`} position={[sign*.74,.265,-.035]}><cylinderGeometry args={[.052,.052,.048,6]}/><meshStandardMaterial {...chrome}/></mesh>
    <Rod start={[sign*.74,.28,-.035]} end={bend} radius={.020} name={`mirror-lower-stem-${side}`}/>
    <Rod start={bend} end={end} radius={.020} name={`mirror-stem-${side}`}/>
    <mesh name={`mirror-housing-${side}`} position={[sign*1.17,1.19,-.05]} scale={[.22,.255,.07]}><sphereGeometry args={[1,64,40]}/><meshStandardMaterial {...chrome}/></mesh>
    <mesh name={`mirror-rim-${side}`} position={[sign*1.17,1.19,-.118]} scale={[.19,.225,1]}><torusGeometry args={[1,.035,16,64]}/><meshStandardMaterial {...chrome}/></mesh>
    <mesh name={`mirror-glass-${side}`} position={[sign*1.17,1.19,-.12]} scale={[.185,.22,.015]}><sphereGeometry args={[1,64,40]}/><meshStandardMaterial color="#acbdc0" metalness={.72} roughness={.12}/></mesh>
    {selected && <mesh name={`selection-ring-${side}`} position={[sign*.74,.205,-.035]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.10,.116,48]}/><meshBasicMaterial color="#c1271b" side={THREE.DoubleSide}/></mesh>}
  </group>;
}


/** Original artwork informed by the owner's manual's analogue panel; not calibrated instrumentation. */
function makeInstrumentTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Instrument canvas unavailable");
  ctx.beginPath();
  ctx.moveTo(165, 210); ctx.bezierCurveTo(215, 55, 355, 15, 512, 18);
  ctx.bezierCurveTo(670, 15, 810, 55, 860, 210); ctx.lineTo(994, 355);
  ctx.bezierCurveTo(1010, 385, 985, 425, 950, 462); ctx.lineTo(850, 667);
  ctx.bezierCurveTo(825, 730, 755, 750, 690, 752); ctx.lineTo(330, 752);
  ctx.bezierCurveTo(265, 750, 195, 730, 170, 667); ctx.lineTo(70, 462);
  ctx.bezierCurveTo(35, 425, 14, 385, 30, 355); ctx.closePath(); ctx.clip();
  ctx.fillStyle = "#e7e5d9"; ctx.fillRect(0,0,1024,768);
  // Main speedometer and its nested km/h / mph scales.
  ctx.fillStyle="#d5d2c4"; ctx.beginPath(); ctx.ellipse(370,372,300,260,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#f4f2e8"; ctx.beginPath(); ctx.ellipse(370,372,286,246,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#363a36"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(370,430,228,Math.PI*1.05,Math.PI*1.95); ctx.stroke();
  for(let i=0;i<=28;i++) {
    const angle=Math.PI*1.05+i*Math.PI*.9/28, big=i%4===0;
    const x=Math.cos(angle), y=Math.sin(angle);
    ctx.strokeStyle="#2e3330";ctx.lineWidth=big?5:2.5;
    ctx.beginPath();ctx.moveTo(370+x*(big?205:213),430+y*(big?205:213));ctx.lineTo(370+x*226,430+y*226);ctx.stroke();
    if(big) {ctx.fillStyle="#222724";ctx.font="bold 29px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(i*5),370+x*174,430+y*174);}
  }
  ctx.fillStyle="#59605a";ctx.font="17px Arial";ctx.textAlign="center";ctx.fillText("km/h",370,382);
  ctx.fillStyle="#282d29";ctx.fillRect(280,500,180,36);ctx.fillStyle="#e5e5da";ctx.font="23px monospace";ctx.fillText("00000",370,519);
  ctx.strokeStyle="#383c37";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(370,430);ctx.lineTo(241,464);ctx.stroke();ctx.fillStyle="#252a27";ctx.beginPath();ctx.arc(370,430,19,0,Math.PI*2);ctx.fill();
  // Two small analogue instruments, indicators and a separate clock.
  const dial=(cx:number,cy:number,label:string,needle:number) => {ctx.fillStyle="#f7f5eb";ctx.beginPath();ctx.arc(cx,cy,83,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#8b8d80";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#555b54";ctx.font="bold 19px Arial";ctx.textAlign="center";ctx.fillText(label,cx,cy-42);for(let i=0;i<7;i++){const a=Math.PI*1.1+i*Math.PI*.8/6;ctx.strokeStyle="#626860";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*58,cy+Math.sin(a)*58);ctx.lineTo(cx+Math.cos(a)*70,cy+Math.sin(a)*70);ctx.stroke()}ctx.strokeStyle="#323833";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy+12);ctx.lineTo(cx+Math.cos(needle)*48,cy+Math.sin(needle)*48);ctx.stroke();ctx.fillStyle="#343934";ctx.beginPath();ctx.arc(cx,cy+12,10,0,Math.PI*2);ctx.fill()};
  dial(760,276,"FUEL",Math.PI*1.7); dial(760,475,"TEMP",Math.PI*1.4);
  const colors=["#4f704f","#bb8f3f","#a54b3d","#637f9c"];
  colors.forEach((color,i)=>{ctx.fillStyle="#666a60";ctx.beginPath();ctx.ellipse(290+i*115,95,35,24,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(290+i*115,95,25,16,0,0,Math.PI*2);ctx.fill()});
  ctx.fillStyle="#646960";ctx.fillRect(300,620,175,65);ctx.fillStyle="#a9b6a2";ctx.fillRect(309,629,157,47);ctx.fillStyle="#364039";ctx.font="bold 30px monospace";ctx.textAlign="center";ctx.fillText("10:24",388,655);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;return texture;
}
/** A shallow housing bridges the flat dial and the curved headset below it. */
function makeInstrumentHousing() {
  const x = (v: number) => (v - 512) * .76 / 1024;
  const y = (v: number) => (384 - v) * .54 / 768;
  const shape = new THREE.Shape();
  shape.moveTo(x(165), y(210));
  shape.bezierCurveTo(x(215), y(55), x(355), y(15), x(512), y(18));
  shape.bezierCurveTo(x(670), y(15), x(810), y(55), x(860), y(210));
  shape.lineTo(x(994), y(355));
  shape.bezierCurveTo(x(1010), y(385), x(985), y(425), x(950), y(462));
  shape.lineTo(x(850), y(667));
  shape.bezierCurveTo(x(825), y(730), x(755), y(750), x(690), y(752));
  shape.lineTo(x(330), y(752));
  shape.bezierCurveTo(x(265), y(750), x(195), y(730), x(170), y(667));
  shape.lineTo(x(70), y(462));
  shape.bezierCurveTo(x(35), y(425), x(14), y(385), x(30), y(355));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .30, bevelEnabled: true, bevelSize: .006, bevelThickness: .005,
    bevelSegments: 3, curveSegments: 32,
  });
  // Extend below the face into the headset, so the edge has a real support.
  geometry.translate(0, 0, -.30);
  return geometry;
}
function InstrumentPanel() {
  const texture = useMemo(makeInstrumentTexture, []);
  const housing = useMemo(makeInstrumentHousing, []);
  return <group name="instrument-panel" position={[0,.315,-.035]} rotation={[-Math.PI/2,0,Math.PI]}>
    <mesh name="instrument-housing" geometry={housing}>
      <meshStandardMaterial color="#b7bbb2" metalness={.38} roughness={.3}/>
    </mesh>
    <mesh name="instrument-face" position={[0,0,.012]}>
      <planeGeometry args={[.76,.54]}/><meshBasicMaterial map={texture} transparent side={THREE.DoubleSide}/>
    </mesh>
  </group>;
}
function SteeringNeck() {
  return <group name="steering-neck" position={[0,-.36,-.075]}>
    <mesh name="neck-cover" scale={[.34,.43,.26]}><sphereGeometry args={[1,48,32]}/><meshPhysicalMaterial color="#d9dad4" metalness={.35} roughness={.28} clearcoat={.7}/></mesh>
    <mesh name="neck-joint" position={[0,-.33,0]} rotation={[0,0,0]}><cylinderGeometry args={[.22,.19,.13,48]}/><meshStandardMaterial color="#6e7772" metalness={.5} roughness={.42}/></mesh>
    <mesh name="neck-seam" position={[0,-.30,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.205,.009,10,48]}/><meshStandardMaterial color="#373f3c" roughness={.55}/></mesh>
  </group>;
}

function Assembly({ side }: { side: "left" | "right" }) {
  const housing = useMemo(makeHousing, []);
  return <group>
    <mesh name="handlebar-housing" geometry={housing}><meshPhysicalMaterial color="#d9dad4" metalness={.38} roughness={.26} clearcoat={.75} clearcoatRoughness={.24}/></mesh>
    <mesh name="lower-headset-trim" position={[0,-.12,-.03]} scale={[.83,.14,.27]}><sphereGeometry args={[1,64,32]}/><meshStandardMaterial color="#747a77" metalness={.54} roughness={.36}/></mesh>
    <SteeringNeck/><InstrumentPanel/><Headlamp/><Control side="left"/><Control side="right"/>
    <Mirror side="left" selected={side === "left"}/><Mirror side="right" selected={side === "right"}/>
  </group>;
}

export default function GtsMirrorScene({ componentId, view = "overview" }: { componentId: GtsPilotId; view?: "overview" | "dashboard" }) {
  const side = componentId === "gts125-mirror-left" ? "left" : "right";
  return <div className="h-[420px] w-full bg-zinc-100" aria-label={`Interactive illustrative ${side} mirror and handlebar model`}>
    <Canvas key={view} camera={{position: view === "dashboard" ? [0,1.72,-1.5] : [2.1,1.65,4.7],fov: view === "dashboard" ? 30 : 34}} dpr={[1,1.5]}>
      <color attach="background" args={["#f0f0ee"]}/>
      <ambientLight intensity={.45}/><directionalLight position={[3,6,5]} intensity={2}/><directionalLight position={[-4,3,-1]} intensity={.7}/>
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={5} position={[0,4,2]} scale={[7,3,1]}/>
        <Lightformer form="rect" intensity={3} position={[-4,2,2]} rotation={[0,Math.PI/2,0]} scale={[5,3,1]}/>
        <Lightformer form="rect" intensity={2} position={[4,3,-1]} rotation={[0,-Math.PI/2,0]} scale={[5,2,1]}/>
      </Environment>
      <Assembly side={side}/><ContactShadows position={[0,-.80,0]} opacity={.22} scale={7} blur={2.8}/>
      <OrbitControls target={view === "dashboard" ? [0,.20,-.03] : [0,.22,0]} enablePan={false} minDistance={view === "dashboard" ? 1.2 : 2.8} maxDistance={8}/>
    </Canvas>
  </div>;
}
