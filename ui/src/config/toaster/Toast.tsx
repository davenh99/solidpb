import { Component, splitProps } from "solid-js";
import { Toast as KToast, ToastRootProps } from "@kobalte/core/toast";
import X from "lucide-solid/icons/x";

interface Props extends ToastRootProps {
  title: string;
  msg: string;
}

export const Toast: Component<Props> = (props) => {
  const [local, rootProps] = splitProps(props, ["msg", "title"]);

  return (
    <KToast {...rootProps}>
      <KToast.CloseButton>
        <X size={16} />
      </KToast.CloseButton>
      <KToast.Title>{local.title}</KToast.Title>
      <KToast.Description>{local.msg}</KToast.Description>
    </KToast>
  );
};

export default Toast;
