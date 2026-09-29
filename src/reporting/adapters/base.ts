import { ReportEnvelope, ReportingAdapter } from "../types";

export function messageFor(envelope: ReportEnvelope) {
  return {
    subject: `NUMA report ${envelope.reportId}`,
    body: `${envelope.content.summary}\n${Object.entries(envelope.content.facts).map(([key, value]) => `${key}: ${value}`).join("\n")}`,
    payload: { reportId: envelope.reportId, summary: envelope.content.summary, facts: envelope.content.facts },
  };
}

export function readOnlyState(adapter: ReportingAdapter) {
  return { adapter: adapter.name, state: "UNINSPECTED", effectClass: "READ_ONLY" as const };
}
