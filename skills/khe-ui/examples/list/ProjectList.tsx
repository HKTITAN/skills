// Gold: a list with loading, empty and error branches.
// Learn one thing: the four branches are written before the happy one is styled,
// and they share one box. The heading and the Create button are real from the
// first frame; only the rows load. Skeleton, empty state, error and three rows
// are the same height, so no branch moves the page when it replaces another.
//
// Values and their lanes:
//   no indicator for the first 150ms                         components: Decide first, step 2
//   skeleton rows at the loaded row's 44px                   components: Loading, empty, error
//   empty state: what belongs here, one line, the action     components: Loading, empty, error
//   error: what did not happen, the step, a retry            components: Copy and strings
//   one status region, in the page and empty from the start  accessibility: Announcements
//   counts through Intl, whole strings per plural category   components: Copy and strings
//   past 50 rows this list is virtualized                    motion: Properties and performance
//
// Not in this example: offline, permission-denied, stale and partial. A data
// view that can reach them owes them a branch each.
//
// The status comes in as a prop, so a fixture feeds every branch at the data
// boundary and the component is never edited to show a state.

import { useEffect, useState } from "react";
import "./project-list.css";

type Project = { id: string; name: string; members: number };

type Props = {
  status: "loading" | "error" | "ready";
  projects?: Project[];
  onRetry: () => void;
  onCreate: () => void;
};

const number = new Intl.NumberFormat();
const plural = new Intl.PluralRules("en");
const MEMBERS = { one: "member", other: "members" } as const;
const PROJECTS = { one: "project", other: "projects" } as const;

function counted(n: number, words: { one: string; other: string }) {
  const category = plural.select(n) === "one" ? "one" : "other";
  return `${number.format(n)} ${words[category]}`;
}

// True only once `active` has held for `ms`. A response inside 150ms shows no indicator at all.
function useHeld(active: boolean, ms: number) {
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!active) {
      setHeld(false);
      return;
    }
    const id = setTimeout(() => setHeld(true), ms);
    return () => clearTimeout(id);
  }, [active, ms]);
  return held;
}

const SKELETON_WIDTHS = ["84%", "64%", "78%"];

export function ProjectList({ status, projects = [], onRetry, onCreate }: Props) {
  const showSkeleton = useHeld(status === "loading", 150);

  let announce = "";
  if (status === "loading" && showSkeleton) announce = "Loading projects";
  if (status === "error") announce = "Projects not loaded";
  if (status === "ready") announce = `Loaded, ${counted(projects.length, PROJECTS)}`;

  return (
    <section className="projects" aria-labelledby="projects-title" aria-busy={status === "loading"}>
      <header className="projects__head">
        <h2 id="projects-title">Projects</h2>
        <button type="button" className="projects__button" onClick={onCreate}>
          Create project
        </button>
      </header>

      <p className="sr-only" role="status">{announce}</p>

      <div className="projects__body">
        {status === "loading" && showSkeleton ? (
          <ul className="projects__rows" aria-hidden="true">
            {SKELETON_WIDTHS.map((width) => (
              <li key={width} className="projects__row">
                <span className="projects__bar" style={{ width }} />
              </li>
            ))}
          </ul>
        ) : null}

        {status === "error" ? (
          <div className="projects__state">
            <h3>Projects not loaded</h3>
            <p>Check your connection and try again.</p>
            <button type="button" className="projects__button" onClick={onRetry}>
              Retry
            </button>
          </div>
        ) : null}

        {status === "ready" && projects.length === 0 ? (
          <div className="projects__state">
            <h3>No projects yet</h3>
            <p>A project holds the files and people for one piece of work.</p>
            <button type="button" className="projects__button" onClick={onCreate}>
              Create project
            </button>
          </div>
        ) : null}

        {status === "ready" && projects.length > 0 ? (
          <ul className="projects__rows">
            {projects.map((project) => (
              <li key={project.id} className="projects__row">
                <span className="projects__name">{project.name}</span>
                <span className="projects__count">{counted(project.members, MEMBERS)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
