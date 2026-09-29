import { messageFor, readOnlyState } from "./base";
import { AdapterOperation, ReportingAdapter } from "../types";
export const driveAdapter: ReportingAdapter = {
  name: "drive",
  describeCapability: () => ({ adapter: "drive", canonicalName: "REPORTING__GOOGLE-DRIVE__ARCHIVE__v0.1", target: "unconfigured", effectClass: "ARCHIVE", authorizationRequired: true, live: false }),
  inspectConnectionState: () => readOnlyState(driveAdapter),
  buildOutboundMessage: messageFor,
  classifyEffect: (operation?: AdapterOperation) => operation === "inspect" ? "READ_ONLY" : "ARCHIVE",
};
