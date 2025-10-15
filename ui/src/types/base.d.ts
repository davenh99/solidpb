/* This file was automatically generated, changes will be overwritten. */

export interface BaseRecord {
  id: string;
  collectionName: string;
  collectionId: string;
  created: string;
  updated: string;
}

/* Collection type: auth */
export interface Users {
  email: string; // email
  emailVisibility?: boolean; // bool
  verified?: boolean; // bool
  name?: string; // text
  avatar?: string; // file
}

export type UsersRecord = Users & BaseRecord;
