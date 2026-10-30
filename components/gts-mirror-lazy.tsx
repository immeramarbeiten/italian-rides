"use client";
import dynamic from "next/dynamic";
const GtsMirrorLazy = dynamic(() => import("./gts-mirror-scene"), { ssr: false, loading: () => <p>Loading the 3D reference…</p> });
export default GtsMirrorLazy;
