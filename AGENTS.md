# AGENTS.md

Guidance for AI coding agents working in this repository.

## Git workflow

- Never commit automatically. Stage nothing and leave changes in the working tree, then suggest a commit message for the user to commit themselves.
- Never push unless the user explicitly asks for it.
- Branch naming: `feature/<name>` for new functionality and maintenance work, `hotfix/<name>` for urgent fixes to production.
