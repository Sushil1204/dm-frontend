import type { Access } from "payload";

/**
 * Structural role check against an unknown user value — compatible with
 * Payload's untyped user, the generated User, and ClientUser.
 */
function roleOf(user: unknown): string | undefined {
  return (user as { role?: string } | null | undefined)?.role;
}

export const isAdmin = (user: unknown): boolean => roleOf(user) === "admin";

export const isEditor = (user: unknown): boolean => {
  const role = roleOf(user);
  return role === "admin" || role === "editor";
};

/** Any authenticated site user (only admins and editors can authenticate). */
export const signedIn: Access = ({ req }) => Boolean(req.user);

/** Signed-in users see everything; the public only sees published docs. */
export const publishedRead: Access = ({ req }) =>
  req.user ? true : { published: { equals: true } };

/** Admins and editors manage catalogue content. */
export const editorWrite: Access = ({ req }) => isEditor(req.user);

export const adminWrite: Access = ({ req }) => isAdmin(req.user);
