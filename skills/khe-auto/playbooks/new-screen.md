# New screen

**You own this from the request to a screen that passes review.** Structure first, surfaces second, behavior third, motion only once the static version works.

1. **Undecided?** If nobody can say which direction is right, run `prototype` first and keep one. Never prototype a decision that is already made.
2. **Check for a contract** with `khe-design-tokens`.
3. **Structure** with `khe-ui`, layout lane: hierarchy, grouping, what the screen does when content grows. Exit: the screen reads correctly in grey boxes.
4. **One material pass** with `khe-ui`, for what the screen is made of: the typography lane, the color-and-surface lane or the components lane. One, not all three. Look at the screen before choosing a second.
5. **States** with `khe-ui`, components lane: loading, empty, error, partial. They are most of the product. Exit: every data view has all its branches.
6. **Motion, last** with `khe-ui`, motion lane. Exit: every motion names its purpose, or it is deleted.
7. **The floor** with `khe-ui`, accessibility lane. It applies even when the screen already looks finished.
8. **Review** with `khe-ui`, review lane. Exit: a verdict.

Look at the screen between steps. Two passes at a time is the limit.

**Reply:** the verdict, the states that now exist, what was left out on purpose, and what you could not verify.
