# AGENTS.md

Guidance for AI coding agents working in this repository.

## Git workflow

- Never commit automatically. Stage nothing and leave changes in the working tree, then suggest a commit message for the user to commit themselves.
- Before suggesting a commit message, always run `git status` (and `git diff` when useful) to see what is actually uncommitted. The user may have committed some changes already; only suggest messages covering the changes still present in the working tree.
- Never push unless the user explicitly asks for it.
- Branch naming: `feature/<name>` for new functionality and maintenance work, `hotfix/<name>` for urgent fixes to production.
