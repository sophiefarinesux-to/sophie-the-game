# 🪴 Sophie's Studio

A tiny 90s-style isometric game about me, Sophie, a UX designer in Toronto.
Walk around my pixel studio and click on objects to discover my projects, process and story.

**▶ Play:** https://sophiefarinesux-to.github.io/sophie-the-game/

| Object | What you'll find |
| --- | --- |
| 💾 Computer | Projects |
| 📚 Bookshelf | Skills & tools |
| 🖍️ Whiteboard | My design process |
| 🛋️ Couch | My story |
| ☕ Coffee machine | Fun facts (and a coffee refill) |
| 🌱 Plant | What I'm learning |
| ☎️ Phone | Contact |

A plain, accessible version (add `?mode=boring` to the URL) shows the same content as a plain, accessible page.

## Controls
- **Click** an object (or the floor) to walk there
- **Arrow keys / WASD** to walk, **Enter** to interact, **Esc** to close

## Editing the content
All the text lives in [`js/content.js`](js/content.js). Placeholders are wrapped in `<mark class="todo">`, so search for `todo`.

## Running locally
No build step. Open `index.html` in a browser, or run:
```bash
python3 -m http.server 8000
```

## How it's made
Plain HTML, CSS and JavaScript with no libraries or image files. The whole room is drawn on a 480×290 canvas and scaled up with `image-rendering: pixelated` for the retro look.
