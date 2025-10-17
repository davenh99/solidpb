/* The rest of your app types */
import type { Permission } from "./base";

// Stronger typed version of the auto-generated, as the auto generated doesn't know the type of json
export type TPermission = Omit<Permission, "collections"> & { collections: string[] };
