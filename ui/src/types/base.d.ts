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

