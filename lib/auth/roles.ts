import type { SessionUser, UserRole } from "@/lib/types/store";

type RoleSubject = Pick<SessionUser, "role"> | UserRole | null | undefined;
type AllowedRoles = readonly UserRole[];

function resolveRole(subject: RoleSubject): UserRole | null {
  if (!subject) {
    return null;
  }

  if (typeof subject === "string") {
    return subject;
  }

  return subject.role ?? null;
}

export function hasSomeRole(
  subject: RoleSubject,
  allowedRoles: AllowedRoles,
): boolean {
  const role = resolveRole(subject);

  return role !== null && allowedRoles.includes(role);
}

export function hasRole(
  subject: RoleSubject,
  ...allowedRoles: UserRole[]
): boolean {
  return hasSomeRole(subject, allowedRoles);
}
