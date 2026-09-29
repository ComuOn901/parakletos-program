import { randomUUID } from "node:crypto";
import { auditBoundary, sanitizeLocalState } from "./sanitizer";
import { ReportEnvelope, ReportFacts, ReportMode } from "./types";

export function createReportEnvelope(input: {
  source: string;
  summary: string;
  facts: ReportFacts;
  mode?: ReportMode;
  reportId?: string;
  createdAt?: string;
  allowlistedEmails?: string[];
  allowlistedPaths?: string[];
}): ReportEnvelope {
  const content = sanitizeLocalState({ summary: input.summary, facts: input.facts }, {
    allowlistedEmails: input.allowlistedEmails,
    allowlistedPaths: input.allowlistedPaths,
  });
  const audit = auditBoundary(content, { allowlistedEmails: input.allowlistedEmails });
  if (!audit.clean) throw new Error(`REPORT_BOUNDARY_FAILED: ${audit.findings.join(", ")}`);
  return {
    reportId: input.reportId ?? `report_${randomUUID()}`,
    createdAt: input.createdAt ?? new Date().toISOString(),
    mode: input.mode ?? "OBS",
    source: input.source,
    authorityEffect: "NONE",
    classification: "SANITIZED_EXTERNAL",
    content,
    boundaryAllowlist: { emails: input.allowlistedEmails, paths: input.allowlistedPaths },
    publication: { slack: "NOT_REQUESTED", gmail: "NOT_REQUESTED", drive: "NOT_REQUESTED", evolution: "NOT_REQUESTED" },
  };
}

export function validateEnvelope(envelope: ReportEnvelope): void {
  if (envelope.authorityEffect !== "NONE") throw new Error("AUTHORITY_EFFECT_MUST_REMAIN_NONE");
  const audit = auditBoundary(envelope.content, { allowlistedEmails: envelope.boundaryAllowlist?.emails });
  if (!audit.clean) throw new Error(`REPORT_BOUNDARY_FAILED: ${audit.findings.join(", ")}`);
}
