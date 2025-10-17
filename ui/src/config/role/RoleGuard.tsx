import { JSX, ParentComponent, Show } from "solid-js";
import { TPermission } from "../../types";
import { useAuthPB } from "../pocketbase";
import { hasPermission } from "../../methods/permissions";
import Container from "../../views/app/Container";

interface RoleGuardProps {
  collection?: string;
  action?: keyof TPermission;
  fallback?: JSX.Element;
}

export const RoleGuard: ParentComponent<RoleGuardProps> = (props) => {
  const { user } = useAuthPB();

  let allowed = hasPermission(user, props.collection || "", props.action);

  return (
    <Show when={allowed} fallback={props.fallback ?? <AccessDenied />}>
      {props.children}
    </Show>
  );
};

export function AccessDenied() {
  return (
    <Container>
      <p>Access denied</p>
      <p>You do not have permission to access this.</p>
    </Container>
  );
}
