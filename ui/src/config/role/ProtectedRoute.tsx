import { JSX } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useAuthPB } from "../pocketbase";

interface ProtectedRouteProps {
  roles?: string[];
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { user } = useAuthPB();

  if (props.roles && !props.roles.includes(user.expand?.role.name || "user")) {
    return <Navigate href="/unauthorised" />;
  }

  return props.children;
};

export default ProtectedRoute;
