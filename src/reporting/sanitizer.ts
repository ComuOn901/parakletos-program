const SECRET_KEY = /(credential|password|passwd|secret|token|api.?key|private.?key|pairing|session|authorization|webhook|environment|env)/i;
const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PRIVATE_PATH = /(?:\/Users\/[^\s,"']+|\/home\/[^\s,"']+|[A-Z]:\\Users\\[^\s,"']+|~\/[^\s,"']+|\.\.\/[^\s,"']+)/g;

export type BoundaryAudit = { clean: boolean; findings: string[] };

function scrub(value: unknown, path: string, allowlistedEmails: Set<string>, allowlistedPaths: Set<string>): unknown {
  if (Array.isArray(value)) return value.map((item, index) => scrub(item, `${path}[${index}]`, allowlistedEmails, allowlistedPaths));
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (SECRET_KEY.test(key)) continue;
      result[key] = scrub(item, `${path}.${key}`, allowlistedEmails, allowlistedPaths);
    }
    return result;
  }
  if (typeof value !== "string") return value;
  const withoutEmails = value.replace(EMAIL, (match) => allowlistedEmails.has(match.toLowerCase()) ? match : "[REDACTED_EMAIL]");
  return withoutEmails.replace(PRIVATE_PATH, (match) => allowlistedPaths.has(match.trim()) ? match : " [REDACTED_LOCAL_PATH]");
}

export function sanitizeLocalState<T>(state: T, options: { allowlistedEmails?: string[]; allowlistedPaths?: string[] } = {}): T {
  return scrub(state, "$", new Set((options.allowlistedEmails ?? []).map((v) => v.toLowerCase())), new Set(options.allowlistedPaths ?? [])) as T;
}

export function auditBoundary(value: unknown, options: { allowlistedEmails?: string[] } = {}): BoundaryAudit {
  const serialized = JSON.stringify(value);
  const findings: string[] = [];
  if (SECRET_KEY.test(serialized)) findings.push("sensitive key or credential marker present");
  const allowed = new Set((options.allowlistedEmails ?? []).map((v) => v.toLowerCase()));
  for (const match of serialized.match(EMAIL) ?? []) if (!allowed.has(match.toLowerCase())) { findings.push("unallowlisted email-like value present"); break; }
  if (PRIVATE_PATH.test(serialized)) findings.push("local private path present");
  return { clean: findings.length === 0, findings };
}
