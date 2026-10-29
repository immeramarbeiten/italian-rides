"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import type { VespaPartId } from "@/lib/vespa-inspect";

export type VespaViewerProps = {
  /** Exploded-view factor, 0 (assembled) to 1 (fully exploded). */
  explode?: number;
  wireframe?: boolean;
  xray?: boolean;
  selected?: VespaPartId | null;
  onSelect?: (part: VespaPartId | null) => void;
  /** When set, render this GLB instead of the procedural model. */
  glbUrl?: string | null;
  autoRotate?: boolean;
};

const BODY = "#175e54";
const BODY_DARK = "#0f443d";
const CHROME = "#d6d3d1";
const RUBBER = "#1c1917";
const LEATHER = "#57534e";
const CREAM = "#fef9c3";
const SELECT_EMISSIVE = "#b33a2b";

type MatProps = {
  color: string;
  selected: boolean;
  wireframe: boolean;
  xray: boolean;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

function PartMaterial({
  color,
  selected,
  wireframe,
  xray,
  metalness = 0,
  roughness = 0.6,
  emissive,
  emissiveIntensity,
}: MatProps) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      wireframe={wireframe}
      transparent={xray || undefined}
      opacity={xray ? 0.35 : 1}
      depthWrite={!xray}
      emissive={selected ? SELECT_EMISSIVE : (emissive ?? "#000000")}
      emissiveIntensity={selected ? 0.45 : (emissiveIntensity ?? 1)}
    />
  );
}

type PartGroupProps = {
  id: VespaPartId;
  selected: VespaPartId | null;
  wireframe: boolean;
  xray: boolean;
  onSelect: (part: VespaPartId | null) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: ReactNode;
};

function PartGroup({
  id,
  selected,
  onSelect,
  position,
  rotation,
  children,
}: PartGroupProps) {
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(selected === id ? null : id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {children}
    </group>
  );
}

