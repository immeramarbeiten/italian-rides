import { redirect } from "next/navigation";

/**
 * One story page: the Vespa milestone explorer now lives at /timeline,
 * which covers all 12 models with the same data. This URL stays as a
 * redirect so older links keep working.
 */
export default function VespaBrandRedirect() {
  redirect("/timeline");
}
