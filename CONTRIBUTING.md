# Contributing

This repo has one maintainer ([@devanshc777](https://github.com/devanshc777)) and a small
team of collaborators. The rules below keep `main` deployable at all times, because every
merge to `main` goes straight to production on Vercel.

## Roles

| Role | Can | Cannot |
|---|---|---|
| **Maintainer** | Approve and merge PRs, change settings, delete stale branches, hotfix | — |
| **Collaborator** | Create branches, push to their own branches, open PRs, review | Push to `main`, merge without maintainer approval, force-push, delete branches |

The "cannot" column is enforced by GitHub rulesets. If a push is rejected, that is the
ruleset working — open a PR instead of looking for a way around it.

## Ground rules

1. **Nothing reaches `main` without a PR approved by the maintainer.** No exceptions for "small" changes.
2. **Do not delete other people's code.** If you think something should go, say so in an
   issue or PR comment and let the maintainer decide. Removals in a PR must be called out
   in its description.
3. **Never rewrite shared history.** No `git push --force`, no `git rebase` of a branch
   someone else has pulled. Force-push and branch deletion are blocked anyway.
4. **One topic per branch, one branch per PR.** Do not stack unrelated changes.
5. **No secrets in the repo.** API keys go in Vercel environment variables (see
   [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)), never in code or `.env` files that get committed.
6. **Do not merge your own PR**, even if the button lights up. The maintainer merges.

## Branch naming

Format: `type/short-topic-in-kebab-case`

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | New feature or section | `feat/team-page` |
| `fix/` | Bug fix | `fix/navbar-mobile-overflow` |
| `docs/` | Documentation only | `docs/deployment-steps` |
| `style/` | Visual/CSS changes, no logic | `style/footer-spacing` |
| `refactor/` | Code restructure, no behaviour change | `refactor/split-hero-component` |
| `perf/` | Performance | `perf/lazy-load-globe` |
| `test/` | Tests only | `test/contact-form` |
| `chore/` | Tooling, deps, config | `chore/update-three` |
| `ci/` | GitHub Actions / pipeline | `ci/lighthouse-check` |
| `hotfix/` | Urgent production fix (maintainer) | `hotfix/broken-contact-link` |

Rules: lowercase, kebab-case, no spaces, no personal names (`feat/rahul-stuff` ✗).
GitHub **refuses to create** branches outside these prefixes, and CI re-checks the name on every PR.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short imperative summary

Optional body: what changed and why, wrapped at ~72 chars.
```

- `type` is one of the branch prefixes above (`feat`, `fix`, `docs`, …).
- `scope` is optional and names the area: `feat(globe): add touch inertia`.
- Summary is lowercase, imperative ("add", not "added"), no trailing full stop.

Examples:

```
feat(hero): mount globe behind headline
fix(nav): stop menu overlapping logo below 400px
docs: add vercel env var table
```

The **PR title** must follow the same format. Since `main` is squash-merged, the PR title
becomes the single commit on `main`. CI fails the PR if the title does not match.

## Pull request flow

```bash
# 1. Start from an up-to-date main
git switch main
git pull

# 2. Branch
git switch -c feat/team-page

# 3. Work, commit in small steps
git add <files>
git commit -m "feat(team): add member card grid"

# 4. Push and open a PR into main
git push -u origin feat/team-page
```

Then on GitHub:

1. Open a PR from your branch into `main`. Fill in every section of the template.
2. Wait for the two checks (`branch-name`, `pr-title`) to pass and for the Vercel preview link.
3. Click through the preview yourself — desktop **and** a phone width — before requesting review.
4. Request review from **@devanshc777**. The CODEOWNERS file does this automatically.
5. Address comments by pushing new commits. Any push after approval dismisses the
   approval, so the maintainer re-reviews what actually ships.
6. Resolve every conversation. The maintainer squash-merges.

**Keeping a branch current:** if `main` moved on, merge it in — do not rebase a pushed branch.

```bash
git switch main && git pull
git switch feat/team-page
git merge main
git push
```

## Reviews

Collaborators are encouraged to review each other's PRs. Only the maintainer's approval
counts toward merging, but a second pair of eyes catches things.

When reviewing, check: does the preview work on mobile, does it match the brand
colours, did anything get removed that wasn't mentioned, are there console errors.

## Getting access

The maintainer invites collaborators from **Settings → Collaborators**. Accept the
email invite, then clone. If you cannot push a branch, check the name against the
table above before asking.
