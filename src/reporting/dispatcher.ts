import { randomUUID } from "node:crypto";
import { validateEnvelope } from "./envelope";
import { getAdapter } from "./registry";
import { AdapterName, AuthorizationState, ExecutionState, PublicationRequest, PublicationReceipt, PublicationState } from "./types";
import { isPermitted } from "./policies/reporting-policy";

export function dispatch(adapterName: AdapterName | string, request: PublicationRequest): PublicationReceipt {
  const adapter = adapterName in { slack: true, gmail: true, drive: true, evolution: true } ? getAdapter(adapterName as AdapterName) : undefined;
  const operation = request.operation ?? "publish";
  const authorizationState: AuthorizationState = request.authorizationState ?? "NOT_REQUESTED";
  const effectClass = adapter?.classifyEffect(operation) ?? "UNKNOWN";
  const preState: PublicationState = adapterName in request.envelope.publication ? request.envelope.publication[adapterName as AdapterName] : "UNKNOWN";
  let executionState: ExecutionState = "NOT_PERFORMED";
  let postState: PublicationState = preState;
  try { validateEnvelope(request.envelope); } catch {
    executionState = "FAILED"; postState = "FAILED";
  }
  if (executionState !== "FAILED" && !isPermitted(effectClass, authorizationState)) { executionState = "NOT_PERFORMED"; postState = "READY"; }
  else if (executionState !== "FAILED") { executionState = "NOT_PERFORMED"; postState = operation === "draft" ? "DRAFT_CREATED" : "READY"; }
  return {
    requestId: `request_${randomUUID()}`, reportId: request.envelope.reportId, adapter: adapterName as AdapterName,
    effectClass, authorizationState, executionState, observedAt: new Date().toISOString(), source: request.envelope.source,
    preState, postState, authorityEffect: "NONE",
  };
}
