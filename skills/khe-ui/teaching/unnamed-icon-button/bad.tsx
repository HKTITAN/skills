// unnamed-icon-button: a screen reader announces "button" and nothing else, so nobody can find the search.
export function Toolbar({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="toolbar">
      <button type="button" className="toolbar__button" onClick={onSearch}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.25 10.25L13 13" />
        </svg>
      </button>
    </div>
  );
}
