import { messageFor, readOnlyState } from "./base";
import { AdapterOperation, ReportingAdapter } from "../types";
export const slackAdapter: ReportingAdapter = {
  name: "slack",
  describeCapability: () => ({ adapter: "slack", canonicalName: "REPORTING__SLACK__MESSAGE_SEND__v0.1", target: "unconfigured", effectClass: "MESSAGE_SEND", authorizationRequired: true, live: false }),
  inspectConnectionState: () => readOnlyState(slackAdapter),
  buildOutboundMessage: messageFor,
  classifyEffect: (operation?: AdapterOperation) => operation === "inspect" ? "READ_ONLY" : "MESSAGE_SEND",
};
