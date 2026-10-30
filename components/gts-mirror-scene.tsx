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


/** Instrument lens and graphics are interpretive; not a faithful speedometer face. */
function InstrumentPanel() {
  return <group name="instrument-panel" position={[0,.235,-.055]} rotation={[-Math.PI/2,0,0]}>
    <mesh name="instrument-surround" scale={[1,.72,1]}><circleGeometry args={[.36,64]}/><meshStandardMaterial color="#626b68" metalness={.5} roughness={.3} side={THREE.DoubleSide}/></mesh>
    <mesh name="instrument-dial" position={[0,0,.012]} scale={[1,.72,1]}><circleGeometry args={[.328,64]}/><meshStandardMaterial color="#282f30" metalness={.12} roughness={.65} side={THREE.DoubleSide}/></mesh>
    {Array.from({length:17},(_,i)=>{const angle=Math.PI*.12+i*Math.PI*.76/16;return <mesh key={i} position={[Math.cos(angle)*.265,Math.sin(angle)*.19,.02]} rotation={[0,0,angle-Math.PI/2]}><planeGeometry args={[.008,i%4===0?.045:.025]}/><meshBasicMaterial color="#d1d4ce" side={THREE.DoubleSide}/></mesh>})}
    <mesh name="speedometer-needle" position={[-.07,.065,.024]} rotation={[0,0,.8]}><planeGeometry args={[.012,.20]}/><meshBasicMaterial color="#d95b42" side={THREE.DoubleSide}/></mesh>
    <mesh name="speedometer-hub" position={[0,0,.027]}><circleGeometry args={[.021,20]}/><meshStandardMaterial color="#bbbeb7" metalness={.6} roughness={.3} side={THREE.DoubleSide}/></mesh>
    <mesh name="instrument-glass" position={[0,0,.031]} scale={[1,.72,1]}><circleGeometry args={[.33,64]}/><meshPhysicalMaterial color="#e3edeb" transparent opacity={.16} depthWrite={false} roughness={.1} metalness={.2} side={THREE.DoubleSide}/></mesh>
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

export default function GtsMirrorScene({ componentId }: { componentId: GtsPilotId }) {
  const side = componentId === "gts125-mirror-left" ? "left" : "right";
  return <div className="h-[420px] w-full bg-zinc-100" aria-label={`Interactive illustrative ${side} mirror and handlebar model`}>
    <Canvas camera={{position:[2.1,1.65,4.7],fov:34}} dpr={[1,1.5]}>
      <color attach="background" args={["#f0f0ee"]}/>
      <ambientLight intensity={.45}/><directionalLight position={[3,6,5]} intensity={2}/><directionalLight position={[-4,3,-1]} intensity={.7}/>
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={5} position={[0,4,2]} scale={[7,3,1]}/>
        <Lightformer form="rect" intensity={3} position={[-4,2,2]} rotation={[0,Math.PI/2,0]} scale={[5,3,1]}/>
        <Lightformer form="rect" intensity={2} position={[4,3,-1]} rotation={[0,-Math.PI/2,0]} scale={[5,2,1]}/>
      </Environment>
      <Assembly side={side}/><ContactShadows position={[0,-.80,0]} opacity={.22} scale={7} blur={2.8}/>
      <OrbitControls target={[0,.22,0]} enablePan={false} minDistance={2.8} maxDistance={8}/>
    </Canvas>
  </div>;
}
