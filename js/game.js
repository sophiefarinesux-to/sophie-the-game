// Sophie's Studio — a tiny 90s-style isometric room.
// Everything is drawn with code (no image assets), at low resolution,
// then scaled up with `image-rendering: pixelated` for the retro look.
(() => {
  "use strict";
  const C = window.SOPHIE_CONTENT;

  // ── Canvas & isometric projection ────────────────────────────
  const canvas = document.getElementById("room");
  const ctx = canvas.getContext("2d");
  const W = 480, H = 290;
  canvas.width = W;
  canvas.height = H;

  const N = 10;            // room is N × N tiles
  const TW = 16, TH = 8;   // half tile width / height in pixels
  const OX = 240, OY = 92; // screen position of the back corner (0,0)
  const WALL = 66;         // wall height

  const iso = (x, y, z = 0) => [OX + (x - y) * TW, OY + (x + y) * TH - z];
  const toGrid = (sx, sy) => {
    const dx = (sx - OX) / TW, dy = (sy - OY) / TH;
    return [(dx + dy) / 2, (dy - dx) / 2];
  };

  // ── Drawing helpers ──────────────────────────────────────────
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  }
  function poly(pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }
  // Solid box: visible faces are top, front-left (y+d) and front-right (x+w)
  function box(x, y, w, d, h, z, color) {
    const top = shade(color, 0.1), left = color, right = shade(color, -0.12);
    const edge = shade(color, -0.3);
    poly([iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)], left, edge);
    poly([iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)], right, edge);
    poly([iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)], top, edge);
  }
  // Flat quad on the plane x = const (left wall direction)
  const quadX = (x, y0, y1, z0, z1, fill, stroke) =>
    poly([iso(x, y0, z0), iso(x, y1, z0), iso(x, y1, z1), iso(x, y0, z1)], fill, stroke);
  // Flat quad on the plane y = const (right wall direction)
  const quadY = (y, x0, x1, z0, z1, fill, stroke) =>
    poly([iso(x0, y, z0), iso(x1, y, z0), iso(x1, y, z1), iso(x0, y, z1)], fill, stroke);
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  // ── Room shell ───────────────────────────────────────────────
  function drawRoom() {
    // floor
    for (let x = 0; x < N; x++)
      for (let y = 0; y < N; y++)
        poly([iso(x, y), iso(x + 1, y), iso(x + 1, y + 1), iso(x, y + 1)],
          (x + y) % 2 ? "#e3cfa6" : "#d9c294", "#cbb283");

    // walls + wallpaper stripes
    quadX(0, 0, N, 0, WALL, "#8fcfc0");
    quadY(0, 0, N, 0, WALL, "#a9dccf");
    for (let i = 0.5; i < N; i += 0.5) {
      quadX(0, i, i + 0.06, 4, WALL, "rgba(255,255,255,.18)");
      quadY(0, i, i + 0.06, 4, WALL, "rgba(255,255,255,.22)");
    }
    // baseboards
    quadX(0, 0, N, 0, 4, "#5e9c8f");
    quadY(0, 0, N, 0, 4, "#6fae9f");
    // wall caps
    poly([iso(0, N, WALL), iso(0, 0, WALL), iso(N, 0, WALL), iso(N, -0.25, WALL), iso(-0.25, -0.25, WALL), iso(-0.25, N, WALL)], "#4c7f75");

    // window on the left wall, with a little Toronto skyline
    quadX(0.01, 1, 2.6, 22, 56, "#ffffff");
    quadX(0.02, 1.1, 2.5, 24, 54, "#9fd8f5");
    quadX(0.03, 1.1, 2.5, 24, 36, "#c3e8fa");
    quadX(0.03, 2.25, 2.4, 47, 50, "#ffe27a");            // sun
    quadX(0.04, 1.12, 1.4, 24, 33, "#6a7aa0");
    quadX(0.04, 1.4, 1.65, 24, 37, "#58688f");
    quadX(0.04, 1.78, 1.84, 24, 50, "#4b5a80");          // CN Tower shaft
    quadX(0.05, 1.73, 1.89, 40, 43, "#4b5a80");          // pod
    quadX(0.04, 1.95, 2.2, 24, 35, "#6a7aa0");
    quadX(0.04, 2.2, 2.48, 24, 31, "#58688f");
    quadX(0.06, 1.1, 2.5, 38.5, 39.5, "#ffffff");         // mullion

    // colour-palette poster above the couch
    quadX(0.01, 6.2, 8.2, 26, 54, "#fffdf6", "#c9c2ad");
    ["#e85d75", "#ffca28", "#3ad1c4", "#7e57c2"].forEach((c, i) =>
      quadX(0.02, 6.4 + i * 0.42, 6.75 + i * 0.42, 36, 50, c));
    quadX(0.02, 6.4, 8.0, 30, 32, "#c9c2ad");

    // clock on the right wall
    quadY(0.01, 3.55, 3.95, 44, 54, "#ffffff", "#555");
    quadY(0.02, 3.73, 3.77, 49, 53, "#333");
    quadY(0.02, 3.75, 3.88, 48.5, 49.5, "#333");

    // rug
    poly([iso(3, 3.2, 0.5), iso(7, 3.2, 0.5), iso(7, 7.2, 0.5), iso(3, 7.2, 0.5)], "#d84a6b");
    poly([iso(3.3, 3.5, 0.6), iso(6.7, 3.5, 0.6), iso(6.7, 6.9, 0.6), iso(3.3, 6.9, 0.6)], null, "#ffd1dc");
    poly([iso(4.4, 4.6, 0.6), iso(5.6, 4.6, 0.6), iso(5.6, 5.8, 0.6), iso(4.4, 5.8, 0.6)], "#ffca28");
  }

  // ── Furniture ────────────────────────────────────────────────
  // x,y,w,d = footprint on the grid; h,z = height/elevation of the hit box
  // stand = tile Sophie walks to; wall = sits on a wall, doesn't block the floor
  const ITEMS = [
    {
      id: "desk", x: 1, y: 0.05, w: 2.4, d: 0.95, h: 32, z: 0, stand: [2, 1],
      draw() {
        box(1.05, 0.85, 0.12, 0.12, 14, 0, "#7a5230");
        box(3.28, 0.85, 0.12, 0.12, 14, 0, "#7a5230");
        box(1, 0.05, 2.4, 0.95, 3, 14, "#b07a4a");
        box(1.55, 0.12, 0.9, 0.6, 13, 17, "#d9d2c1");                 // beige CRT
        quadY(0.721, 1.65, 2.35, 19.5, 28, "#22313a");
        quadY(0.722, 1.7, 2.3, 20.5, 27, "#3ad1c4");
        quadY(0.723, 1.76, 2.05, 25, 25.8, "#e6fffb");
        quadY(0.723, 1.76, 2.2, 23, 23.8, "#e6fffb");
        box(1.6, 0.76, 0.85, 0.16, 1.5, 17, "#ebe5d6");               // keyboard
        box(2.85, 0.4, 0.17, 0.17, 4, 17, "#e85d75");                 // mug
        box(2.75, 0.75, 0.22, 0.14, 1, 17, "#555c66");                // mouse
      },
    },
    {
      id: "plant", x: 4.15, y: 0.15, w: 0.6, d: 0.6, h: 30, z: 0, stand: [4, 1],
      draw() {
        box(4.2, 0.2, 0.5, 0.5, 9, 0, "#c8643c");
        box(4.1, 0.1, 0.7, 0.7, 9, 9, "#3f9b48");
        box(4.22, 0.22, 0.46, 0.46, 9, 18, "#58b85f");
        box(4.33, 0.33, 0.24, 0.24, 5, 27, "#7ad27f");
      },
    },
    {
      id: "whiteboard", x: 5, y: 0, w: 2.2, d: 0.12, h: 30, z: 24, stand: [6, 1], wall: true,
      draw() {
        quadY(0.02, 5, 7.2, 24, 56, "#9aa0a6");
        quadY(0.03, 5.08, 7.12, 26, 54, "#fbfbf7");
        quadY(0.04, 5.2, 5.5, 45, 51, "#ffd84d");
        quadY(0.04, 5.65, 5.95, 45, 51, "#ff9ecb");
        quadY(0.04, 6.1, 6.4, 45, 51, "#8fe3a0");
        quadY(0.04, 6.55, 6.85, 45, 51, "#9ecbff");
        ctx.strokeStyle = "#3a6fd8"; ctx.lineWidth = 1; ctx.beginPath();
        const pts = [[5.25, 30], [5.6, 34], [5.9, 32], [6.3, 38], [6.65, 36], [7, 41]];
        pts.forEach(([x, z], i) => { const [sx, sy] = iso(x, 0.04, z); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); });
        ctx.stroke();
        box(5.1, 0.03, 2, 0.14, 1.5, 24, "#80868b");                  // marker tray
      },
    },
    {
      id: "coffee", x: 7.6, y: 0.05, w: 2.35, d: 0.9, h: 36, z: 0, stand: [8, 1],
      draw() {
        box(7.6, 0.05, 2.35, 0.9, 18, 0, "#e9e4da");
        quadY(0.951, 7.8, 8.7, 3, 15, "#d6cfc1");
        quadY(0.951, 8.85, 9.75, 3, 15, "#d6cfc1");
        box(7.6, 0.05, 2.35, 0.9, 2, 18, "#6d6a75");                   // counter top
        box(8.55, 0.15, 0.6, 0.45, 15, 20, "#333a40");                 // machine
        quadY(0.601, 8.65, 8.75, 31, 32, "#ff5252");
        box(8.72, 0.62, 0.18, 0.14, 4, 20, "#ffffff");                 // cup
        box(9.35, 0.25, 0.3, 0.3, 8, 20, "#c98b4f");                   // bean jar
      },
    },
    {
      id: "shelf", x: 0.05, y: 2.6, w: 0.75, d: 1.8, h: 64, z: 0, stand: [1, 3],
      draw() {
        box(0.05, 2.6, 0.75, 1.8, 64, 0, "#8b5a3c");
        const books = ["#e85d75", "#3ad1c4", "#ffca28", "#7e57c2", "#f4f1e8", "#4caf50", "#ff8a65", "#5c6bc0"];
        [5, 20, 35, 50].forEach((z, row) => {
          quadX(0.801, 2.7, 4.3, z, z + 12, "#4e3020");
          let y = 2.73, i = row * 3;
          while (y < 4.15) {
            const bw = 0.1 + ((i * 7) % 3) * 0.03, bh = 8 + ((i * 5) % 4);
            if ((i + row) % 9 !== 4) quadX(0.802, y, y + bw, z, z + bh, books[i % books.length]);
            y += bw + 0.02; i++;
          }
        });
      },
    },
    {
      id: "couch", x: 0.05, y: 5.85, w: 0.95, d: 2.9, h: 22, z: 0, stand: [1, 7],
      draw() {
        box(0.05, 6, 0.3, 2.6, 20, 0, "#6a48b0");
        box(0.1, 5.85, 0.85, 0.3, 13, 0, "#6a48b0");
        box(0.1, 6.1, 0.85, 2.4, 9, 0, "#8562cc");
        box(0.35, 6.35, 0.25, 0.55, 7, 9, "#ffca28");                  // cushion
        box(0.35, 7.7, 0.25, 0.55, 7, 9, "#3ad1c4");
        box(0.1, 8.45, 0.85, 0.3, 13, 0, "#6a48b0");
      },
    },
    {
      id: "phone", x: 0.1, y: 9.1, w: 0.8, d: 0.8, h: 22, z: 0, stand: [1, 9],
      draw() {
        box(0.1, 9.1, 0.8, 0.8, 14, 0, "#a1887f");
        box(0.28, 9.3, 0.45, 0.4, 4, 14, "#e53935");
        box(0.25, 9.32, 0.5, 0.13, 2.5, 18, "#b71c1c");
      },
    },
  ];
  const ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

  // tiles blocked by furniture
  const blocked = new Set();
  for (const it of ITEMS) {
    if (it.wall) continue;
    for (let tx = Math.floor(it.x); tx < Math.ceil(it.x + it.w); tx++)
      for (let ty = Math.floor(it.y); ty < Math.ceil(it.y + it.d); ty++) blocked.add(tx + "," + ty);
  }
  const free = (x, y) => x >= 0 && y >= 0 && x < N && y < N && !blocked.has(x + "," + y);

  // screen bounding box for hover / click hit-testing
  for (const it of ITEMS) {
    const pts = [];
    for (const dx of [0, it.w]) for (const dy of [0, it.d]) for (const dz of [0, it.h]) pts.push(iso(it.x + dx, it.y + dy, it.z + dz));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    it.bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    it.key = it.x + it.w / 2 + it.y + it.d / 2;
  }

  // ── Sophie ───────────────────────────────────────────────────
  const me = { x: 5, y: 8, path: [], dir: 1, moving: false, target: null };

  function drawSophie(t) {
    const [sx, sy] = iso(me.x + 0.5, me.y + 0.5);
    const bob = me.moving ? Math.round(Math.abs(Math.sin(t * 14))) : 0;
    const step = me.moving ? Math.round(Math.sin(t * 14) * 1.5) : 0;
    const x = Math.round(sx), y = Math.round(sy) - bob;

    ctx.fillStyle = "rgba(40,20,0,.22)";
    ctx.beginPath(); ctx.ellipse(sx, sy, 6, 3, 0, 0, Math.PI * 2); ctx.fill();

    rect(x - 3, y - 8 + Math.max(0, step), 2, 8 - Math.max(0, step), "#2d3a6b"); // legs
    rect(x + 1, y - 8 + Math.max(0, -step), 2, 8 - Math.max(0, -step), "#2d3a6b");
    rect(x - 3, y - 1, 2, 1, "#1d1d1d"); rect(x + 1, y - 1, 2, 1, "#1d1d1d");
    rect(x - 4, y - 16, 8, 9, "#e85d75");                       // top
    rect(x - 4, y - 16, 8, 1, "#f17d92");
    rect(x - 5, y - 15 + (me.moving ? step : 0), 1, 6, "#f0c19d"); // arms
    rect(x + 4, y - 15 - (me.moving ? step : 0), 1, 6, "#f0c19d");
    rect(x - 3, y - 22, 6, 6, "#f0c19d");                       // head
    rect(x - 4, y - 24, 8, 3, "#5a321c");                       // hair
    rect(x - 4, y - 21, 1, 7, "#5a321c");
    rect(x + 3, y - 21, 1, 7, "#5a321c");
    if (me.dir > 0) {                                           // facing camera
      const o = me.face || 0;
      rect(x - 2 + o, y - 19, 1, 1, "#222"); rect(x + 1 + o, y - 19, 1, 1, "#222");
      rect(x - 1 + o, y - 17, 2, 1, "#d9826b");
    } else {
      rect(x - 3, y - 22, 6, 4, "#5a321c");                     // back of head
    }
  }

  // BFS path on the tile grid
  function findPath(sx, sy, tx, ty) {
    if (!free(tx, ty)) return null;
    const prev = new Map([[sx + "," + sy, null]]);
    const q = [[sx, sy]];
    while (q.length) {
      const [x, y] = q.shift();
      if (x === tx && y === ty) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = nx + "," + ny;
        if (free(nx, ny) && !prev.has(k)) { prev.set(k, [x, y]); q.push([nx, ny]); }
      }
    }
    if (!prev.has(tx + "," + ty)) return null;
    const path = [];
    for (let p = [tx, ty]; p && !(p[0] === sx && p[1] === sy); p = prev.get(p[0] + "," + p[1])) path.unshift(p);
    return path;
  }

  function walkTo(tx, ty, item = null) {
    const sx = Math.round(me.x), sy = Math.round(me.y);
    const path = findPath(sx, sy, tx, ty);
    if (!path) return;
    me.path = path;
    me.target = item;
    if (!path.length && item) arrive();
  }

  function arrive() {
    const it = me.target;
    me.target = null;
    if (!it) return;
    // turn toward the object
    const dx = it.x + it.w / 2 - (me.x + 0.5), dy = it.y + it.d / 2 - (me.y + 0.5);
    me.dir = dx + dy > 0 ? 1 : -1;
    openItem(it.id);
  }

  // ── Game state: meters & discoveries ─────────────────────────
  const found = new Set();
  let coffee = 70;
  const $ = (s) => document.querySelector(s);
  const total = ITEMS.length;

  function updateHud() {
    $("#m-coffee").style.width = coffee + "%";
    $("#m-curious").style.width = (found.size / total) * 100 + "%";
    $("#m-fun").style.width = Math.min(100, 30 + found.size * 10) + "%";
    $("#found").textContent = `${found.size}/${total}`;
  }

  // ── UI: speech bubble, tooltip, dialog ───────────────────────
  let bubbleTimer;
  function say(text, ms = 4500) {
    const b = $("#bubble");
    b.textContent = text;
    b.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => (b.hidden = true), ms);
  }
  function placeBubble() {
    const b = $("#bubble");
    if (b.hidden) return;
    const r = canvas.getBoundingClientRect(), s = r.width / W;
    const [sx, sy] = iso(me.x + 0.5, me.y + 0.5);
    b.style.left = sx * s + "px";
    b.style.top = (sy - 30) * s + "px";
  }

  function contactHtml() {
    const L = C.links, rows = [];
    if (L.email) rows.push(`<a class="btn" href="mailto:${L.email}">✉️ ${L.email}</a>`);
    if (L.linkedin) rows.push(`<a class="btn" href="${L.linkedin}" target="_blank" rel="noopener">💼 LinkedIn</a>`);
    if (L.cv) rows.push(`<a class="btn" href="${L.cv}" target="_blank" rel="noopener">📄 My CV</a>`);
    rows.push(`<a class="btn" href="${L.github}" target="_blank" rel="noopener">🐙 GitHub</a>`);
    const missing = !L.email || !L.linkedin ? `<p><mark class="todo">Add your email, LinkedIn and CV in js/content.js → links.</mark></p>` : "";
    return `<p>Ring ring! I'd love to hear from you.</p><div class="btn-row">${rows.join("")}</div>${missing}`;
  }
  const bodyFor = (id) => (C.items[id].body === "__CONTACT__" ? contactHtml() : C.items[id].body);

  let lastFocus = null;
  function openItem(id) {
    const data = C.items[id];
    const first = !found.has(id);
    found.add(id);
    if (id === "coffee") coffee = 100;
    updateHud();
    lastFocus = document.activeElement;
    $("#dlg-title").textContent = data.title;
    $("#dlg-body").innerHTML = bodyFor(id);
    $("#bubble").hidden = true;
    $("#tooltip").hidden = true;
    $("#dialog").hidden = false;
    $("#dlg-close").focus();
    if (first && found.size === total) setTimeout(() => say(C.outro, 7000), 400);
  }
  function closeDialog() {
    $("#dialog").hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  $("#dlg-close").addEventListener("click", closeDialog);
  $("#dlg-ok").addEventListener("click", closeDialog);
  $("#dialog").addEventListener("click", (e) => { if (e.target.id === "dialog") closeDialog(); });

  // ── Input ────────────────────────────────────────────────────
  let hover = null;
  function canvasPoint(e) {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height];
  }
  function itemAt(px, py) {
    const hits = ITEMS.filter((it) => px >= it.bb[0] && px <= it.bb[2] && py >= it.bb[1] && py <= it.bb[3]);
    hits.sort((a, b) => b.key - a.key);
    return hits[0] || null;
  }
  canvas.addEventListener("mousemove", (e) => {
    const [px, py] = canvasPoint(e);
    hover = itemAt(px, py);
    const tip = $("#tooltip");
    if (hover) {
      const r = canvas.getBoundingClientRect(), s = r.width / W;
      tip.textContent = C.items[hover.id].label + (found.has(hover.id) ? "" : "  ✨");
      tip.style.left = ((hover.bb[0] + hover.bb[2]) / 2) * s + "px";
      tip.style.top = hover.bb[1] * s - 8 + "px";
      tip.hidden = false;
      canvas.style.cursor = "pointer";
    } else {
      tip.hidden = true;
      const [gx, gy] = toGrid(px, py);
      canvas.style.cursor = free(Math.floor(gx), Math.floor(gy)) ? "crosshair" : "default";
    }
  });
  canvas.addEventListener("mouseleave", () => { hover = null; $("#tooltip").hidden = true; });
  canvas.addEventListener("click", (e) => {
    const [px, py] = canvasPoint(e);
    const it = itemAt(px, py);
    if (it) return walkTo(it.stand[0], it.stand[1], it);
    const [gx, gy] = toGrid(px, py);
    walkTo(Math.floor(gx), Math.floor(gy));
  });

  window.addEventListener("keydown", (e) => {
    if (!$("#dialog").hidden) { if (e.key === "Escape") closeDialog(); return; }
    if (document.body.dataset.mode !== "whimsy") return;
    const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    if (dirs[e.key] && !me.path.length) {
      e.preventDefault();
      const [dx, dy] = dirs[e.key];
      walkTo(Math.round(me.x) + dx, Math.round(me.y) + dy);
    } else if (e.key === "Enter" || e.key === " ") {
      const it = ITEMS.find((i) => i.stand[0] === Math.round(me.x) && i.stand[1] === Math.round(me.y));
      if (it && !e.target.closest("button, a")) { e.preventDefault(); me.target = it; arrive(); }
    }
  });

  // ── Main loop ────────────────────────────────────────────────
  const SPEED = 4.5; // tiles per second
  let last = performance.now(), coffeeWarned = false;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;

    // movement
    me.moving = me.path.length > 0;
    if (me.moving) {
      const [tx, ty] = me.path[0];
      const dx = tx - me.x, dy = ty - me.y, dist = Math.hypot(dx, dy), stepLen = SPEED * dt;
      me.dir = dx + dy >= 0 ? 1 : -1;
      me.face = dx - dy > 0 ? 1 : dx - dy < 0 ? -1 : 0;
      if (dist <= stepLen) {
        me.x = tx; me.y = ty; me.path.shift();
        if (!me.path.length) arrive();
      } else { me.x += (dx / dist) * stepLen; me.y += (dy / dist) * stepLen; }
    }

    // coffee slowly runs out
    coffee = Math.max(0, coffee - dt * 0.8);
    if (coffee < 15 && !coffeeWarned) { coffeeWarned = true; say("Running low on coffee… ☕ (hint: the coffee machine!)"); }
    if (coffee > 50) coffeeWarned = false;
    $("#m-coffee").style.width = coffee + "%";

    // draw
    ctx.clearRect(0, 0, W, H);
    drawRoom();
    const drawables = [...ITEMS.map((it) => ({ key: it.key, it })), { key: me.x + me.y + 1, me: true }];
    drawables.sort((a, b) => a.key - b.key);
    for (const d of drawables) {
      if (d.me) { drawSophie(t); continue; }
      const glow = hover === d.it;
      if (glow) ctx.filter = "brightness(1.15) saturate(1.2)";
      d.it.draw();
      ctx.filter = "none";
    }
    // "!" markers above undiscovered objects
    for (const it of ITEMS) {
      if (found.has(it.id)) continue;
      const cx = Math.round((it.bb[0] + it.bb[2]) / 2), cy = Math.round(it.bb[1] - 9 + Math.sin(t * 4 + it.key) * 1.5);
      rect(cx - 2, cy - 1, 5, 9, "#3b2a00");
      rect(cx - 1, cy, 3, 5, "#ffd23f");
      rect(cx - 1, cy + 6, 3, 2, "#ffd23f");
    }
    placeBubble();
    requestAnimationFrame(frame);
  }

  // ── Boring mode (plain, accessible version of the same content) ──
  function buildBoring() {
    const order = ["couch", "desk", "whiteboard", "shelf", "plant", "coffee", "phone"];
    $("#boring-content").innerHTML = order
      .map((id) => `<section class="b-sec"><h2>${C.items[id].title}</h2>${bodyFor(id)}</section>`)
      .join("");
  }
  function setMode(mode) {
    document.body.dataset.mode = mode;
    $("#whimsy").hidden = mode !== "whimsy";
    $("#boring").hidden = mode !== "boring";
    document.querySelectorAll(".toggle button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
    const url = new URL(location.href);
    url.searchParams.set("mode", mode);
    history.replaceState(null, "", url);
  }
  document.querySelectorAll(".toggle button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  // ── Start ────────────────────────────────────────────────────
  $("#hud-name").textContent = C.name;
  $("#hud-role").textContent = `${C.role} · ${C.city}`;
  buildBoring();
  setMode(new URLSearchParams(location.search).get("mode") === "boring" ? "boring" : "whimsy");
  updateHud();
  requestAnimationFrame(frame);
  setTimeout(() => say(C.intro, 6000), 500);
})();
