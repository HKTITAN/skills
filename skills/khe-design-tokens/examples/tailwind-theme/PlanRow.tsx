// Gold: a component in the project's own system. Learn: every class is a utility the theme generates
// from a token. No style attribute, no bracketed value, no second stylesheet.
type PlanRowProps = { name: string; price: string };

export function PlanRow({ name, price }: PlanRowProps) {
  return (
    <li className="flex items-center gap-4 rounded-lg bg-surface p-4 font-body text-body text-ink">
      <span className="grow">{name}</span>
      <span className="text-caption">{price}</span>
      <button className="rounded-md bg-accent px-4 py-2 text-caption text-surface">Choose plan</button>
    </li>
  );
}
