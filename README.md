# dialectcn

A living catalog of [shadcn](https://ui.shadcn.com) presets — brand-inspired, community-submitted, and occasionally random. Pick one, copy the code, paste it into your project.

The tagline from the landing page says it cleanest: _"Presets, ready to paste."_

## What's inside

- **Brand presets** — palette, font, and radius echoes of recognizable brands (Vercel, Stripe, Linear, Claude, Airbnb, Notion, and ~50 more). Each one is hand-mapped from a full design-system write-up in `design/<slug>/README.md`.
- **Community presets** — users sign in, submit a preset code, and it lands in the feed with likes and filters.
- **Random presets** — seeded combinations of `baseColor × theme × radius` that surface unexpected pairings.

Each preset is an [encoded `shadcn/preset` config](https://ui.shadcn.com) — a compact string that captures `style`, `baseColor`, `theme`, `font`, `fontHeading`, `radius`, icon library, and menu styling. The feed decodes the string, resolves CSS variables, and renders a live preview.