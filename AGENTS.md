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

## Retailer dashboard UI states and consistency

- Every API-driven page must handle loading, error, empty/not-found, and success states. Never render a blank area while data is loading or unavailable.
- Use a layout-matching skeleton loader for initial loading. Use a pending state on action buttons for create, update, delete, and upload requests.
- Reuse the shared dashboard error and empty/not-found components. Errors must include a useful message and a retry action when retrying is possible.
- Add or update the route-level `not-found.tsx` when a dashboard route can reference a missing resource.
- Keep typography consistent across dashboard pages and modals: page title `text-lg`, section/modal title `text-sm` unless it is a primary dialog heading, body/input text `text-xs`, field labels `text-[11px]`, helper/meta text `text-[9px]` or `text-[10px]`.
- View, add, edit, and delete modals must share the same width, spacing, heading hierarchy, field styling, button height, and footer alignment. Use the established dashboard colors and reusable modal actions.
- Destructive modals must clearly identify the affected item, use a warning state, and require explicit confirmation. Disable all modal actions while the request is pending.
- Preserve responsive behavior and keyboard accessibility. Every icon-only action needs an `aria-label`; forms need associated labels and visible validation/error feedback.

## Retailer dashboard reference-image workflow

- Treat retailer-dashboard reference images as the source for feature scope, information hierarchy, page sections, actions, component behavior, and API-backed logic. Do not copy the reference application's visual theme.
- Keep the existing Beloose dashboard design language: current colors, typography scale, spacing rhythm, borders, buttons, cards, forms, tables, dialogs, sidebar, and responsive behavior.
- The user will provide route screenshots incrementally. For each screenshot, inspect the matching backend controller, service, DTO, and response shape before implementing the page.
- Use real backend data. Do not copy sample counts, revenue, product names, alerts, dates, chart values, or other mock content from a reference image.
- Map sidebar business features to real routes and matching APIs: Today/Dashboard, Inventory, Humidor Management, QR Management, Inventory Opportunities, Business Insights, Customer-Style Search, Staff Picks, New Arrivals, and Daily Featured. Add a route only when implementing its supplied requirements or when required for a working navigation flow.
- Preserve the current Settings, Profile, and Change Password routes, behavior, and Beloose styling. Do not redesign them to match external reference screenshots unless the user explicitly requests it.
- Prefer existing components and endpoints. When backend support is missing, make the smallest backward-compatible backend addition needed for the supplied workflow.
- Never break an existing route or API consumer while adding a dashboard feature. Preserve established response fields and extend contracts with optional fields when possible.
- If a reference image conflicts with the backend contract, keep the backend's real business behavior and implement the closest truthful UI in the Beloose design system. Surface the mismatch to the user when it changes visible behavior.
- Every implemented route must include the loading, error, empty/not-found, success, validation, and mutation-pending states defined above before it is considered complete.
- For Staff Picks, New Arrivals, and Daily Featured management, use the retailer's real inventory as the eligible item list and the dedicated feature endpoints for active state and mutations. A visual Active/Inactive toggle must not hide required backend fields: collect the exact DTO fields in an add/edit modal, preserve scheduling/expiry metadata, and confirm removals explicitly.
