import assert from "node:assert/strict";
import test from "node:test";

import {
  createSemmesRd001PreClosureEnvelope,
  SEMMES_RD001_PRE_CLOSURE,
} from "../../src/reporting/adapters/semmes-rd001";

test("Semmes RD-001 adapter preserves pre-closure evidence state", () => {
  const envelope = createSemmesRd001PreClosureEnvelope();

  assert.equal(envelope.source, "SEMMES-RD001");
  assert.equal(envelope.authorityEffect, "NONE");

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.lifecycleState,
    "CLOSURE_ELIGIBLE",
  );

  assert.equal(SEMMES_RD001_PRE_CLOSURE.closed, false);

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.operatorClosureAuthorizationRecorded,
    false,
  );

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.sourceAdmissionState,
    "ADMITTED_REFERENCE_ONLY",
  );

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.adoptionState,
    "REFERENCE_ONLY",
  );
});

test("Semmes RD-001 evidence linkage conveys no authority", () => {
  const envelope = createSemmesRd001PreClosureEnvelope();

  assert.equal(envelope.authorityEffect, "NONE");
  assert.equal(SEMMES_RD001_PRE_CLOSURE.numaRegistryMutated, false);
  assert.equal(SEMMES_RD001_PRE_CLOSURE.policyAdopted, false);
  assert.equal(SEMMES_RD001_PRE_CLOSURE.onchainMutation, false);
});

test("Semmes RD-001 adapter preserves exact content-addressed evidence", () => {
  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.regressionProofSha256,
    "24ce448011fd5d419eac9170ab38e7d7f23dc6801a91a4adaea6f2facb07063f",
  );

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.preClosureOperatorLedgerSha256,
    "1a80c21cb1af9648355e96d0a8818fc2d35b0c1633764cbfa94f7cdbebd7b640",
  );

  assert.equal(
    SEMMES_RD001_PRE_CLOSURE.semmesSideLinkSha256,
    "c30ff7206d3e88ad722fecba1396fa37a7c995e259069b6938e84f4e48463515",
  );
});

import {
  createSemmesRd001PostClosureEnvelope,
  SEMMES_RD001_POST_CLOSURE,
} from "../../src/reporting/adapters/semmes-rd001";

test("Semmes RD-001 post-closure state is source-backed by closure evidence", () => {
  const envelope = createSemmesRd001PostClosureEnvelope();

  assert.equal(envelope.source, "SEMMES-RD001");
  assert.equal(envelope.authorityEffect, "NONE");

  assert.equal(SEMMES_RD001_POST_CLOSURE.lifecycleState, "CLOSED");
  assert.equal(SEMMES_RD001_POST_CLOSURE.closed, true);
  assert.equal(SEMMES_RD001_POST_CLOSURE.closureExecuted, true);

  assert.equal(
    SEMMES_RD001_POST_CLOSURE.preClosureWitnessManifestSha256,
    "59804059c35420fa25eafb42bd5fb2b96554a6fb50134dc19c6d4a76140d2dd9",
  );

  assert.equal(
    SEMMES_RD001_POST_CLOSURE.operatorDecisionRecordSha256,
    "17ff5600405590efd1b48c772fd54879b6fb82349d6db22127f521c6c641f3f5",
  );

  assert.equal(
    SEMMES_RD001_POST_CLOSURE.closureRecordSha256,
    "15e3567cfa12dfc4a09b1396fdee6dfecf36df23121782623dc42d3fc4b7cd58",
  );

  assert.equal(
    SEMMES_RD001_POST_CLOSURE.postClosureOperatorLedgerSha256,
    "ab31ba980b96c5d641828e74f3ef453ca65d3f4fc609d36f6edb4ea462d5df72",
  );
});

test("closed incident state does not propagate authority", () => {
  const envelope = createSemmesRd001PostClosureEnvelope();

  assert.equal(envelope.authorityEffect, "NONE");
  assert.equal(SEMMES_RD001_POST_CLOSURE.productionAuthorityChanged, false);
  assert.equal(SEMMES_RD001_POST_CLOSURE.numaRegistryMutated, false);
  assert.equal(SEMMES_RD001_POST_CLOSURE.policyAdopted, false);
  assert.equal(SEMMES_RD001_POST_CLOSURE.onchainMutation, false);
});

test("post-closure operator decision evidence survives reporting boundary", () => {
  const envelope = createSemmesRd001PostClosureEnvelope();
  const serialized = JSON.stringify(envelope);

  assert.match(
    serialized,
    /17ff5600405590efd1b48c772fd54879b6fb82349d6db22127f521c6c641f3f5/,
  );

  assert.doesNotMatch(serialized, /authorization/i);
});
