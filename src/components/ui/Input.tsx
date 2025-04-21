import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  [
    "flex",
    "h-9",
    "w-full",
    "rounded-xl",
    "border",
    "border-input",
    "bg-transparent",
    "px-3",
    "py-1",
    "text-sm",
    "shadow-sm",
    "transition-colors",
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-ring",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "",
        gradient: [
          "border-transparent",
          "bg-clip-padding",
          "relative",
          "before:absolute",
          "before:inset-0",
          "before:rounded-xl",
          "before:p-[1px]",
          "before:bg-gradient-to-r",
          "before:from-blue-500",
          "before:to-purple-500",
          "after:absolute",
          "after:inset-[1px]",
          "after:rounded-[10px]",
          "after:bg-[var(--background)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={inputVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants }; 