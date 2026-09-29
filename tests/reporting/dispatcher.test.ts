import assert from "node:assert/strict";
import { test } from "node:test";
import { createReportEnvelope } from "../../src/reporting/envelope";
import { dispatch } from "../../src/reporting/dispatcher";

const report = () => createReportEnvelope({ source: "OLIVE reachability", summary: "evidence supplied", facts: { state: "UNKNOWN" } });

test("message sends are blocked without authorization", () => {
  for (const adapter of ["slack", "gmail", "evolution"] as const) {
    const receipt = dispatch(adapter, { envelope: report() });
    assert.equal(receipt.effectClass, "MESSAGE_SEND");
    assert.equal(receipt.executionState, "NOT_PERFORMED");
    assert.equal(receipt.postState, "READY");
    assert.equal(receipt.authorityEffect, "NONE");
  }
});

test("Drive archival is separate from message send", () => {
  const receipt = dispatch("drive", { envelope: report(), operation: "archive" });
  assert.equal(receipt.effectClass, "ARCHIVE");
  assert.equal(receipt.executionState, "NOT_PERFORMED");
  assert.equal(receipt.postState, "READY");
});

test("authorized send remains prepared-only in M0.1", () => {
  const receipt = dispatch("slack", { envelope: report(), authorizationState: "AUTHORIZED" });
  assert.equal(receipt.executionState, "NOT_PERFORMED");
  assert.equal(receipt.authorityEffect, "NONE");
});

test("unknown adapter semantics default to blocked", () => {
  const receipt = dispatch("future-adapter", { envelope: report(), authorizationState: "AUTHORIZED" });
  assert.equal(receipt.effectClass, "UNKNOWN");
  assert.equal(receipt.executionState, "NOT_PERFORMED");
});
