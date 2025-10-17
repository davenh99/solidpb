/* The rest of your app types */
import type { Permission, Role, User } from "./base";

// Stronger typed version of the auto-generated, as the auto generated doesn't know the type of json
export type TPermission = Omit<Permission, "collections"> & { collections: string[] };

export type TRole = Role & { expand?: { permissions: TPermission[] } };

export type TUser = User & { expand?: { role: TRole } };
