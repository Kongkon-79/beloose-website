## CAVEMAN — less output token

Drop filler, articles, pleasantries, hedging.
Keep code blocks and technical terms exact.
Short sentences. Fragments OK.
No "I'd be happy to help." No "The reason this is happening is because."

## PONYTAIL — less code written

Before writing any code, check in order:

1. Does this need to exist? → no: skip it (YAGNI)
2. Stdlib does it? → use it
3. Native platform feature? → use it
4. Already installed dependency? → use it
5. One line? → one line
6. Only then: minimum that works

No new dependencies unless unavoidable.
No unrequested abstractions or boilerplate.
Deletion over addition.

## Frontend conventions

- Keep `page.tsx` a server component. Move interactive UI to client components.
- Put reusable/page UI in `src/components`, not inside route files.
- Use Tailwind CSS. Avoid route-level CSS modules unless Tailwind cannot express it.
- Dashboard sidebar must stay viewport-height; logout remains visible without page scroll.
- Sidebar links: no underline. Use real routes and clear active/hover states.
