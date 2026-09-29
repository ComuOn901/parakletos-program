import { AuthorizationState, EffectClass } from "../types";
export function isPermitted(effectClass: EffectClass, authorizationState: AuthorizationState): boolean {
  if (effectClass === "UNKNOWN") return false;
  if (effectClass === "MESSAGE_SEND") return authorizationState === "AUTHORIZED";
  return effectClass === "READ_ONLY" || effectClass === "ARCHIVE" || effectClass === "DRAFT_CREATE";
}
