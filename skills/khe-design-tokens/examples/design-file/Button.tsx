// Gold: the contract's closed variant set as a union type. Learn: the union is components.button.variants
// copied exactly, so a variant the contract does not list fails to compile.
import type { ReactNode } from "react";
import "./button.css";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  children: ReactNode;
};

export function Button({ variant = "secondary", children }: ButtonProps) {
  return <button className={`button button--${variant}`}>{children}</button>;
}
