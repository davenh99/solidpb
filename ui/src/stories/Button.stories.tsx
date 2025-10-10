import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "../components/";
import { Show } from "solid-js";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// Variants, appearances, sizes
const variants = ["solid", "text"] as const;
const appearances = ["primary", "success", "warning", "neutral", "error", "muted"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

// Helper: render grid of buttons
const renderButtons = (variant: (typeof variants)[number], mode: "light" | "dark") => (
  <div class={`p-4 ${mode === "dark" ? "dark" : ""}`}>
    <div class="grid grid-cols-6 gap-4">
      {appearances.map((appearance) => (
        <Button variant={variant} appearance={appearance} size="md">
          {appearance}
        </Button>
      ))}
    </div>
  </div>
);

export const AllSolid: Story = {
  render: () => (
    <div class="space-y-4">
      <Show when={true}>{renderButtons("solid", "light")}</Show>
      <Show when={true}>{renderButtons("solid", "dark")}</Show>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div class="space-y-6 bg-[var(--color-background)]">
      {variants.map((variant) => (
        <div>
          <h3 class="mb-2 font-bold">{variant}</h3>
          <div class="flex flex-wrap gap-2">
            {appearances.map((appearance) => (
              <Button variant={variant} appearance={appearance} size="md">
                {appearance}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
