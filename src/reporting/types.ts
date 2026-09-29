export type ReportMode = "OBS" | "VER" | "AUT" | "EXE";
export type Classification = "INTERNAL" | "SANITIZED_EXTERNAL";
export type AdapterName = "slack" | "gmail" | "drive" | "evolution";
export type EffectClass = "READ_ONLY" | "ARCHIVE" | "DRAFT_CREATE" | "MESSAGE_SEND" | "UNKNOWN";
export type PublicationState = "NOT_REQUESTED" | "READY" | "DRAFT_CREATED" | "AUTHORIZED" | "SENT" | "FAILED" | "UNKNOWN";
export type AuthorizationState = "NOT_REQUESTED" | "PENDING" | "AUTHORIZED" | "DENIED" | "UNKNOWN";
export type ExecutionState = "NOT_PERFORMED" | "ATTEMPTED" | "SUCCEEDED" | "FAILED" | "UNKNOWN";

export type FactValue = string | number | boolean;
export type ReportFacts = Record<string, FactValue>;

export type ReportEnvelope = {
  reportId: string;
  createdAt: string;
  mode: ReportMode;
  source: string;
  authorityEffect: "NONE";
  classification: Classification;
  content: { summary: string; facts: ReportFacts };
  publication: Record<AdapterName, PublicationState>;
  /** Internal boundary metadata; never used as an external publication payload. */
  boundaryAllowlist?: { emails?: string[]; paths?: string[] };
};

export type AdapterOperation = "publish" | "draft" | "archive" | "inspect";

export type AdapterCapability = {
  adapter: AdapterName;
  canonicalName: string;
  target: string;
  effectClass: EffectClass;
  authorizationRequired: boolean;
  live: false;
};

export type PublicationRequest = {
  envelope: ReportEnvelope;
  operation?: AdapterOperation;
  authorizationState?: AuthorizationState;
};

export type PublicationReceipt = {
  requestId: string;
  reportId: string;
  adapter: AdapterName;
  effectClass: EffectClass;
  authorizationState: AuthorizationState;
  executionState: ExecutionState;
  observedAt: string;
  source: string;
  preState: PublicationState;
  postState: PublicationState;
  authorityEffect: "NONE";
};

export type ReportingAdapter = {
  name: AdapterName;
  describeCapability(): AdapterCapability;
  inspectConnectionState(): { state: string; effectClass: "READ_ONLY" };
  buildOutboundMessage(envelope: ReportEnvelope): { subject?: string; body: string; payload: Record<string, unknown> };
  classifyEffect(operation?: AdapterOperation): EffectClass;
};
