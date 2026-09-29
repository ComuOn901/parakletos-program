import assert from "node:assert/strict";
import { test } from "node:test";
import { createReportEnvelope } from "../../src/reporting/envelope";

test("report generation does not imply delivery", () => {
  const report = createReportEnvelope({ source: "PRIME", summary: "health observed", facts: { result: "supplied" } });
  assert.equal(report.publication.slack, "NOT_REQUESTED");
  assert.equal(report.authorityEffect, "NONE");
});
