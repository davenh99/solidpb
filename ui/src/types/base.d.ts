/* This file was automatically generated, changes will be overwritten. */

export interface BaseRecord {
  id: string;
  collectionName: string;
  collectionId: string;
  created: string;
  updated: string;
}

/* Collection type: auth */
export interface User {
  email: string; // email
  emailVisibility?: boolean; // bool
  verified?: boolean; // bool
  name?: string; // text
  avatar?: string; // file
  role: string; // relation
}

export type UserRecord = User & BaseRecord;

/* Collection type: base */
export interface Changelog {
  collection: string; // text
  recordId: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy: string; // relation
  reason?: string; // text
}

export type ChangelogRecord = Changelog & BaseRecord;

/* Collection type: base */
export interface ChangelogDiff {
  changelogId: string; // relation
  field: string; // text
  valueOld?: string; // text
  valueNew?: string; // text
}

export type ChangelogDiffRecord = ChangelogDiff & BaseRecord;

/* Collection type: base */
export interface Role {
  name: string; // text
  permissions?: string[]; // relation
}

export type RoleRecord = Role & BaseRecord;

/* Collection type: base */
export interface Permission {
  name: string; // text
  collections?: any; // json
  canView?: boolean; // bool
  canList?: boolean; // bool
  canCreate?: boolean; // bool
  canUpdate?: boolean; // bool
  canDelete?: boolean; // bool
}

export type PermissionRecord = Permission & BaseRecord;

