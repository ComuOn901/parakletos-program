import assert from "node:assert/strict";
import { test } from "node:test";
import { createReportEnvelope } from "../../src/reporting/envelope";
import { dispatch } from "../../src/reporting/dispatcher";

test("authority effect remains NONE through every publication receipt", () => {
  const envelope = createReportEnvelope({ source: "Parakletos evidence receipt", summary: "receipt observed", facts: { verified: false } });
  for (const adapter of ["slack", "gmail", "drive", "evolution"] as const) {
    assert.equal(dispatch(adapter, { envelope, operation: adapter === "drive" ? "archive" : "publish" }).authorityEffect, "NONE");
  }
});

test("connection or reachability evidence does not authorize a send", () => {
  const envelope = createReportEnvelope({ source: "OLIE reachability", summary: "reachable", facts: { reachable: true, authenticated: true } });
  const receipt = dispatch("evolution", { envelope, authorizationState: "NOT_REQUESTED" });
  assert.equal(receipt.executionState, "NOT_PERFORMED");
  assert.equal(receipt.postState, "READY");
});
