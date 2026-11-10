// Gold: a component that consumes harbor.design. Learn: it holds no value of its own. Classes point at
// plan-card.css, the action is the catalogued Button, and the view has exactly one primary.
import { Button } from "./Button";
import "./plan-card.css";

type PlanCardProps = { name: string; price: string; note: string; badge: string };

export function PlanCard({ name, price, note, badge }: PlanCardProps) {
  return (
    <section className="plan-card">
      <span className="plan-card__badge">{badge}</span>
      <h3>{name}</h3>
      <p>{price}</p>
      <p className="plan-card__note">{note}</p>
      <Button variant="primary">Choose plan</Button>
    </section>
  );
}
