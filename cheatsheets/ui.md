# UI Cheatsheet

| Problem                                      | Solution                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| Page jumps when data loads                   | Skeleton rows at the loaded row's height (`48px` for a `48px` row)       |
| Spinner flashes on a fast response           | Wait `150ms` before any indicator, show one by `400ms`                   |
| Error message pushes the form down           | Reserve an `18px` message lane under every field                         |
| Long name pushes the action off the row      | `min-width: 0` on the text column, `overflow-wrap: anywhere`             |
| Heading wraps with one word on the last line | `text-wrap: balance` on headings, never on paragraphs                    |
| Tabs shift when one is selected              | Keep `font-weight` constant, signal with color                           |
| Grid column overflows with a long string     | `minmax(0, 1fr)` on the track, `min-width: 0` on the child               |
| Nested corners look pinched                  | Inner radius `max(4px, calc(var(--radius) - var(--pad)))`                |
| Shadow looks heavy                           | 2 to 3 layers at 4 to 6% opacity, led by a `1px` ring                    |
| Dropdown sits under the header               | `isolation: isolate` or a layer token, never a `z-index` above `400`     |
| Grey text is hard to read                    | `#767676` or darker on white (`4.54:1`)                                  |
| Tab lands and no ring shows                  | Delete `outline: none`, keep the browser ring with `outline-offset: 2px` |
| Tap misses a small icon                      | Pseudo-element with `inset: -10px` on a `24px` icon for a `44px` target  |
| Bottom of the layout is hidden on a phone    | `100dvh` for app shells, `min-height: 100svh` for heroes                 |
| Disabled button is unreadable on one surface | A dedicated token such as `--color-text-disabled`, never `opacity`       |
| Tooltip hides behind the modal               | Layers `100`, `200`, `300`, `400` for dropdown, modal, tooltip, toast    |
