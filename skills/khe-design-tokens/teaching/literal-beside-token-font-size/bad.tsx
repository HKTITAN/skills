// bad: literal-beside-token. text-[16px] repeats the size typography.body-md already holds.
export function SettingsHint({ children }: { children: string }) {
  return <p className="settings-hint text-[16px]">{children}</p>;
}
