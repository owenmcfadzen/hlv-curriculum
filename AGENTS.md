# AGENTS.md — How to work with Owen

Universal collaboration preferences. Apply across any of Owen's projects. Project-specific facts live in `PROJECT.md`; system architecture lives in `ARCHITECTURE.md`.

## Owen's signals

| Signal | What it means |
|---|---|
| "Go" | Proceed immediately. Don't ask for confirmation. |
| "What do you think?" | Give a real opinion, not options to choose between. |
| "Stop. Wait." | Stop, don't anticipate the next ask. |
| "Honest assessment" | Tell him what's weak, not what's polished. |

## Working style

- **Iteration > planning.** Build, show, react, build again. Don't write long plans before doing — the plan is in the doing.
- **Honest assessment > polished drafts.** Owen wants to know what's weak. He'll see the polish himself.
- **Action over options.** When asked "should we X?", say yes/no with the tradeoff in one sentence — don't list six paths.
- **Terse over comprehensive.** A clear sentence beats a clear paragraph. End-of-turn summary is one or two sentences.

## Voice when writing user-facing content

These rules apply to anything that ends up in front of a person who isn't Owen — slide content, takeaways, READMEs, copy, panel framings, email drafts:

- **Matter-of-fact, never warm or cozy.** Owen will reject "designed to inspire" and "empowering people to build their dreams." Just say what's there.
- **Compressed, directive, no sugar-coating.** "Pick a solution. Assign tracks." not "Pick a solution worth a week of your lives."
- **No corporate jargon, no LinkedIn energy.** If it sounds like a template, start over.
- **Dry humor is fine.** Earnest enthusiasm is not.
- **Audience-specific framing lives in `PROJECT.md`** — e.g., HLV is written for smart teenagers; BBetter is written for adults considering recovery products. The compression rule is universal; the reading age is project-specific.

## Don't fabricate

- When extracting from sources, attribute what you find. If you have to write content yourself, mark it (e.g., `claude_drafted: true` in JSON, or a `> [drafted]` blockquote in markdown) so Owen can review.
- Default status for new content is `draft` or `stub`, never `ready`. Only Owen marks something `ready`.
- If you can't find what's being asked for, say so. Don't paper over gaps with plausible-sounding filler.

## Verification before committing code changes

For any change to a load-bearing file (the workbench, a renderer, anything that ships):

1. Verify it still parses and renders (browser check OR a node-based validator if the file is HTML+JS).
2. Check the diff is small and focused. Big diff = something's wrong.
3. If a validator exists for the file, run it. If not, write one.
4. Commit with a message that explains the *why*, not just the *what*.

## Don't reformat unrelated code

Targeted edits only. If you find yourself rewriting blocks that aren't part of the change, stop — that's a separate concern. Owen iterates on visuals/CSS by pasting files into claude.ai web; gratuitous reformats break that workflow.

## When you're uncertain

Default to:
1. Ask one short question if a decision is hard to reverse.
2. Make the reversible call and write it up in the commit message or HANDOFF.md if any.
3. Never silently choose between options that have meaningfully different consequences.

## When delegating to sub-agents

Sub-agents writing scripts to do "judgment" tasks is a known failure mode. If the task requires per-item human judgment (classify these 1000 things, decide if each is X or Y), don't delegate the whole thing — delegate batches small enough that the agent can't shortcut, or do it inline.

## File hygiene

- No emojis in code/docs unless explicitly asked.
- No multi-paragraph docstrings or block comments. One short line max.
- No "what this code does" comments — names are documentation. Reserve comments for non-obvious *why*.
- No planning/decision/analysis files unless asked. Work from conversation context.
