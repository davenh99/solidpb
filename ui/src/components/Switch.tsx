import { Switch as KSwitch, SwitchRootProps } from "@kobalte/core/switch";
import { Component, createMemo, Show, ValidComponent } from "solid-js";

import { debounce } from "../methods/debounce";
import { PolymorphicProps } from "@kobalte/core";

type SwitchProps<T extends ValidComponent = "div"> = PolymorphicProps<T, SwitchRootProps<T>>;

interface Props extends SwitchProps {
  label?: string;
  size?: "sm" | "md";
  saveFunc?: (v: boolean) => Promise<any>;
}

export const Switch: Component<Props> = (props) => {
  const debouncedSave = createMemo(() => (props.saveFunc ? debounce(props.saveFunc) : undefined));

  const handleChange = (v: boolean) => {
    props.onChange?.(v);
    debouncedSave()?.(v);
  };

  return (
    <KSwitch
      class={`flex flex-row justify-between items-center ${props.class ?? ""}`}
      checked={props.checked}
      onChange={handleChange}
    >
      <Show when={props.label}>
        <KSwitch.Label>{props.label}</KSwitch.Label>
      </Show>
      <KSwitch.Input />
      <KSwitch.Control
        class={`flex items-center w-10 h-6 bg-black rounded-full border-1 border-black
        data-[checked]:bg-white data-[checked]:border-white transition-all`}
      >
        <KSwitch.Thumb
          class={`h-5 w-5 rounded-full bg-white transition-transform 
            data-[checked]:[transform:translateX(calc(100%-2px))]`}
        />
      </KSwitch.Control>
    </KSwitch>
  );
};

export default Switch;
