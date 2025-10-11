import { Component, createMemo, Show, ValidComponent } from "solid-js";
import { CheckboxRootProps, Checkbox as KCheckbox } from "@kobalte/core/checkbox";
import Check from "lucide-solid/icons/check";
import { PolymorphicProps } from "@kobalte/core";

import { debounce } from "../methods/debounce";

type CheckBoxProps<T extends ValidComponent = "div"> = PolymorphicProps<T, CheckboxRootProps<T>>;

interface Props extends CheckBoxProps {
  label?: string;
  saveFunc?: (v: boolean) => Promise<void>;
}

export const Checkbox: Component<Props> = (props) => {
  const debouncedSave = createMemo(() => (props.saveFunc ? debounce(props.saveFunc) : undefined));

  const handleChange = (v: boolean) => {
    props.onChange?.(v);
    debouncedSave()?.(v);
  };

  return (
    <KCheckbox checked={props.checked} onChange={handleChange} class="flex flex-row space-x-2">
      <KCheckbox.Input />
      <KCheckbox.Control class="h-5 w-5 bg-black rounded-sm">
        <KCheckbox.Indicator class="text-white">
          <Check />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <Show when={props.label}>
        <KCheckbox.Label>{props.label}</KCheckbox.Label>
      </Show>
    </KCheckbox>
  );
};

export default Checkbox;
