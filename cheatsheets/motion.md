# Motion Cheatsheet

| Problem                                | Solution                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Popover inflates from a point          | Start at `scale(0.96)` with `opacity: 0`                                    |
| Closing feels as slow as opening       | Exit in 60 to 80% of the enter: `250ms` in, `180ms` out                     |
| Command palette lags behind the keys   | No animation on a keyboard action: open on the frame the key lands          |
| Accordion stutters                     | `grid-template-rows: 0fr` to `1fr`, never `height`                          |
| Toast restarts when it is interrupted  | A `transition`, not `@keyframes`: it retargets from the current value       |
| List cascade drags on                  | Stagger `30ms` to `80ms` per item, 6 items, under `300ms` in total          |
| Tooltips feel slow along a toolbar     | First one waits 400 to 700ms, siblings open with `transition-duration: 0ms` |
| Sheet ignores a quick flick            | Dismiss past 40 to 50% of travel, or at a velocity over `500 px/s`          |
| Drag lags behind the finger            | `transition: none` while carried, `transform` written 1:1                   |
| Spring feels slow and floaty           | `{ type: "spring", duration: 0.35, bounce: 0 }`                             |
| Hover lift sticks after a tap          | `@media (hover: hover) and (pointer: fine)`                                 |
| Lerp runs faster on a 120Hz screen     | `k = 1 - Math.pow(1 - 0.08, dt / (1000 / 60))`, `dt` capped at `100ms`      |
| Error shake runs too long              | `280ms`, `translateX` through 0, -4px, 4px, -2px, 0                         |
| Screen is blank with reduced motion on | `transform: none`: the reduced state is the finished state                  |
| Press feels mushy or too deep          | `scale(0.97)` over `160ms`, `0.96` for an icon button                       |
