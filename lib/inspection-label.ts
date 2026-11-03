import type { InspectionSession } from "./inspect-session";
import { VESPA_PARTS } from "./vespa-inspect";
import { GTS_PILOT_COMPONENTS } from "./gts-pilot";

/** Keep the accepted part label consistent in the workspace, request and record. */
export function inspectionLabel(session: InspectionSession): string {
  if (session.pilotSelection) return GTS_PILOT_COMPONENTS[session.pilotSelection.componentId].label;
  if (session.agentObservation?.focusId === session.selectedPart) {
    if (session.agentObservation.targetLabel) return session.agentObservation.targetLabel;
    // Compatibility with saved runs made before target labels were persisted.
    if (session.selectedPart === "handlebar" && /\bmirror\b/i.test(session.concern ?? "")) return "Mirror";
    if (session.selectedPart === "wheels" && /\b(tyre|tire)\b/i.test(session.concern ?? "")) return "Tyre";
  }
  return VESPA_PARTS.find(p=>p.id===session.selectedPart)?.label ?? "Unidentified component";
}
