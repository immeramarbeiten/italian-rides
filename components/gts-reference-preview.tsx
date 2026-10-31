import { GtsAssemblyExperience } from "./gts-assembly-experience";

export function GtsReferencePreview() {
  return <div>
    <p className="font-mono text-xs text-zinc-500">INDEPENDENT GTS 125 REFERENCE STUDY</p>
    <h1 className="mt-2 text-3xl font-bold">Mirror and handlebar</h1>
    <p className="mb-5 mt-3 max-w-2xl text-sm text-zinc-600">Explore an illustrative GTS 125 front assembly and separate its major visual components.</p>
    <GtsAssemblyExperience />
  </div>;
}
