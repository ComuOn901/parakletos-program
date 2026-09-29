import assert from "node:assert/strict";
import { test } from "node:test";
import { evolutionAdapter } from "../../src/reporting/adapters/evolution";
import { createReportEnvelope } from "../../src/reporting/envelope";

test("Evolution connection inspection is read-only", () => {
  assert.equal(evolutionAdapter.describeCapability().target, "127.0.0.1:8082");
  assert.equal(evolutionAdapter.inspectConnectionState().effectClass, "READ_ONLY");
  assert.equal(evolutionAdapter.classifyEffect("inspect"), "READ_ONLY");
});

test("Evolution transport does not infer connection or authority", () => {
  const message = evolutionAdapter.buildOutboundMessage(createReportEnvelope({ source: "observation", summary: "state supplied", facts: { connected: false } }));
  assert.equal(String(message.payload.reportId).startsWith("report_"), true);
  assert.equal(evolutionAdapter.describeCapability().authorizationRequired, true);
});
