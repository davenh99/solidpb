/* This file was automatically generated, changes will be overwritten. */

export interface User {
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name?: string;
  avatar?: string;
}

/* Collection type: auth */
export interface UserRecord {
  id: string; // text
  email: string; // email
  emailVisibility?: boolean; // bool
  verified?: boolean; // bool
  name?: string; // text
  avatar?: string; // file
  created: string; // autodate
  updated: string; // autodate
}

export interface Changelog {
  collection: string;
  recordID: string;
  field: string;
  valueOld?: string;
  valueNew: string;
  changeType: "create" | "update" | "delete";
  changedBy?: string;
  reason?: string;
}

/* Collection type: base */
export interface ChangelogRecord {
  id: string; // text
  collection: string; // text
  recordID: string; // text
  field: string; // text
  valueOld?: string; // text
  valueNew: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy?: string; // relation
  reason?: string; // text
  created: string; // autodate
  updated: string; // autodate
}

export interface Role {
  name: string;
  permissions?: string[];
}

/* Collection type: base */
export interface RoleRecord {
  id: string; // text
  name: string; // text
  permissions?: string[]; // relation
  created: string; // autodate
  updated: string; // autodate
}

export interface Permission {
  name: string;
  collections: any;
  canView?: boolean;
  canList?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

/* Collection type: base */
export interface PermissionRecord {
  id: string; // text
  name: string; // text
  collections: any; // json
  canView?: boolean; // bool
  canList?: boolean; // bool
  canCreate?: boolean; // bool
  canUpdate?: boolean; // bool
  canDelete?: boolean; // bool
  created: string; // autodate
  updated: string; // autodate
}

