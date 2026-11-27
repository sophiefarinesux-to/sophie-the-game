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
        box(1.6, 0.25, 0.95, 0.07, 15, 17.5, "#9aa1ab");              // laptop lid
        quadY(0.321, 1.67, 2.48, 19.5, 31, "#22313a");
        quadY(0.322, 1.71, 2.44, 20.5, 30, "#3ad1c4");
        quadY(0.323, 1.78, 2.1, 26.5, 27.5, "#e6fffb");
        quadY(0.323, 1.78, 2.3, 24, 25, "#e6fffb");
        quadY(0.323, 1.78, 2.2, 21.5, 22.5, "#e6fffb");
        box(1.6, 0.32, 0.95, 0.55, 1.5, 17, "#c3c8cf");               // laptop base
        box(1.72, 0.4, 0.7, 0.3, 0.4, 18.5, "#8a9099");               // keys
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
    {
      // framed photo of Sophie between the bookshelf and the map
      id: "photo", x: 0, y: 4.7, w: 0.1, d: 0.95, h: 24, z: 30, stand: [1, 5], wall: true,
      draw() {
        quadX(0.02, 4.7, 5.65, 30, 54, "#8b5a3c");
        quadX(0.03, 4.78, 5.57, 32, 52, "#ffe9c9");
        quadX(0.04, 4.95, 5.4, 32, 37, "#e85d75");                     // shirt
        quadX(0.04, 5.0, 5.35, 37, 48, "#5a321c");                     // hair
        quadX(0.05, 5.07, 5.28, 38, 45, "#f0c19d");                    // face
        quadX(0.06, 5.11, 5.14, 42, 43, "#222");
        quadX(0.06, 5.2, 5.23, 42, 43, "#222");
      },
    },
    {
      // map poster: Toronto, France, Tallinn
      id: "map", x: 0, y: 6.1, w: 0.1, d: 2.2, h: 30, z: 26, stand: [1, 8], wall: true,
      draw() {
        quadX(0.01, 6.1, 8.3, 26, 56, "#fffdf6", "#c9c2ad");
        quadX(0.02, 6.2, 8.2, 28, 54, "#7ec8e3");
        quadX(0.03, 6.25, 6.95, 32, 52, "#7cc576");                    // North America
        quadX(0.03, 6.3, 6.75, 30, 33, "#7cc576");
        quadX(0.03, 7.05, 7.3, 47, 53, "#e9f2f5");                     // Greenland
        quadX(0.03, 7.45, 8.15, 34, 52, "#7cc576");                    // Europe
        quadX(0.04, 7.6, 7.75, 36, 39, "#64ad5e");
        // pins
        [[6.75, 40], [7.6, 41], [7.95, 48]].forEach(([y, z]) => {
          quadX(0.05, y - 0.05, y + 0.05, z, z + 4, "#e53935");
          quadX(0.06, y - 0.02, y + 0.02, z + 2, z + 3, "#fff");
        });
      },
    },
    {
      // coffee table on the rug with a Bernard Werber book
      id: "book", x: 3.1, y: 5.1, w: 0.8, d: 0.8, h: 14, z: 0, stand: [4, 5],
      draw() {
        box(3.2, 5.2, 0.6, 0.6, 8, 0, "#7a5230");
        box(3.1, 5.1, 0.8, 0.8, 2, 8, "#b07a4a");
        box(3.27, 5.25, 0.45, 0.35, 2, 10, "#fffdf6");                  // pages
        box(3.25, 5.23, 0.49, 0.39, 0.8, 10, "#2e5fa8");                // cover
        box(3.25, 5.4, 0.49, 0.05, 2.4, 10, "#1f4580");                 // spine
      },
    },
    {
      // guestbook on a little stand
      id: "guestbook", x: 9.15, y: 6.15, w: 0.7, d: 0.7, h: 22, z: 0, stand: [8, 6],
      draw() {
        box(9.3, 6.3, 0.4, 0.4, 14, 0, "#8b5a3c");
        box(9.15, 6.15, 0.7, 0.7, 2, 14, "#6d4a2e");
        box(9.22, 6.22, 0.56, 0.5, 1.5, 16, "#fffdf6");
        box(9.22, 6.46, 0.56, 0.03, 1.8, 16, "#c9c2ad");
        box(9.62, 6.3, 0.04, 0.04, 7, 17.5, "#ffffff");                 // quill
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
    it.cx = it.x + it.w / 2;
    it.cy = it.y + it.d / 2;
  }

  // ── Patapouf the cat ─────────────────────────────────────────
  const cat = {
    id: "cat", x: 6, y: 5, path: [], face: 1, wait: 2, paused: false, sleepy: 0,
    get cx() { return this.x + 0.5; },
    get cy() { return this.y + 0.5; },
    get bb() { return catBB(); },
    get key() { return this.x + this.y + 1; },
  };
  const CAT = Object.assign({ fur: "#f0a04b", stripes: "#c8742a", belly: "#ffe3c2" }, C.catColors || {});

  function updateCat(dt) {
    if (cat.paused) return;
    if (cat.path.length) {
      const [tx, ty] = cat.path[0];
      const dx = tx - cat.x, dy = ty - cat.y, dist = Math.hypot(dx, dy), s = 1.6 * dt;
      if (dx - dy !== 0) cat.face = dx - dy > 0 ? 1 : -1;
      if (dist <= s) { cat.x = tx; cat.y = ty; cat.path.shift(); if (!cat.path.length) cat.wait = 2 + Math.random() * 5; }
      else { cat.x += (dx / dist) * s; cat.y += (dy / dist) * s; }
      return;
    }
    cat.wait -= dt;
    if (cat.wait > 0) return;
    // pick a random free tile nearby that isn't Sophie's
    for (let tries = 0; tries < 20; tries++) {
      const tx = Math.round(cat.x) + Math.round((Math.random() - 0.5) * 8);
      const ty = Math.round(cat.y) + Math.round((Math.random() - 0.5) * 8);
      if (tx === Math.round(me.x) && ty === Math.round(me.y)) continue;
      const p = findPath(Math.round(cat.x), Math.round(cat.y), tx, ty);
      if (p && p.length) { cat.path = p; return; }
    }
    cat.wait = 1;
  }

  function catScreen() {
    const [sx, sy] = iso(cat.x + 0.5, cat.y + 0.5);
    return [Math.round(sx), Math.round(sy)];
  }
  function catBB() {
    const [x, y] = catScreen();
    return [x - 9, y - 15, x + 9, y + 1];
  }

  function drawCat(t) {
    const [x, y] = catScreen();
    const f = cat.face;
    const px = (dx, dy, w, h, c) => rect(f > 0 ? x + dx : x - dx - w, y + dy, w, h, c);
    ctx.fillStyle = "rgba(40,20,0,.2)";
    ctx.beginPath(); ctx.ellipse(x, y, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    const { fur, stripes, belly } = CAT;
    if (cat.path.length) {
      const s = Math.round(Math.sin(t * 16));
      px(-5, -8, 9, 4, fur);                                // body
      px(-3, -8, 1, 3, stripes); px(0, -8, 1, 3, stripes);
      px(-4, -5, 7, 1, belly);
      px(-4, -4, 1, 3 + s, fur); px(-2, -4, 1, 3 - s, fur); // legs
      px(1, -4, 1, 3 - s, fur); px(3, -4, 1, 3 + s, fur);
      px(3, -12, 4, 4, fur);                                // head
      px(3, -13, 1, 1, fur); px(6, -13, 1, 1, fur);         // ears
      px(5, -11, 1, 1, "#2f7d32"); px(7, -10, 1, 1, "#d9826b");
      px(-7, -12, 1, 5, fur); px(-6, -8, 1, 1, fur);        // tail
    } else {
      const tail = Math.round(Math.sin(t * 3));
      px(-3, -9, 6, 8, fur);                                // sitting body
      px(-1, -8, 3, 5, belly);
      px(-2, -9, 1, 3, stripes);
      px(-1, -14, 5, 5, fur);                               // head
      px(-1, -15, 1, 1, fur); px(3, -15, 1, 1, fur);
      px(2, -12, 1, 1, "#2f7d32"); px(0, -12, 1, 1, "#2f7d32");
      px(1, -11, 1, 1, "#d9826b");
      px(-6, -2 + tail, 4, 1, fur);                         // tail swish
    }
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
    const dx = it.cx - (me.x + 0.5), dy = it.cy - (me.y + 0.5);
    me.dir = dx + dy > 0 ? 1 : -1;
    openItem(it.id);
  }

  // walk next to Patapouf (who politely waits)
  function walkToCat() {
    cat.paused = true;
    cat.path = [];
    cat.x = Math.round(cat.x); cat.y = Math.round(cat.y);
    const sx = Math.round(me.x), sy = Math.round(me.y);
    if (Math.abs(sx - cat.x) + Math.abs(sy - cat.y) === 1) { me.target = cat; return arrive(); }
    let best = null;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const p = findPath(sx, sy, cat.x + dx, cat.y + dy);
      if (p && (!best || p.length < best.length)) best = p;
    }
    if (!best) { cat.paused = false; return; }
    me.path = best;
    me.target = cat;
    if (!best.length) arrive();
  }

  // ── Game state: meters & discoveries ─────────────────────────
  const found = new Set();
  let coffee = 70;
  const $ = (s) => document.querySelector(s);
  const total = ITEMS.length + 1; // + Patapouf

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
  // little SVG map of the North Atlantic with a pin per place
  function mapHtml() {
    const X = (lon) => ((lon + 95) / 130) * 400, Y = (lat) => ((68 - lat) / 38) * 200;
    const shape = (pts, fill) => `<polygon fill="${fill}" points="${pts.map(([lo, la]) => X(lo).toFixed(1) + "," + Y(la).toFixed(1)).join(" ")}"/>`;
    const land = "#7cc576";
    const svg = `<svg class="map" viewBox="0 0 400 200" role="img" aria-label="Map with pins on ${C.places.map((p) => p.name).join(", ")}">
      <rect width="400" height="200" fill="#7ec8e3"/>
      ${shape([[-95, 30], [-81, 30], [-80, 32], [-75, 35], [-70, 41], [-66, 44], [-60, 46], [-53, 47], [-55, 52], [-60, 55], [-64, 60], [-75, 62], [-80, 63], [-95, 64]], land)}
      ${shape([[-58, 68], [-50, 62], [-44, 60], [-38, 65], [-30, 68]], "#e9f2f5")}
      ${shape([[-24, 64], [-14, 64], [-14, 66], [-22, 66.5]], land)}
      ${shape([[-10, 36], [-9, 43], [-2, 44], [-5, 48], [-2, 49], [2, 51], [5, 53], [8, 54], [10, 57], [5, 58], [5, 62], [10, 64], [15, 68], [35, 68], [35, 40], [28, 41], [20, 40], [15, 38], [12, 44], [8, 44], [3, 43], [-1, 37]], land)}
      ${shape([[-6, 50], [1, 51], [2, 53], [-3, 56], [-5, 58], [-6, 55]], land)}
      ${C.places.map((p) => `<g transform="translate(${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)})">
          <path d="M0 0 C-7 -9 -7 -16 0 -16 C7 -16 7 -9 0 0Z" fill="#e53935" stroke="#fff" stroke-width="1.5"/>
          <circle cy="-11" r="2.5" fill="#fff"/>
          <text y="12" text-anchor="middle" class="pin-label">${p.name}</text></g>`).join("")}
    </svg>`;
    const list = C.places.map((p) => `<li><strong>${p.flag} ${p.name}</strong>, ${p.country}<br><span>${p.note}</span></li>`).join("");
    return `<p>${C.placesIntro}</p>${svg}<ul class="places">${list}</ul>`;
  }

  function guestbookHtml() {
    return `<p>${C.items.guestbook.intro}</p>
      <form class="gb" novalidate>
        <fieldset class="moods"><legend>First impression</legend>
          ${["😍 Love it", "🙂 Nice", "🤔 Interesting", "💡 I have ideas"].map((m, i) =>
            `<label><input type="radio" name="mood" value="${m}"${i === 0 ? "" : ""}><span>${m}</span></label>`).join("")}
        </fieldset>
        <label class="field">Your feedback
          <textarea name="message" rows="4" maxlength="1500" placeholder="A few words about my portfolio…" required></textarea></label>
        <label class="field">Your name <small>(optional)</small>
          <input name="name" maxlength="80" autocomplete="name"></label>
        <div class="gb-foot"><button class="btn" type="submit">✍️ Sign the guestbook</button><span class="gb-status" role="status"></span></div>
      </form>`;
  }

  async function sendFeedback(form) {
    const status = form.querySelector(".gb-status");
    const fd = new FormData(form);
    const message = String(fd.get("message") || "").trim();
    const name = String(fd.get("name") || "").trim() || "Anonymous";
    const mood = String(fd.get("mood") || "");
    if (!message) { status.textContent = "Write a few words first 🙂"; form.message.focus(); return; }
    const F = C.feedback || {};
    if (F.formspree) {
      status.textContent = "Sending…";
      try {
        const r = await fetch(F.formspree, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, mood, message, _subject: "New guestbook entry on Sophie's Studio" }),
        });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        status.textContent = "Thank you! Sophie will read it 💌";
      } catch {
        status.textContent = "Oops, that didn't send. Please try again.";
      }
    } else if (C.links.email) {
      const body = `${mood ? mood + "\n\n" : ""}${message}\n\n— ${name}`;
      location.href = `mailto:${C.links.email}?subject=${encodeURIComponent("Feedback on your portfolio")}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app…";
    } else {
      status.innerHTML = '<mark class="todo">Guestbook not connected yet: add a Formspree URL or your email in content.js.</mark>';
    }
  }
  function bindForms(root) {
    root.querySelectorAll("form.gb").forEach((f) =>
      f.addEventListener("submit", (e) => { e.preventDefault(); sendFeedback(f); }));
  }

  const special = { __CONTACT__: contactHtml, __MAP__: mapHtml, __GUESTBOOK__: guestbookHtml };
  const bodyFor = (id) => (special[C.items[id].body] ? special[C.items[id].body]() : C.items[id].body);

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
    bindForms($("#dlg-body"));
    $("#bubble").hidden = true;
    $("#tooltip").hidden = true;
    $("#dialog").hidden = false;
    $("#dlg-close").focus();
    if (first && found.size === total) setTimeout(() => say(C.outro, 7000), 400);
  }
  function closeDialog() {
    $("#dialog").hidden = true;
    if (cat.paused) { cat.paused = false; cat.wait = 3; }
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
    const area = (b) => (b[2] - b[0]) * (b[3] - b[1]);
    const hits = [cat, ...ITEMS].filter((it) => { const b = it.bb; return px >= b[0] && px <= b[2] && py >= b[1] && py <= b[3]; });
    hits.sort((a, b) => area(a.bb) - area(b.bb)); // smallest (most specific) wins
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
    if (it === cat) return walkToCat();
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
      if (e.target.closest("button, a, input, textarea")) return;
      const mx = Math.round(me.x), my = Math.round(me.y);
      if (Math.abs(mx - Math.round(cat.x)) + Math.abs(my - Math.round(cat.y)) <= 1) { e.preventDefault(); return walkToCat(); }
      const it = ITEMS.find((i) => i.stand[0] === mx && i.stand[1] === my);
      if (it) { e.preventDefault(); me.target = it; arrive(); }
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

    updateCat(dt);

    // coffee slowly runs out
    coffee = Math.max(0, coffee - dt * 0.8);
    if (coffee < 15 && !coffeeWarned) { coffeeWarned = true; say("Running low on coffee… ☕ (hint: the coffee machine!)"); }
    if (coffee > 50) coffeeWarned = false;
    $("#m-coffee").style.width = coffee + "%";

    // draw
    ctx.clearRect(0, 0, W, H);
    drawRoom();
    const drawables = [...ITEMS.map((it) => ({ key: it.key, it })), { key: me.x + me.y + 1, me: true }, { key: cat.key, cat: true }];
    drawables.sort((a, b) => a.key - b.key);
    for (const d of drawables) {
      if (d.me) { drawSophie(t); continue; }
      if (d.cat) { drawCat(t); continue; }
      const glow = hover === d.it;
      if (glow) ctx.filter = "brightness(1.15) saturate(1.2)";
      d.it.draw();
      ctx.filter = "none";
    }
    // "!" markers above undiscovered objects
    for (const it of [...ITEMS, cat]) {
      if (found.has(it.id)) continue;
      const bb = it.bb;
      const cx = Math.round((bb[0] + bb[2]) / 2), cy = Math.round(bb[1] - 9 + Math.sin(t * 4 + it.key) * 1.5);
      rect(cx - 2, cy - 1, 5, 9, "#3b2a00");
      rect(cx - 1, cy, 3, 5, "#ffd23f");
      rect(cx - 1, cy + 6, 3, 2, "#ffd23f");
    }
    placeBubble();
    requestAnimationFrame(frame);
  }

  // ── Boring mode (plain, accessible version of the same content) ──
  function buildBoring() {
    const order = ["photo", "couch", "map", "desk", "whiteboard", "shelf", "book", "plant", "cat", "coffee", "guestbook", "phone"];
    $("#boring-content").innerHTML = order
      .map((id) => `<section class="b-sec"><h2>${C.items[id].title}</h2>${bodyFor(id)}</section>`)
      .join("");
    bindForms($("#boring-content"));
  }
  function setMode(mode) {
    document.body.dataset.mode = mode;
    $("#whimsy").hidden = mode !== "whimsy";
    $("#boring").hidden = mode !== "boring";
    document.querySelectorAll(".toggle button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
    const url = new URL(location.href);
    if (mode === "boring") url.searchParams.set("mode", mode);
    else url.searchParams.delete("mode");
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
