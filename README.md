# 180 Degrees Consulting MUJ — Website 2026

Official website of **180 Degrees Consulting, Manipal University Jaipur** for the 2026 term.
Deployed on [Vercel](https://vercel.com). Maintained by [@devanshc777](https://github.com/devanshc777).

> **Contributors:** read [CONTRIBUTING.md](CONTRIBUTING.md) before your first branch.
> Every change reaches `main` through a pull request that the maintainer reviews and merges.

## Status

| Area | Branch | State |
|---|---|---|
| 3D hero globe (hex-tiled, brand green) | `feat/3d-render` | Built, awaiting integration |
| Site shell, pages, content | — | Not started |

## Repository layout

```
.
├── .github/
│   ├── CODEOWNERS                  every path is owned by the maintainer
│   ├── pull_request_template.md    checklist every PR fills in
│   ├── ISSUE_TEMPLATE/             bug report + feature request forms
│   └── workflows/pr-checks.yml     branch-name + PR-title checks
├── docs/
│   └── DEPLOYMENT.md               Vercel setup, environments, rollbacks
├── CONTRIBUTING.md                 branching, commits, PR flow, rules
└── README.md
```

Feature work lives in its own folder until it is integrated. The globe, for example,
sits in `globe/` on `feat/3d-render` with its own README.

## Working on it

```bash
git clone https://github.com/devanshc777/180dc-muj-website.git
cd 180dc-muj-website
git switch -c feat/<short-topic>
```

Then follow the PR flow in [CONTRIBUTING.md](CONTRIBUTING.md#pull-request-flow).

## Deployment

| Git event | Vercel result |
|---|---|
| PR opened / updated | Preview deployment, link posted on the PR |
| PR merged to `main` | Production deployment |

Details, environment variables and rollback steps: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Rules at a glance

These are enforced by GitHub rulesets, not just written down:

- `main` accepts changes **only** through a pull request approved by the maintainer.
- Merges are **squash only**; the PR title becomes the commit message on `main`.
- **No force-pushes and no branch deletion** on any branch, for anyone but the maintainer.
- New branches **must** use a `type/topic` name (`feat/`, `fix/`, `docs/` …) or GitHub refuses to create them.
- CI checks the branch name and PR title on every pull request; both must pass to merge.

## Credits

- Brand colours taken from the 180 Degrees Consulting stylesheet at 180dc.org.
- Coastline data: [Natural Earth](https://www.naturalearthdata.com/) (public domain).
- 3D rendering: [three.js](https://threejs.org/) (MIT).

© 2026 180 Degrees Consulting MUJ. All rights reserved unless stated otherwise.
