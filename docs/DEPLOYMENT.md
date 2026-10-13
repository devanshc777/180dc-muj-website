# Deployment

The site deploys on **Vercel** from this GitHub repo. Only the maintainer has access to
the Vercel project; collaborators see deployments through the links Vercel posts on PRs.

## Environments

| Environment | Triggered by | URL |
|---|---|---|
| Production | Merge to `main` | Project domain (set in Vercel → Domains) |
| Preview | Any push to a branch with an open PR | Unique URL, posted as a PR comment |

## One-time setup (maintainer)

1. Vercel dashboard → **Add New → Project** → import `devanshc777/180dc-muj-website`.
2. **Framework preset:** pick the framework the site is built with. Until the site shell
   exists, use **Other** with no build command; Vercel serves the files as-is.
3. **Root directory:** `./` (repo root).
4. **Production branch:** Settings → Git → `main`.
5. Settings → Git → **Ignored Build Step**: leave default. Every PR gets a preview.
6. Add the custom domain under Settings → Domains when it is ready.

> Until a root `index.html` (or a framework build) exists on `main`, production shows a 404.
> That is expected. The globe preview lives at `/globe/` on the `feat/3d-render` preview URL.

## Environment variables

Set in Vercel → Settings → Environment Variables, scoped per environment.
**Never commit them.** Document every variable here when you add it:

| Name | Environments | Purpose |
|---|---|---|
| `VITE_FORMSPREE_ENDPOINT` | Preview, Production | Public endpoint used by the Work With Us enquiry form; set to the Formspree form URL. |

## Rolling back

Production broke after a merge:

1. Vercel → Deployments → find the last good production deployment → **⋯ → Promote to Production**.
   This is instant and does not touch git.
2. Then fix forward: open a `hotfix/` branch, PR it, merge. Do not revert by force-pushing `main`
   (the ruleset blocks it anyway).

## Checklist before merging to `main`

- [ ] Vercel preview builds without errors
- [ ] Preview checked on desktop and at ~375px width
- [ ] No console errors in the preview
- [ ] Any new environment variable is set in Vercel **and** listed in the table above
