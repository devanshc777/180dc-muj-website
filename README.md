# 180DC MUJ multi-page website

## Run locally
1. Install Node.js LTS.
2. Extract this ZIP and open the folder in VS Code.
3. Run `npm install`, then `npm run dev`.
4. Open the localhost URL printed by Vite.

Production check: `npm run build`, then `npm run preview`.

## Where to edit
- `src/App.tsx` — routes and page mapping.
- `src/components/Layout.tsx` — navigation, footer and current official-logo image URL.
- `src/styles.css` — theme, layout, responsiveness, typography and animation.
- `src/data.ts` — service content, capabilities, deliverables, team placeholders and impact metrics.
- `src/pages/Home.tsx` — homepage, kept separate for later edits.
- `src/pages/About.tsx` — global 180DC overview, mission/vision, values and team preview.
- `src/pages/Impact.tsx` — metrics, clients, before/after analysis and testimonials.
- `src/pages/Services.tsx` — service directory and service detail pages.
- `src/pages/People.tsx` — leadership, departments and consultant directory.
- `src/pages/Join.tsx` — recruitment flow, candidate profile and FAQ.
- `src/pages/WorkWithUs.tsx` — client enquiry information and mailto form.
- `src/pages/CaseStudy.tsx` — reusable case study layout.

## Add a service or project
Add the service object in `src/data.ts`; the detail page uses `/services/<slug>`. Case studies use `/case-studies/<service-slug>-case-01`. Update routes only if you create a new page type.

## Before publishing
Replace all placeholder names, client details, testimonials, recruitment dates and impact numbers with approved chapter information. The enquiry form opens the visitor's email app and does not store submissions. The header uses a remote 180DC logo asset; use the chapter's approved local logo file if you have one, without redrawing or recolouring it.
