# 🪴 Sophie's Studio

A tiny 90s-style isometric game about me, Sophie, a UX designer in Toronto.
Walk around my pixel studio and click on objects to discover my projects, process and story.

**▶ Play:** https://sophiefarinesux-to.github.io/sophie-the-game/

| Object | What you'll find |
| --- | --- |
| 🐈 Patapouf | My cat, wandering around the studio |
| 🖼️ Photo | Me! (drop a photo at `assets/me.jpg`) |
| 🗺️ Map poster | France, Tallinn, Toronto: the 3 countries I've lived in |
| 💻 Laptop | Projects |
| 📚 Bookshelf | Skills & tools |
| 📖 Book | My favourite writer, Bernard Werber, plus a review |
| 🖍️ Whiteboard | My design process |
| 🛋️ Couch | My story |
| ☕ Coffee machine | Fun facts (and a coffee refill) |
| 🌱 Plant | What I'm learning |
| ✍️ Guestbook | Visitors leave feedback on my portfolio |
| ☎️ Phone | Contact |

A plain, accessible version (add `?mode=boring` to the URL) shows the same content as a plain, accessible page.

## Controls
- **Click** an object (or the floor) to walk there
- **Arrow keys / WASD** to walk, **Enter** to interact, **Esc** to close

## Editing the content
All the text lives in [`js/content.js`](js/content.js). Placeholders are wrapped in `<mark class="todo">`, so search for `todo`.

## Guestbook setup
The guestbook can send entries straight to your inbox with [Formspree](https://formspree.io) (free plan). Create a form, copy its URL (`https://formspree.io/f/...`) and paste it into `feedback.formspree` in `js/content.js`. If you leave it empty, the guestbook opens an email to `links.email` instead.

## Running locally
No build step. Open `index.html` in a browser, or run:
```bash
python3 -m http.server 8000
```

## How it's made
Plain HTML, CSS and JavaScript with no libraries or image files. The whole room is drawn on a 480×290 canvas and scaled up with `image-rendering: pixelated` for the retro look.
