import { ParentComponent, Show, splitProps, ValidComponent } from "solid-js";
import { A } from "@solidjs/router";
import { ButtonRootProps, Button as KButton } from "@kobalte/core/button";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { tv } from "tailwind-variants";
import Loader from "lucide-solid/icons/loader";

type BaseProps<T extends ValidComponent = "button" | "A"> = PolymorphicProps<T, ButtonRootProps<T>>;

interface Props extends BaseProps {
  href?: string;
  variant?: "text" | "solid";
  appearance?: "primary" | "success" | "warning" | "neutral" | "error" | "muted";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

const button = tv({
  base: `
    inline-flex items-center justify-center gap-2 font-medium
    transition active:opacity-60 hover:opacity-90
    focus:outline-none focus:ring-1
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-md
  `,
  variants: {
    appearance: {
      primary: "bg-light-primary dark:bg-dark-primary/20 dark:text-dark-primary",
      success: "bg-light-success dark:bg-dark-success/20 dark:text-dark-success",
      warning: "bg-light-warning dark:bg-dark-warning/20 dark:text-dark-warning",
      neutral: "bg-light-neutral dark:bg-dark-neutral/20 dark:text-dark-neutral",
      error: "bg-light-error dark:bg-dark-error/20 dark:text-dark-error",
      muted: "bg-light-muted dark:bg-dark-muted/20 dark:text-dark-muted",
    },
    size: {
      xs: "text-xs px-2 py-1",
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-5 py-3",
    },
    variant: {
      text: "bg-transparent dark:bg-transparent border-none py-0 px-1 hover:underline underline-offset-4",
      solid: "dark:border-1",
    },
  },
  compoundVariants: [
    {
      variant: "text",
      appearance: "primary",
      class: "text-light-primary dark:text-dark-primary",
    },
    {
      variant: "text",
      appearance: "success",
      class: "text-light-success dark:text-dark-success",
    },
    {
      variant: "text",
      appearance: "warning",
      class: "text-light-warning dark:text-dark-warning",
    },
    {
      variant: "text",
      appearance: "neutral",
      class: "text-light-neutral dark:text-dark-neutral",
    },
    {
      variant: "text",
      appearance: "error",
      class: "text-light-error dark:text-dark-error",
    },
    {
      variant: "text",
      appearance: "muted",
      class: "text-light-muted dark:text-dark-muted",
    },
  ],
  defaultVariants: {
    variant: "solid",
    appearance: "neutral",
    size: "md",
  },
});

export const Button: ParentComponent<Props> = (props) => {
  const [local, others] = splitProps(props, [
    "children",
    "href",
    "class",
    "variant",
    "appearance",
    "size",
    "isLoading",
  ]);

  const classes = () =>
    button({
      variant: local.variant,
      appearance: local.appearance,
      size: local.size,
      class: local.class as string,
    });

  return (
    <KButton
      as={local.href ? A : "button"}
      href={local.href ?? ""}
      class={classes()}
      disabled={local.isLoading}
      {...others}
    >
      {local.children}
      <Show when={local.isLoading}>
        <Loader class="ml-2 animate-spin" />
      </Show>
    </KButton>
  );
};

export default Button;
