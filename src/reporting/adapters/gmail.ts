import { messageFor, readOnlyState } from "./base";
import { AdapterOperation, ReportingAdapter } from "../types";
export const gmailAdapter: ReportingAdapter = {
  name: "gmail",
  describeCapability: () => ({ adapter: "gmail", canonicalName: "REPORTING__GMAIL__MESSAGE_SEND__v0.1", target: "unconfigured", effectClass: "MESSAGE_SEND", authorizationRequired: true, live: false }),
  inspectConnectionState: () => readOnlyState(gmailAdapter),
  buildOutboundMessage: messageFor,
  classifyEffect: (operation?: AdapterOperation) => operation === "draft" ? "DRAFT_CREATE" : operation === "inspect" ? "READ_ONLY" : "MESSAGE_SEND",
};
