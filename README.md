# Words duel (Walka na słowa)

## Setup

Vite + React
nvm with node v25.0.0
pnpm: 10.28.2
react: ^19.2.0

## Development

How to start: pnpm run dev

## Git strategy

Branching strategy:

```
main → production
develop → active work
feature/* → features
fix/* → bugfixes
```

Branch naming convention:

```
type/#<issue number>-branch-name
```

Commit naming convention:

```
#<issue-number>: commit message
```

Code review will be done by AI, CodeRabbit or reviewdog will be considered, for now review will be done by free chatGPT:

```
git diff develop...feature/#6-add-players-boards -- . ':(exclude)pnpm-lock.yaml' | pbcopy

please review the code like senior frontend dev add -<yourName> v.<your-version> at the end of the each comment, in the comment reference file, only add comments with fixes and improvements, skip positive comments, make comments in a copy-ready format
```

## Issues strategy

I'll use github issues with ticket that has labels for story points:

```
story-point:<value>
```

1 story point ≈ 30 minutes of focused work
2 points → ~1 hour
3 points → ~1.5 hours
5 points → ~2.5–3 hours
8 points -> ~4-5 hours
