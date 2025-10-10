import { Component } from "solid-js";
import { Portal } from "solid-js/web";
import { Toast } from "@kobalte/core/toast";

export const Toaster: Component = () => {
  return (
    <Portal>
      <Toast.Region>
        <Toast.List />
      </Toast.Region>
    </Portal>
  );
};

export default Toaster;
