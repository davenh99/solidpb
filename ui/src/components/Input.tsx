import { Component, createMemo, Show, splitProps, ValidComponent } from "solid-js";
import { TextField, type TextFieldInputProps, type TextFieldRootProps } from "@kobalte/core/text-field";
import type { PolymorphicProps } from "@kobalte/core";
import { tv } from "tailwind-variants";

import { debounce } from "../methods/debounce";

type InputProps<T extends ValidComponent = "input"> = PolymorphicProps<T, TextFieldInputProps<T>>;

interface ExtraProps {
  label?: string;
  variant?: "bordered" | "none";
  size?: "sm" | "md";
  inputProps?: InputProps;
  saveFunc?: (v: string) => Promise<any>;
}

type InputRootProps<T extends ValidComponent = "div"> = ExtraProps &
  PolymorphicProps<T, TextFieldRootProps<T>>;

const inputRoot = tv({
  base: "flex gap-1",
  variants: {
    labelPosition: {
      inline: "flex-row items-center",
      above: "flex-col",
    },
  },
  defaultVariants: {
    labelPosition: "above",
  },
});

const inputField = tv({
  base: "w-full rounded-sm outline-none px-2 py-1",
  variants: {
    variant: {
      bordered: "border-2 border-black",
      none: "",
    },
  },
  defaultVariants: {
    variant: "none",
  },
});

export const Input: Component<InputRootProps> = (props) => {
  const [local, others] = splitProps(props, [
    "label",
    "class",
    "variant",
    "inputProps",
    "saveFunc",
    "onChange",
  ]);

  const debouncedSave = createMemo(() => (local.saveFunc ? debounce(local.saveFunc) : undefined));

  const handleChange = (v: string) => {
    local.onChange?.(v);
    debouncedSave()?.(v);
  };

  return (
    <TextField class={inputRoot({ class: local.class })} {...others} onChange={handleChange}>
      <Show when={local.label}>
        <TextField.Label>{local.label}</TextField.Label>
      </Show>
      <TextField.Input
        class={inputField({ variant: local.variant, class: local.inputProps?.class })}
        {...local.inputProps}
      />
    </TextField>
  );
};

export default Input;