function Wheel({
  position,
  selected,
  wireframe,
  xray,
}: {
  position: [number, number, number];
  selected: boolean;
  wireframe: boolean;
  xray: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.3, 0.085, 16, 32]} />
        <PartMaterial
          color={RUBBER}
          selected={selected}
          wireframe={wireframe}
          xray={xray}
          roughness={0.9}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.07, 24]} />
        <PartMaterial
          color={CHROME}
          selected={selected}
          wireframe={wireframe}
          xray={xray}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
        <PartMaterial
          color={BODY_DARK}
          selected={selected}
          wireframe={wireframe}
          xray={xray}
          roughness={0.5}
        />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 5]}>
          <boxGeometry args={[0.5, 0.035, 0.03]} />
          <PartMaterial
            color={CHROME}
            selected={selected}
            wireframe={wireframe}
            xray={xray}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralVespa({
  explode,
  wireframe,
  xray,
  selected,
  onSelect,
}: Required<
  Pick<
    VespaViewerProps,
    "explode" | "wireframe" | "xray" | "selected" | "onSelect"
  >
>) {
  const e = THREE.MathUtils.clamp(explode, 0, 1);
  const is = (id: VespaPartId) => selected === id;
  const mp = { wireframe: wireframe ?? false, xray: xray ?? false };

  return (
    <group>
      {/* FRAME — floorboard, rear body, cowls */}
      <PartGroup
        id="frame"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
        position={[0, 0, 0]}
      >
        <mesh position={[-0.1, 0.42, 0]}>
          <boxGeometry args={[1.15, 0.1, 0.45]} />
          <PartMaterial
            color={BODY}
            selected={is("frame")}
            roughness={0.5}
            {...mp}
          />
        </mesh>
        <mesh position={[-0.75, 0.72, 0]}>
          <boxGeometry args={[0.85, 0.55, 0.6]} />
          <PartMaterial
            color={BODY}
            selected={is("frame")}
            roughness={0.5}
            {...mp}
          />
        </mesh>
        {[-0.3, 0.3].map((z) => (
          <mesh key={z} position={[-0.78, 0.68, z]} scale={[1.4, 1, 0.5]}>
            <sphereGeometry args={[0.24, 20, 16]} />
            <PartMaterial
              color={BODY}
              selected={is("frame")}
              roughness={0.45}
              {...mp}
            />
          </mesh>
        ))}
        <mesh position={[-1.22, 0.62, 0]}>
          <boxGeometry args={[0.06, 0.12, 0.2]} />
          <PartMaterial
            color="#b33a2b"
            selected={is("frame")}
            roughness={0.4}
            {...mp}
          />
        </mesh>
      </PartGroup>

      {/* LEGSHIELD — shield, horn cover, lamp, fork, fender */}
      <PartGroup
        id="legshield"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
        position={[e * 0.7, e * 0.3, 0]}
      >
        <mesh position={[0.72, 0.85, 0]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.16, 1.0, 0.55]} />
          <PartMaterial
            color={BODY}
            selected={is("legshield")}
            roughness={0.45}
            {...mp}
          />
        </mesh>
        <mesh position={[0.6, 0.78, 0]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.1, 0.3, 0.2]} />
          <PartMaterial
            color={BODY_DARK}
            selected={is("legshield")}
            roughness={0.5}
            {...mp}
          />
        </mesh>
        <mesh position={[0.6, 1.08, 0]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <PartMaterial
            color={CREAM}
            selected={is("legshield")}
            roughness={0.3}
            emissive="#fde047"
            emissiveIntensity={0.4}
            {...mp}
          />
        </mesh>
        <mesh position={[0.86, 0.55, 0]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
          <PartMaterial
            color={CHROME}
            selected={is("legshield")}
            metalness={0.8}
            roughness={0.3}
            {...mp}
          />
        </mesh>
        <mesh position={[0.95, 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.37, 0.045, 10, 20, Math.PI]} />
          <PartMaterial
            color={BODY}
            selected={is("legshield")}
            roughness={0.5}
            {...mp}
          />
        </mesh>
      </PartGroup>

      {/* HANDLEBAR — column, headset, bar, grips, mirror */}
      <PartGroup
        id="handlebar"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
        position={[e * 0.3, e * 0.85, 0]}
      >
        <mesh position={[0.82, 1.25, 0]} rotation={[0, 0, -0.18]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          <PartMaterial
            color={CHROME}
            selected={is("handlebar")}
            metalness={0.8}
            roughness={0.3}
            {...mp}
          />
        </mesh>
        <mesh position={[0.85, 1.42, 0]}>
          <boxGeometry args={[0.22, 0.12, 0.3]} />
          <PartMaterial
            color={BODY}
            selected={is("handlebar")}
            roughness={0.5}
            {...mp}
          />
        </mesh>
        <mesh position={[0.86, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.72, 12]} />
          <PartMaterial
            color={CHROME}
            selected={is("handlebar")}
            metalness={0.8}
            roughness={0.3}
            {...mp}
          />
        </mesh>
        {[-0.32, 0.32].map((z) => (
          <mesh key={z} position={[0.86, 1.5, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.14, 12]} />
            <PartMaterial
              color={RUBBER}
              selected={is("handlebar")}
              roughness={0.85}
              {...mp}
            />
          </mesh>
        ))}
        <mesh position={[0.82, 1.62, -0.25]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
          <PartMaterial
            color={CHROME}
            selected={is("handlebar")}
            metalness={0.8}
            roughness={0.3}
            {...mp}
          />
        </mesh>
        <mesh position={[0.8, 1.74, -0.27]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <PartMaterial
            color={CHROME}
            selected={is("handlebar")}
            metalness={0.9}
            roughness={0.15}
            {...mp}
          />
        </mesh>
      </PartGroup>

      {/* WHEELS — front and rear, split apart when exploded */}
      <PartGroup
        id="wheels"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
      >
        <group position={[e * 0.55, 0, 0]}>
          <Wheel
            position={[0.95, 0.34, 0]}
            selected={is("wheels")}
            wireframe={mp.wireframe}
            xray={mp.xray}
          />
        </group>
        <group position={[-e * 0.55, 0, 0]}>
          <Wheel
            position={[-0.85, 0.34, 0]}
            selected={is("wheels")}
            wireframe={mp.wireframe}
            xray={mp.xray}
          />
        </group>
      </PartGroup>

      {/* ENGINE — side-mounted block, cooling fins, exhaust */}
      <PartGroup
        id="engine"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
        position={[0, e * 0.1, e * 0.85]}
      >
        <mesh position={[-0.45, 0.32, 0.3]}>
          <boxGeometry args={[0.42, 0.3, 0.3]} />
          <PartMaterial
            color="#44403c"
            selected={is("engine")}
            metalness={0.4}
            roughness={0.6}
            {...mp}
          />
        </mesh>
        {[0.4, 0.46, 0.52].map((y) => (
          <mesh key={y} position={[-0.45, y, 0.3]}>
            <boxGeometry args={[0.3, 0.03, 0.36]} />
            <PartMaterial
              color="#292524"
              selected={is("engine")}
              metalness={0.5}
              roughness={0.55}
              {...mp}
            />
          </mesh>
        ))}
        <mesh position={[-0.7, 0.22, 0.32]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 12]} />
          <PartMaterial
            color={CHROME}
            selected={is("engine")}
            metalness={0.8}
            roughness={0.35}
            {...mp}
          />
        </mesh>
        <mesh position={[-1.05, 0.24, 0.32]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.09, 0.28, 16]} />
          <PartMaterial
            color={CHROME}
            selected={is("engine")}
            metalness={0.85}
            roughness={0.3}
            {...mp}
          />
        </mesh>
      </PartGroup>

      {/* SEAT — saddle + rear rack */}
      <PartGroup
        id="seat"
        selected={selected ?? null}
        wireframe={mp.wireframe}
        xray={mp.xray}
        onSelect={onSelect}
        position={[0, e * 0.8, 0]}
      >
        <mesh position={[-0.55, 1.05, 0]}>
          <boxGeometry args={[0.55, 0.12, 0.45]} />
          <PartMaterial
            color={LEATHER}
            selected={is("seat")}
            roughness={0.9}
            {...mp}
          />
        </mesh>
        <mesh position={[-0.55, 1.11, 0]} scale={[1, 0.35, 0.9]}>
          <sphereGeometry args={[0.24, 20, 12]} />
          <PartMaterial
            color={LEATHER}
            selected={is("seat")}
            roughness={0.9}
            {...mp}
          />
        </mesh>
        <mesh position={[-1.05, 1.0, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.4]} />
          <PartMaterial
            color={CHROME}
            selected={is("seat")}
            metalness={0.8}
            roughness={0.35}
            {...mp}
          />
        </mesh>
      </PartGroup>

      <Hotspots
        explode={e}
        selected={selected ?? null}
        onSelect={onSelect}
      />
    </group>
  );
}

const HOTSPOT_ANCHORS: { id: VespaPartId; base: [number, number, number] }[] = [
  { id: "frame", base: [-0.35, 0.55, 0.35] },
  { id: "legshield", base: [0.72, 1.0, 0.32] },
  { id: "handlebar", base: [0.86, 1.55, 0.15] },
  { id: "wheels", base: [0.95, 0.4, 0.3] },
  { id: "engine", base: [-0.45, 0.4, 0.5] },
  { id: "seat", base: [-0.55, 1.2, 0.1] },
];

/** Per-part explode offsets must match the PartGroup offsets above. */
function explodeOffset(id: VespaPartId, e: number): [number, number, number] {
  switch (id) {
    case "legshield":
      return [e * 0.7, e * 0.3, 0];
    case "handlebar":
      return [e * 0.3, e * 0.85, 0];
    case "wheels":
      return [e * 0.55, 0, 0];
    case "engine":
      return [0, e * 0.1, e * 0.85];
    case "seat":
      return [0, e * 0.8, 0];
    case "frame":
    default:
      return [0, 0, 0];
  }
}

function Hotspots({
  explode,
  selected,
  onSelect,
}: {
  explode: number;
  selected: VespaPartId | null;
  onSelect: (part: VespaPartId | null) => void;
}) {
  return (
    <group>
      {HOTSPOT_ANCHORS.map(({ id, base }, i) => {
        const o = explodeOffset(id, explode);
        const active = selected === id;
        return (
          <Html
            key={id}
            position={[base[0] + o[0], base[1] + o[1], base[2] + o[2]]}
            center
            distanceFactor={9}
            zIndexRange={[30, 0]}
          >
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                onSelect(active ? null : id);
              }}
              aria-label={`Inspect ${id}`}
              className={`flex h-6 w-6 items-center justify-center text-xs font-bold shadow ${
                active
                  ? "bg-racing text-white"
                  : "border border-stone-400 bg-white text-zinc-900 hover:bg-stone-100"
              }`}
            >
              {i + 1}
            </button>
          </Html>
        );
      })}
    </group>
  );
}

function GlbModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  // Normalize any authored scale/offset: center XZ, seat base at y=0,
  // longest dimension ~2.4 units so the fixed camera always frames it.
  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 2.4 / maxDim;
    ref.current.scale.setScalar(s);
    ref.current.position.set(
      -center.x * s,
      -center.y * s + (size.y * s) / 2,
      -center.z * s,
    );
  }, [gltf]);
  return (
    <group ref={ref}>
      <primitive object={gltf.scene} />
    </group>
  );
}

class GlbErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function VespaViewer({
  explode = 0,
  wireframe = false,
  xray = false,
  selected = null,
  onSelect = () => {},
  glbUrl = null,
  autoRotate = false,
}: VespaViewerProps) {
  return (
    <Canvas
      camera={{ position: [3.2, 1.8, 4.2], fov: 40 }}
      dpr={[1, 2]}
      onPointerMissed={() => onSelect(null)}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} />
      {glbUrl ? (
        <GlbErrorBoundary onError={() => onSelect(null)}>
          <Suspense fallback={null}>
            <GlbModel url={glbUrl} />
          </Suspense>
        </GlbErrorBoundary>
      ) : (
        <ProceduralVespa
          explode={explode}
          wireframe={wireframe}
          xray={xray}
          selected={selected}
          onSelect={onSelect}
        />
      )}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} blur={2} />
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}
