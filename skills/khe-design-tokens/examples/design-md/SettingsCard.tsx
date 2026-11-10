// Gold: a component under a DESIGN.md. Learn: the save action uses button-primary, the component the
// front matter defines, instead of a second primary button built by hand.
import "./settings-card.css";

type SettingsCardProps = { label: string; hint: string; options: string[] };

export function SettingsCard({ label, hint, options }: SettingsCardProps) {
  return (
    <form className="settings-card">
      <label htmlFor="currency">{label}</label>
      <select id="currency" className="settings-card__field">
        {options.map((option) => (
          <option key={option} className="settings-card__menu-item">
            {option}
          </option>
        ))}
      </select>
      <p className="settings-card__hint">{hint}</p>
      <button type="submit" className="button-primary">
        Save changes
      </button>
    </form>
  );
}
