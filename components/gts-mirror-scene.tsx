"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { GtsPilotId } from "@/lib/gts-pilot";
import * as THREE from "three";

/** Original interpretive geometry; proportions and fasteners have not been verified. */
function Assembly({ side }: { side: "left" | "right" }) {
  const x = side === "left" ? -1 : 1;
  const start = new THREE.Vector3(x * 0.84, 0.32, 0);
  const end = new THREE.Vector3(x * 1.28, 1.18, 0);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
  const metal = { color: "#bec2c1", metalness: 0.87, roughness: 0.22 };
  return <group>
    <mesh name="handlebar-housing" position={[0,0,0]} scale={[1.28,.36,.43]}><sphereGeometry args={[1,64,32]}/><meshStandardMaterial color="#d7d9d6" metalness={0.46} roughness={0.3}/></mesh>
    <mesh name="handlebar-lower-trim" position={[0,-.15,0]} scale={[1.17,.19,.38]}><sphereGeometry args={[1,64,32]}/><meshStandardMaterial color="#868b88" metalness={0.55} roughness={0.35}/></mesh>
    <mesh name="headlamp-bezel" position={[0,.01,.4]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.29,.29,.07,64]}/><meshStandardMaterial {...metal}/></mesh>
    <mesh name="headlamp-lens" position={[0,.01,.445]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.25,.25,.035,64]}/><meshStandardMaterial color="#c7d0ce" metalness={0.45} roughness={0.15}/></mesh>
    <mesh name="grip-left" position={[-1.22,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.12,.12,.49,40]}/><meshStandardMaterial color="#202321" roughness={.78}/></mesh>
    <mesh name="grip-right" position={[1.22,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.12,.12,.49,40]}/><meshStandardMaterial color="#202321" roughness={.78}/></mesh>
    {["left","right"].map((s) => { const sx = s === "left" ? -1 : 1; const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(sx*.95,-.03,.17),new THREE.Vector3(sx*1.18,-.14,.22),new THREE.Vector3(sx*1.48,-.16,.16)]); return <mesh key={`lever-${s}`} name={`brake-lever-${s}`}><tubeGeometry args={[curve,32,.026,12,false]}/><meshStandardMaterial {...metal}/></mesh>; })}
    {[-1,1].flatMap((sx) => Array.from({length:6},(_,i)=><mesh key={`${sx}-${i}`} name={`grip-rib-${sx}-${i}`} position={[sx*(1.06+i*.055),0,0]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[.12,.007,8,32]}/><meshStandardMaterial color="#414541" roughness={.75}/></mesh>))}
    {["left","right"].map((s) => { const sx=s==="left"?-1:1;return <mesh key={s} name={`mirror-mount-${s}`} position={[sx*.84,.32,0]}><cylinderGeometry args={[.10,.12,.13,32]}/><meshStandardMaterial color="#333735" metalness={.48} roughness={.35}/></mesh>})}
    <group name={`gts125-mirror-${side}`}>
      <mesh name={`mirror-stem-${side}`} position={mid} quaternion={quat}><cylinderGeometry args={[.027,.027,start.distanceTo(end),28]}/><meshStandardMaterial {...metal}/></mesh>
      <mesh name={`mirror-housing-${side}`} position={[x*1.33,1.29,0]} scale={[.24,.29,.075]}><sphereGeometry args={[1,64,40]}/><meshStandardMaterial {...metal}/></mesh>
      <mesh name={`mirror-rim-${side}`} position={[x*1.33,1.29,.075]} scale={[.20,.25,1]}><torusGeometry args={[1,.04,12,64]}/><meshStandardMaterial {...metal}/></mesh>
      <mesh name={`mirror-glass-${side}`} position={[x*1.33,1.29,.065]} scale={[.20,.25,.02]}><sphereGeometry args={[1,64,32]}/><meshStandardMaterial color="#d4e0e0" metalness={.65} roughness={.12}/></mesh>
    </group>
  </group>;
}
export default function GtsMirrorScene({ componentId }: { componentId: GtsPilotId }) {
  const side = componentId === "gts125-mirror-left" ? "left" : "right";
  return <div className="h-[340px] w-full bg-zinc-100" aria-label={`Interactive illustrative ${side} mirror and handlebar model`}>
    <Canvas camera={{position:[2.5,1.8,4.4],fov:38}} dpr={[1,1.5]}>
      <ambientLight intensity={1.2}/><directionalLight position={[4,6,5]} intensity={2}/><directionalLight position={[-4,3,-2]} intensity={1.1}/>
      <Assembly side={side}/><ContactShadows position={[0,-.4,0]} opacity={.2} blur={3}/>
      <OrbitControls target={[0,.3,0]} enablePan={false} minDistance={2.5} maxDistance={8}/>
    </Canvas>
  </div>;
}
