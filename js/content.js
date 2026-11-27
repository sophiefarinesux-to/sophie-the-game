// ─────────────────────────────────────────────────────────────
//  EDIT ME!  Everything players read in the game lives here.
//  Placeholders are wrapped in <mark class="todo">…</mark>.
//  Keep it short: one or two lines per object.
// ─────────────────────────────────────────────────────────────
window.SOPHIE_CONTENT = {
  name: "Sophie",
  role: "UX Designer",
  city: "Toronto",

  intro: "Hi! I'm Sophie 👋",
  outro: "Sign my guestbook? ✍️",

  links: {
    github: "https://github.com/sophiefarinesux-to",
    linkedin: "", // TODO: https://www.linkedin.com/in/your-handle
    email: "",    // TODO: hello@yourdomain.com
    cv: "",       // TODO: link to your CV (PDF)
  },

  // Guestbook: paste a free Formspree form URL (https://formspree.io/f/xxxx)
  // to receive entries by email. Empty = falls back to links.email.
  feedback: { formspree: "" },

  // Patapouf's fur
  catColors: { fur: "#f0a04b", stripes: "#c8742a", belly: "#ffe3c2" },

  placesIntro: "3 countries. 1 designer.",
  places: [
    { name: "France", lat: 46.6, lon: 2.4 },
    { name: "Tallinn", lat: 59.44, lon: 24.75 },
    { name: "Toronto", lat: 43.65, lon: -79.38 },
  ],

  // `title` is only used for screen readers and the plain (?mode=boring) page.
  items: {
    photo: {
      label: "Me",
      title: "That's me",
      body: `
        <figure class="photo">
          <img src="assets/me.jpg" alt="Photo of Sophie"
               onerror="this.parentNode.innerHTML='<mark class=todo>assets/me.jpg</mark>'">
        </figure>
        <p class="lead">Hi, I'm Sophie. UX designer in Toronto.</p>`,
    },

    map: { label: "Map", title: "Where I've lived", body: "__MAP__" },

    book: {
      label: "Book",
      title: "Favourite book",
      body: `
        <div class="book">
          <div class="cover" aria-hidden="true"><span>B. Werber</span></div>
          <div>
            <p class="lead"><mark class="todo">Book title</mark></p>
            <p class="muted">Bernard Werber, my favourite writer</p>
            <p class="stars" aria-label="5 out of 5 stars">★★★★★</p>
            <p><mark class="todo">One-line review</mark></p>
          </div>
        </div>`,
    },

    cat: {
      label: "Patapouf",
      title: "Patapouf",
      body: `<p class="big">🐈</p><p class="lead">Patapouf</p><p class="muted">Chief napping officer.</p>`,
    },

    guestbook: {
      label: "Guestbook",
      title: "Guestbook",
      intro: "Your impression?",
      body: "__GUESTBOOK__",
    },

    desk: {
      label: "Projects",
      title: "Projects",
      body: `
        <ul class="links">
          <li><a href="https://github.com/sophiefarinesux-to/ux-audit-agent" target="_blank" rel="noopener">UX Audit Agent <span>→</span></a></li>
          <li><a href="https://github.com/sophiefarinesux-to/mortgage-calculator" target="_blank" rel="noopener">Mortgage Calculator <span>→</span></a></li>
        </ul>`,
    },

    shelf: {
      label: "Skills",
      title: "Skills",
      body: `
        <ul class="tags">
          <li>User research</li><li>Usability testing</li><li>UX audits</li>
          <li>Prototyping</li><li>Figma</li><li>Design systems</li>
        </ul>`,
    },

    whiteboard: {
      label: "Process",
      title: "How I work",
      body: `<p class="flow">Discover → Define → Design → Test → Iterate</p>`,
    },

    couch: {
      label: "About",
      title: "About me",
      body: `<p class="lead"><mark class="todo">One sentence about you</mark></p>`,
    },

    coffee: {
      label: "Coffee",
      title: "Fun fact",
      body: `<p class="big">☕</p><p class="lead"><mark class="todo">A fun fact</mark></p>`,
    },

    plant: {
      label: "Learning",
      title: "Currently learning",
      body: `<p class="big">🌱</p><p class="lead"><mark class="todo">What you're learning</mark></p>`,
    },

    phone: { label: "Contact", title: "Contact", body: "__CONTACT__" },
  },
};
