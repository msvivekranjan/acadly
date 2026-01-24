ACADLY
Decentralized academic resource aggregator.
────────────────────────────────────────────────────────

v2.1  •  Stable  •  Open Access


[ LIVE DEPLOYMENT ]       [ ARCHITECTURE ]       [ CONTRIBUTION ]


›  OVERVIEW
   Acadly is a client-side, single-page resource engine designed to 
   aggregate and serve academic materials (notes, PYQs, datasets) 
   without backend dependency. It utilizes a custom virtual routing 
   system to manage views and state within a static context.


›  CORE ARCHITECTURE

   ▪  Client-Side Indexing
      Search logic runs entirely in the browser. On initialization, 
      the application fetches `data.json`, builds a relational index 
      of Colleges > Semesters > Subjects, and executes queries with 
      zero network latency after load.

   ▪  Liquid Glassmorphism Engine
      UI rendering utilizes complex CSS logic involving backdrop-filters, 
      multi-layer mesh gradients, and rgba alpha-blending to create 
      a "liquid glass" aesthetic that remains performant (60fps) on 
      mobile devices.

   ▪  Virtual View Router
      To eliminate page reloads, Acadly uses a lightweight DOM 
      manipulation script. Navigation events trigger a visibility 
      toggle between `#home-view` and `#about-view` containers, 
      preserving state and reducing bandwidth usage.


›  TECHNICAL SPECIFICATIONS

   Frontend      ›  HTML5, CSS3 (Variables + Grid), ES6+ JavaScript
   Data Layer    ›  JSON (Relational Structure)
   Animation     ›  CSS Keyframes + RequestAnimationFrame Loop
   Dependencies  ›  None (Vanilla Implementation)


›  FILE STRUCTURE

   .
   ├── index.html        # Single entry point (Home + Virtual Views)
   ├── script.js         # Router, Search Indexer, DOM Hydration
   ├── style.css         # Glassmorphism Logic, Responsive Grid
   ├── data.json         # Centralized Data Repository
   └── assets/           # SVG Icons, Static Resources


›  DATA FLOW

   Initialization
   └── Fetch `data.json`
       ├── Populate `appData` global state
       └── Trigger `buildSearchIndex()`

   Interaction
   └── User Input (Search/Nav)
       ├── Filter `searchIndex` array
       └── Inject HTML into DOM via Template Literals

   Rendering
   └── CSS Engine
       ├── Apply `backdrop-filter: blur()`
       └── Calculate layout (Mobile/Desktop)


›  INSTALLATION & DEPLOYMENT

   1. Clone Repository
      $ git clone https://github.com/username/acadly.git

   2. Local Execution
      Since Acadly utilizes `fetch()` requests for JSON data, 
      it requires a local server context to avoid CORS policy 
      restrictions on file:// protocols.

      $ cd acadly
      $ python3 -m http.server 8000

   3. Access
      Navigate to `http://localhost:8000`


›  FEATURE MATRIX

   ✓  Universal Search (Colleges, Subjects, Semesters)
   ✓  Touch-Responsive Sliders (Mobile Swipe Logic)
   ✓  Infinite Marquee Scrollers (CSS + JS Hybrid)
   ✓  Dynamic Theme Parsing (JSON-to-DOM)
   —  User Authentication (Planned v3.0)
   —  Cloud Database Integration (Planned v3.0)


›  CONTRIBUTION GUIDELINES

   1. Fork the repository.
   2. Modify `data.json` to add new academic nodes.
   3. Ensure JSON syntax is valid (strict schema).
   4. Submit Pull Request with the tag [DATA] or [FIX].

────────────────────────────────────────────────────────
© 2024 Acadly Developers. MIT License.
