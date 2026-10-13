# Changelog - Homepage

## Branch: `feat/homepage`

### Changes made
- Replaced the Work With Us mailto draft with a validated Formspree enquiry form, including loading, success, error and duplicate-submission states.
- Added Formspree endpoint configuration guidance and documented `VITE_FORMSPREE_ENDPOINT` for Vercel deployments.
- Removed the Work With Us hero and “Where could we help?” service-card section.
- Updated the homepage hero copy and integrated the interactive 3D globe through `public/globe/index.html`.
- Layered the globe behind the hero text and controls, with responsive absolute positioning and pointer interaction enabled.
- Adjusted the globe position through iterative vertical and horizontal offsets while preserving its rendering and animation.
- Updated homepage impact metrics and supporting layout styles.
- Added the Events page and linked it from the site navigation and routes.

### Files
- `src/pages/Home.tsx`
- `src/styles.css`
- `public/globe/index.html`
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/pages/Events.tsx`
- `src/pages/WorkWithUs.tsx`
- `src/vite-env.d.ts`
- `docs/FORMSPREE.md`
- `docs/DEPLOYMENT.md`
