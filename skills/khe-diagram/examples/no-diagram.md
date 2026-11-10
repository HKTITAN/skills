<!-- Gold: a "no diagram" answer. Learn: the verdict comes first with its reason, and the table is the whole deliverable. -->

# No diagram: the old deploy pipeline against the new one

**Request.** "Can you diagram what changes between the old deploy pipeline and the new one?"

**Verdict: table.** Both pipelines run the same steps in the same order. Only four attributes of those steps change, and a before and after that changes attributes only is a table. A figure would draw the same boxes twice and leave the reader to find the difference.

| Attribute | Old pipeline | New pipeline |
|---|---|---|
| Trigger | A button in the dashboard | A push to `main` |
| First exposure | All traffic at once | A canary at 5% of traffic |
| Rollback | By hand, from the runbook | Automatic when errors pass 1% |
| Who hears about a failure | Whoever is on call | The author of the push |

**Surface and owner.** The doc this table sits in. Nobody needs to move anything.

**What would make it a figure.** A change of topology: a step added, removed or reordered, or a new branch. The rollback branch on its own is a flow with two exits, and `flow.svg` beside this file draws it.
