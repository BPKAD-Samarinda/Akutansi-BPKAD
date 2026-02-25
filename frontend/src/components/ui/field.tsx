import * as React from "react";

import { cn } from "@/lib/utils";

type FieldProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
};

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "horizontal" ? "items-center flex-row" : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

export { Field, FieldLabel };
