import { TPermission, TUser } from "../types";

export function hasPermission(user: TUser | null, collection: string, action?: keyof TPermission) {
  if (!user?.role) return false;
  if (user.expand?.role.name === "admin") return true;

  // Check if any permissions allow the action
  return user.expand?.role.expand?.permissions.some((perm) => {
    const collections = perm.collections ?? [];
    const matches = collections.includes("*") || collections.includes(collection);
    return matches && perm && perm[action!] === true;
  });
}
