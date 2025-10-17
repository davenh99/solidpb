import PocketBase from "pocketbase";
import { createContext } from "solid-js";
import { TUser } from "../../types";

type PBContextType = {
  pb: PocketBase;
  store: { user: TUser | null; loading: boolean; networkError: boolean };
  checkAuth: () => Promise<void>;
};

export const PBContext = createContext<PBContextType>();
