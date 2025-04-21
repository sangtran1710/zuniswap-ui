import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  [
    "rounded-2xl",
    "bg-[var(--component-background)]",
    "text-[var(--text-primary)]",
    "transition-all",
    "duration-200",
    "relative",
    "before:absolute",
    "before:inset-0",
    "before:rounded-2xl",
    "before:p-[1px]",
    "before:bg-gradient-to-r",
    "before:from-blue-500/20",
    "before:to-purple-500/20",
    "after:absolute",
    "after:inset-[1px]",
    "after:rounded-[14px]",
    "after:bg-[var(--component-background)]",
  ],
  {
    variants: {
      variant: {
        default: "",
        gradient: [
          "before:from-blue-500",
          "before:to-purple-500",
          "hover:before:opacity-90",
        ],
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cardVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card, cardVariants }; 