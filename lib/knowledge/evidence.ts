/**
 * Evidence tiers — the honesty system underneath every technical claim.
 *
 * Three levels (knowledge-foundation §6):
 * - verified: manufacturer documentation or reconciled technical evidence.
 *   Only this tier may back actionable compatibility or safety claims.
 * - community: a useful owner/mechanic observation, not universally applicable.
 * - unverified: candidate information awaiting review. Never an asserted
 *   compatibility rule or safety-critical instruction.
 */

export type EvidenceTier = "verified" | "community" | "unverified";

export const EVIDENCE_LABEL: Record<EvidenceTier, string> = {
  verified: "Verified",
  community: "Community-reported",
  unverified: "Unverified",
};

export const EVIDENCE_NOTE: Record<EvidenceTier, string> = {
  verified:
    "Supported by applicable manufacturer documentation or reconciled evidence.",
  community:
    "Useful observation, not established as universally applicable.",
  unverified:
    "Candidate information awaiting review — not an asserted claim.",
};

/**
 * Redistribution rights for a source or asset. Public availability is NOT
 * permission to republish: link-only means cite and link, never copy.
 */
export type LicenseStatus =
  | "original"
  | "permitted"
  | "link-only"
  | "restricted"
  | "unknown";

export const LICENSE_LABEL: Record<LicenseStatus, string> = {
  original: "Original work",
  permitted: "Reuse permitted",
  "link-only": "Link & cite only",
  restricted: "Restricted",
  unknown: "Rights unknown",
};
