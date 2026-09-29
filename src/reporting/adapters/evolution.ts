import { messageFor, readOnlyState } from "./base";
import { AdapterOperation, ReportingAdapter } from "../types";
export const evolutionAdapter: ReportingAdapter = {
  name: "evolution",
  describeCapability: () => ({ adapter: "evolution", canonicalName: "MESSAGING__WHATSAPP-BRIDGE__OBS__20260927_v0.1", target: "127.0.0.1:8082", effectClass: "MESSAGE_SEND", authorizationRequired: true, live: false }),
  inspectConnectionState: () => readOnlyState(evolutionAdapter),
  buildOutboundMessage: messageFor,
  classifyEffect: (operation?: AdapterOperation) => operation === "inspect" ? "READ_ONLY" : "MESSAGE_SEND",
};
