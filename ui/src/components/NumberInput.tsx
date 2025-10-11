import { Component, createMemo, Show, splitProps, ValidComponent } from "solid-js";
import {
  NumberField,
  type NumberFieldInputProps,
  type NumberFieldRootProps,
} from "@kobalte/core/number-field";
import type { PolymorphicProps } from "@kobalte/core";
import { debounce } from "../methods/debounce";
import { tv } from "tailwind-variants";

type InputProps<T extends ValidComponent = "input"> = PolymorphicProps<T, NumberFieldInputProps<T>>;

interface ExtraProps {
  label?: string;
  size?: "sm" | "md";
  inputProps?: InputProps;
  saveFunc?: (v: number) => Promise<any>;
}

type InputRootProps<T extends ValidComponent = "div"> = ExtraProps &
  PolymorphicProps<T, NumberFieldRootProps<T>>;

const inputRoot = tv({ base: "flex flex-row items-center space-x-1" });
const inputField = tv({ base: "input outline-none text-right my-0" });

export const NumberInput: Component<InputRootProps> = (props) => {
  const [local, others] = splitProps(props, ["label", "class", "inputProps", "saveFunc"]);

  const debouncedSave = createMemo(() => (local.saveFunc ? debounce(local.saveFunc) : undefined));

  const handleChange = (v: string) => {
    debouncedSave()?.(Number(v));
  };

  return (
    <NumberField {...others} onChange={handleChange} class={inputRoot({ class: local.class })}>
      <Show when={local.label}>
        <NumberField.Label>{local.label}</NumberField.Label>
      </Show>
      <NumberField.Input {...local.inputProps} class={inputField({ class: local.inputProps?.class ?? "" })} />
    </NumberField>
  );
};

export default NumberInput;
