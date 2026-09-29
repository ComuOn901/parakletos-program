import { createReportEnvelope } from "../envelope";

/**
 * Semmes RD-001 external evidence adapter.
 *
 * This adapter represents supplied, content-addressed evidence.
 * It does not:
 * - authorize incident closure
 * - execute closure
 * - publish externally
 * - mutate NUMA
 * - mutate Semmes source evidence
 * - write on-chain state
 * - change authority
 */

export const SEMMES_RD001_PRE_CLOSURE = {
  eventId: "SEMMES-RD001-ZD-EVIDENCE-001",
  eventClass: "UNPROVEN_PRECISION_PROMOTION",

  lifecycleState: "CLOSURE_ELIGIBLE",
  closed: false,

  regressionProofSha256:
    "24ce448011fd5d419eac9170ab38e7d7f23dc6801a91a4adaea6f2facb07063f",

  preClosureOperatorLedgerSha256:
    "1a80c21cb1af9648355e96d0a8818fc2d35b0c1633764cbfa94f7cdbebd7b640",

  semmesSideLinkSha256:
    "c30ff7206d3e88ad722fecba1396fa37a7c995e259069b6938e84f4e48463515",

  operatorClosureAuthorizationRecorded: false,

  sourceAdmissionState: "ADMITTED_REFERENCE_ONLY",
  adoptionState: "REFERENCE_ONLY",

  numaRegistryMutated: false,
  policyAdopted: false,
  onchainMutation: false,

  authorityEffect: "NONE" as const,
} as const;

export function createSemmesRd001PreClosureEnvelope() {
  return createReportEnvelope({
    source: "SEMMES-RD001",
    summary:
      "ZD-EVIDENCE-001 is closure-eligible; final closure remains separately operator-authorized and unperformed.",
    facts: {
      ...SEMMES_RD001_PRE_CLOSURE,
    },
  });
}

/**
 * Post-closure observation.
 *
 * This records the resulting Semmes lifecycle state after separately
 * recorded operator authorization and closure execution.
 *
 * Observation of closure does not convey authority.
 */
export const SEMMES_RD001_POST_CLOSURE = {
  eventId: "SEMMES-RD001-ZD-EVIDENCE-001",
  eventClass: "UNPROVEN_PRECISION_PROMOTION",

  lifecycleState: "CLOSED",
  closed: true,
  closureExecuted: true,

  preClosureWitnessManifestSha256:
    "59804059c35420fa25eafb42bd5fb2b96554a6fb50134dc19c6d4a76140d2dd9",

  operatorDecisionRecordSha256:
    "17ff5600405590efd1b48c772fd54879b6fb82349d6db22127f521c6c641f3f5",

  closureRecordSha256:
    "15e3567cfa12dfc4a09b1396fdee6dfecf36df23121782623dc42d3fc4b7cd58",

  postClosureOperatorLedgerSha256:
    "ab31ba980b96c5d641828e74f3ef453ca65d3f4fc609d36f6edb4ea462d5df72",

  productionAuthorityChanged: false,
  numaRegistryMutated: false,
  policyAdopted: false,
  onchainMutation: false,

  authorityEffect: "NONE" as const,
} as const;

export function createSemmesRd001PostClosureEnvelope() {
  return createReportEnvelope({
    source: "SEMMES-RD001",
    summary:
      "ZD-EVIDENCE-001 closure observed after separately recorded operator decision and closure execution.",
    facts: {
      ...SEMMES_RD001_POST_CLOSURE,
    },
  });
}
