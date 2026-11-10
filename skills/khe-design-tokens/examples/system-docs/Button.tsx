// Gold: the code a doc page is written from. Learn: the union types below are the truth; button.md
// cites these lines and lists exactly these names.
import type { ReactNode } from "react";

export type ButtonVariant = "secondary" | "primary" | "tertiary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ variant = "secondary", size = "medium", children, onClick }: ButtonProps) {
  return (
    <button className={`kit-button kit-button--${variant} kit-button--${size}`} onClick={onClick}>
      {children}
    </button>
  );
}
