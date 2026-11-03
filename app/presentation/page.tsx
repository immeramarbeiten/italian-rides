import { PresentationShell } from "@/components/presentation-shell";
export const metadata={title:"Demo presentation — Italian Rides",robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{start?:string}>}) {
  const {start="/"}=await searchParams;
  const safeStart=start.startsWith("/") && !start.startsWith("//") && !start.includes("\\") && !start.startsWith("/presentation") ? start : "/";
  return <PresentationShell start={safeStart}/>;
}
