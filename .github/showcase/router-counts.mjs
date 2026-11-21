// The skills each domain of khe-auto routes to, counted from the router's own domain tables.
// readme-auto.mjs draws these counts and scripts/check.mjs holds them to the folders, so no count is typed by hand.
// A domain is a "## <Name>" section whose table has a Whose column; "here" in it is a khe- skill in this repo.
export function routerDomains(routerText) {
  const domains = []
  for (const section of routerText.replace(/\r\n/g, '\n').split(/^(?=## )/m)) {
    const name = section.match(/^## (.+)$/m)?.[1]?.trim()
    if (!name || !/^\|[^\n]*\|\s*Whose\s*\|\s*$/m.test(section)) continue
    const rows = [...section.matchAll(/^\|[^|\n]*\|\s*`([^`]+)`\s*\|\s*([^|\n]+?)\s*\|\s*$/gm)].map((m) => ({ skill: m[1], whose: m[2] }))
    domains.push({ name, here: rows.filter((r) => r.whose === 'here').map((r) => r.skill), linked: rows.filter((r) => r.whose !== 'here').map((r) => r.skill) })
  }
  return domains
}
