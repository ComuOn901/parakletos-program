import { AdapterName, ReportingAdapter } from "./types";
import { driveAdapter } from "./adapters/drive";
import { evolutionAdapter } from "./adapters/evolution";
import { gmailAdapter } from "./adapters/gmail";
import { slackAdapter } from "./adapters/slack";
const adapters: Record<AdapterName, ReportingAdapter> = { slack: slackAdapter, gmail: gmailAdapter, drive: driveAdapter, evolution: evolutionAdapter };
export function getAdapter(name: AdapterName): ReportingAdapter { return adapters[name]; }
export function listAdapters(): ReportingAdapter[] { return Object.values(adapters); }
