# Storyboard Prompt Builder

A small, dependency-free web app that turns a shot list into ready-to-paste
prompts for image and video generators, keeping characters and style
consistent from panel to panel.

## Use it

Open `index.html` in a browser (no build step or server needed), or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

1. Set the project: target tool, visual style, aspect ratio, default setting.
2. Add characters with a fixed "look" description. Any shot whose action or
   dialogue mentions a character by name gets that description injected.
3. Add shots: shot size, angle, camera move, action, setting, lighting, mood, duration.
4. Copy each prompt, **Copy all prompts**, or export to Markdown / JSON.

Work autosaves to the browser's localStorage. Use **Export JSON** / **Import JSON**
to back up or move a storyboard between machines.

## Target formats

| Target | Output |
| --- | --- |
| Generic | comma-separated keywords + negative prompt |
| Midjourney | keywords + `--ar`, optional `--v`, `--seed`, `--no` |
| Stable Diffusion / SDXL | style-first keywords + quality tags + negative prompt |
| DALL·E / GPT image | natural-language sentences |
| Video model | shot + camera move + duration, sentence-separated |

## Files

- `prompt.js` — prompt-building logic (pure, no DOM; also loadable in Node)
- `app.js` — UI
- `index.html`, `styles.css`
- `test/` — unit tests: `npm test` (Node 18+)
- `.claude/skills/storyboard-prompt-builder/` — Claude Code skill: run `/storyboard-prompt-builder` in a session opened on this repo
