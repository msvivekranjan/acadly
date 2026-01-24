<div align="center">

```text
    _    ____    _    ____  _  __   __
   / \  / ___|  / \  |  _ \| | \ \ / /
  / _ \| |     / _ \ | | | | |  \ V / 
 / ___ \ |___ / ___ \| |_| | |___| |  
/_/   \_\____/_/   \_\____/|_____|_|  
                                      
:: DECENTRALIZED ACADEMIC KNOWLEDGE ENGINE ::

<br /> LIVE PREVIEW  •  DOCUMENTATION  •  REPORT BUG </div>› SYSTEM MANIFESTO"Acadly reduces the friction between students and knowledge. We do not store data; we index it. We do not reload pages; we mutate views. Speed is a feature."Acadly is a client-side, single-page application (SPA) built to aggregate academic resources. It operates without a traditional backend, relying on a relational JSON index to serve thousands of resource links instantly.› VISUAL ARCHITECTUREWe utilize a Virtual View System to manage state without page reloads.Code snippetgraph TD;
    A[User Entry] --> B{Router Logic};
    B -- Hash: #home --> C[Home View Container];
    B -- Hash: #about --> D[About View Container];
    C --> E[Search Module];
    C --> F[Stats Engine];
    D --> G[Team Grid];
    E -- Input --> H((JSON Index));
    H -- Query --> I[Dynamic DOM Injection];
(Note: If Mermaid is not supported in your viewer, see the ASCII fallback below)Plaintext[ USER INPUT ] 
      │
      ▼
[ ROUTER KERNEL ] ───┬─── [ #home ] ───► [ HERO / MARQUEE / SEARCH ]
      │              │
      │              └─── [ #about ] ───► [ MISSION / TEAM GRID ]
      ▼
[ DATA ENGINE ]
      │
      ├─► Fetch: data.json
      ├─► Build: Relational Index (College > Sem/Sub)
      └─► Render: Liquid Glass UI
› CORE CAPABILITIESSYMBOLMODULEDESCRIPTION⚡Zero-Latency SearchIndex builds on load. Queries execute in <50ms local time.🔮Liquid UIComplex CSS backdrop-filters create a dynamic glassmorphism effect.📱Touch PhysicsCustom JS handling for swipe gestures on sliders and carousels.🧬Virtual RoutingSingle index.html file mimics a multi-page site structure.♾️Infinity ScrollCSS/JS hybrid marquees for seamless content looping.› TECH STACKWe stick to the metal. No frameworks. No bloat.HTML5 — Semantic Structure & Virtual DOM ContainersCSS3 — Variables, Grid, Flexbox, & 3D TransformsJavaScript (ES6+) — Async Fetch, Event Delegation, DOM ManipulationJSON — Relational Data Schema› DIRECTORY STRUCTUREA clean architecture for scalable development.Bash📦 ACADLY-V2.1
 ┣ 📂 assets
 ┃ ┣ 📂 icons          # SVG System Icons
 ┃ ┗ 📂 images         # Optimized WebP Assets
 ┣ 📜 index.html       # The Monolith (View Controller)
 ┣ 📜 style.css        # The Paint (Glassmorphism Engine)
 ┣ 📜 script.js        # The Brain (Router & Search)
 ┣ 📜 data.json        # The Knowledge Base
 ┗ 📜 README.md        # System Documentation
› DEPLOYMENT PROTOCOLSince Acadly uses fetch() API calls to load external JSON, it requires a local server environment to bypass CORS restrictions.1. Clone the frequencyBashgit clone [https://github.com/username/acadly-v2.git](https://github.com/username/acadly-v2.git)
2. Initialize Local ServerBash# Python 3.x
python3 -m http.server 8000

# OR via Node.js (http-server)
npx http-server .
3. Access InterfaceOpen http://localhost:8000 in your browser.› CONTRIBUTION LOGICWe welcome code that is clean, commented, and performant.Fork the project.Branch for your feature (git checkout -b feature/AmazingFeature).Commit your changes (git commit -m 'Add: New Search Algorithm').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request.<div align="center">BUILT BY THE ACADLY CORE TEAM<br />Est. 2024 • Open Access • Decentralized</div>
