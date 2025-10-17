import { useContext } from "solid-js";
import { PBContext } from "./context";
import { ClientResponseError } from "pocketbase";
import { EXPAND_USER } from "../../../constants";

const BaseSignUpData = {
  dob: "",
  height: 0,
  weight: 0,
};

export function usePB() {
  const context = useContext(PBContext);
  if (!context) {
    throw new Error("usePB must be used within PBProvider");
  }
  const { pb } = context;

  const login = async (usernameOrEmail: string, password: string) => {
    await pb.collection("users").authWithPassword(usernameOrEmail, password, { expand: EXPAND_USER });
  };

  const signUp = async (email: string, name: string, password: string, passwordConfirm: string) => {
    await pb.collection("users").create({ ...BaseSignUpData, name, email, password, passwordConfirm });
    await login(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const OAuthSignIn = async (provider: string) => {
    const authData = await pb.collection("users").authWithOAuth2({
      provider,
      createData: { ...BaseSignUpData, name: "user" },
      query: { expand: EXPAND_USER },
    });
    // after succesful auth we can update the user with a different username from the authData
    if (authData.meta?.name) {
      try {
        const formData = new FormData();

        if (authData.meta?.name) {
          formData.append("name", authData.meta.name);
        }

        await pb.collection("users").update(authData.record.id, formData, { expand: EXPAND_USER });
      } catch (e: any) {
        alert(`${e}: ${e.originalError}`);
        alert("could not update name");
      }
    }
  };

  return { ...context, login, signUp, logout, OAuthSignIn };
}

export function useAuthPB() {
  const {
    pb,
    store: { user },
    logout,
  } = usePB();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const updateRecord = async <T>(collectionName: string, recordID: string, field: string, newVal: any) => {
    const data: any = {};
    data[`${field}`] = newVal;

    try {
      const record = await pb
        .collection<T>(collectionName)
        .update(recordID, data, { requestKey: `${collectionName}.${recordID}.${field}` });
      return record as T;
    } catch (e) {
      if (e instanceof ClientResponseError && e.isAbort) {
      } else {
        throw e;
      }
    }
  };

  return { pb, user, logout, updateRecord };
}
