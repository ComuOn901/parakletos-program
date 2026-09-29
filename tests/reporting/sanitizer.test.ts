import assert from "node:assert/strict";
import { test } from "node:test";
import { createReportEnvelope } from "../../src/reporting/envelope";
import { sanitizeLocalState, auditBoundary } from "../../src/reporting/sanitizer";

test("sanitization removes secrets and private values", () => {
  const clean = sanitizeLocalState({ apiKey: "secret", password: "pw", token: "tok", path: "/Users/private/a", email: "private@example.com", safe: "ok" });
  assert.deepEqual(clean, { safe: "ok", path: " [REDACTED_LOCAL_PATH]", email: "[REDACTED_EMAIL]" });
  assert.equal(auditBoundary(clean).clean, true);
});

test("allowlisted external contact survives sanitization", () => {
  const clean = sanitizeLocalState({ contact: "ops@example.com" }, { allowlistedEmails: ["ops@example.com"] });
  assert.equal(clean.contact, "ops@example.com");
});
