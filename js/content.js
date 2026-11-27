// ─────────────────────────────────────────────────────────────
//  EDIT ME!  Everything players read in the game lives here.
//  Anything wrapped in <mark class="todo">…</mark> is a placeholder
//  waiting for your real words — search the file for "todo".
// ─────────────────────────────────────────────────────────────
window.SOPHIE_CONTENT = {
  name: "Sophie",
  role: "UX Designer",
  city: "Toronto",

  // First thing Sophie says when the game loads
  intro: "Hi! I'm Sophie 👋 Welcome to my studio. Click on things to get to know me.",

  // Shown when every object has been discovered
  outro: "You've seen everything! Now you know me pretty well — let's talk? Pick up the phone ☎️",

  links: {
    github: "https://github.com/sophiefarinesux-to",
    linkedin: "", // TODO: e.g. https://www.linkedin.com/in/your-handle
    email: "",    // TODO: e.g. hello@yourdomain.com
    cv: "",       // TODO: link to a PDF of your CV
  },

  // One entry per clickable object in the room (ids must match game.js)
  items: {
    desk: {
      label: "Computer",
      title: "💾 My projects",
      body: `
        <p>Things I've designed and built:</p>
        <ul class="cards">
          <li>
            <strong>UX Audit Agent</strong>
            <span>An AI agent that reviews interfaces for UX issues.</span>
            <a href="https://github.com/sophiefarinesux-to/ux-audit-agent" target="_blank" rel="noopener">View on GitHub →</a>
          </li>
          <li>
            <strong>Mortgage Calculator</strong>
            <span>A calculator for figuring out mortgage payments.</span>
            <a href="https://github.com/sophiefarinesux-to/mortgage-calculator" target="_blank" rel="noopener">View on GitHub →</a>
          </li>
          <li>
            <strong>This game!</strong>
            <span>A 90s-style isometric portfolio, vibe-coded with Claude.</span>
          </li>
        </ul>
        <p><mark class="todo">Add your case studies here: problem, process, outcome.</mark></p>`,
    },

    shelf: {
      label: "Bookshelf",
      title: "📚 My toolkit",
      body: `
        <p>The skills and tools I reach for:</p>
        <ul class="tags">
          <li>User research</li><li>Usability testing</li><li>UX audits</li>
          <li>Wireframing</li><li>Prototyping</li><li>Figma</li>
          <li>Design systems</li><li>AI-assisted design</li>
        </ul>
        <p><mark class="todo">Edit this list to match your real skills.</mark></p>`,
    },

    whiteboard: {
      label: "Whiteboard",
      title: "🖍️ How I work",
      body: `
        <ol class="steps">
          <li><strong>Discover</strong> — talk to users, dig into the data</li>
          <li><strong>Define</strong> — frame the real problem</li>
          <li><strong>Design</strong> — sketch, wireframe, prototype</li>
          <li><strong>Test</strong> — put it in front of people</li>
          <li><strong>Iterate</strong> — repeat until it feels right</li>
        </ol>
        <p><mark class="todo">Describe what makes your process yours.</mark></p>`,
    },

    couch: {
      label: "Couch",
      title: "🛋️ My story",
      body: `
        <p>Pull up a cushion. I'm a UX designer based in Toronto.</p>
        <p><mark class="todo">How did you get into UX? What do you care about? What kind of team are you looking for?</mark></p>`,
    },

    coffee: {
      label: "Coffee machine",
      title: "☕ Coffee break",
      body: `
        <p>Coffee meter refilled! While we're here, a few fun facts:</p>
        <ul>
          <li><mark class="todo">Fun fact #1</mark></li>
          <li><mark class="todo">Fun fact #2</mark></li>
          <li><mark class="todo">How you take your coffee</mark></li>
        </ul>`,
    },

    plant: {
      label: "Plant",
      title: "🌱 Always growing",
      body: `
        <p>What I'm learning right now:</p>
        <p><mark class="todo">e.g. building with AI agents, front-end code, accessibility…</mark></p>`,
    },

    phone: {
      label: "Phone",
      title: "☎️ Let's talk",
      body: "__CONTACT__", // generated from `links` above
    },
  },
};
