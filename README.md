# Words duel (Walka na słowa)

## Setup

Vite + React
node v25.0.0
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
<type>/#<issue number>-branch-name
```

Commit naming convention:

```
#<issue-number>: commit message
```

Code review will be done by AI: by ChatGPT or ClaudeSonnet etc.
(CodeRabbit or reviewdog will be considered for the future).

Prompt:

```
git diff develop...feature/<branch-name> -- . ':(exclude)pnpm-lock.yaml' | pbcopy

Please review the code like senior frontend dev add -<yourName(which llm are you)> v.<your-version> at the end of the each comment, in the comment reference file, only add comments with fixes and improvements, skip positive comments, make comments in a copy-ready format (for example in markdown)
```

Pull request will have CI (checks) and it will be merged with all commits preserved.

## Issues strategy

Github issues with tickets that have labels for story points:

```
story-point:<value>
```

1 story point ≈ 1h of focused work
2 points → 2h
3 points → 3h
5 points → 5h
8 points -> 8h
