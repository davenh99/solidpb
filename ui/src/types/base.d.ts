/*This file was automatically generated, changes will be overwritten.*/

/* Collection type: auth */
export interface User {
  id: string; // text
  email: string; // email
  emailVisibility: boolean; // bool
  verified: boolean; // bool
  name: string; // text
  avatar: string; // file
  created: string; // autodate
  updated: string; // autodate
}

/* Collection type: base */
export interface Changelog {
  id: string; // text
  collection: string; // text
  recordID: string; // text
  field: string; // text
  valueOld: string; // text
  valueNew: string; // text
  changeType: "create" | "update" | "delete"; // select
  changedBy: string; // relation
  reason: string; // text
  created: string; // autodate
  updated: string; // autodate
}
