// good: the class is the theme's own utility for typography.body-md; no value is typed here.
export function SettingsHint({ children }: { children: string }) {
  return <p className="settings-hint text-body-md">{children}</p>;
}
