# Claude Code – Working Conventions

## Branch rules

- **Never commit directly to `main` or `develop`.** All work goes on `feature/claude`.
- There is one persistent remote branch for Claude's work: **`feature/claude`** on origin.
- At the start of each session, check out or create `feature/claude` and pull the latest:
  ```bash
  git checkout feature/claude 2>/dev/null || git checkout -b feature/claude origin/develop
  git pull origin feature/claude --rebase
  ```
- Push completed work to `origin/feature/claude` and open a pull request against **`develop`**.
- The human reviews and merges `feature/claude` → `develop`, then `develop` → `master` when confident.

## Reviewing human branches

When asked to review a branch the human has pushed:
1. `git fetch origin`
2. `git diff main...origin/<branch>` to see all changes
3. Leave findings as inline PR comments (`/code-review --comment`) or as a written summary — never silently push fixes without being asked.
4. If fixes are requested, commit them to the **same branch**, not a new one.

## Commit style

- Commit messages: short imperative summary line, then a blank line and a body if the why isn't obvious.
- Do **not** append a `Co-Authored-By: Claude` trailer to commits — attribution goes in the README instead, not per-commit.
- Prefer small, focused commits over large squashes.

## General

- Ask before touching files outside the current task's scope.
- Do not force-push or rebase branches that have already been pushed to origin.
