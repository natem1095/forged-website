# Portfolio Website Plan

## Site Structure

```
/
├── index.html          (Home - hero, value prop, featured work)
├── solutions.html      (Portfolio pieces - all projects)
├── about.html          (Your story, approach, why you)
├── contact.html        (Contact form or calendar link)
│
├── /solutions/
│   ├── sap-docusign.html    (DocuSign case study - detailed)
│   └── [future projects]
│
├── /css/
│   └── style.css       (All styles)
│
├── /js/
│   └── main.js         (Minimal JS if needed)
│
└── /assets/
    ├── /images/
    └── /diagrams/
```

## Page Breakdown

### Home (index.html)
- Hero section with headline and value prop
- What you do (brief)
- Featured work (1-2 highlights)
- Call to action (contact)

### Solutions (solutions.html)
- Grid/list of all portfolio pieces
- Each links to detailed case study
- Filterable by category (future)

### Individual Solution (solutions/sap-docusign.html)
- Full case study
- Problem → Solution → Architecture → Results
- Diagrams and visuals
- Call to action

### About (about.html)
- Your story (the bridge between business and tech)
- Your approach (how you work)
- Why clients choose you

### Contact (contact.html)
- Simple contact form OR
- Calendar booking link (Calendly)
- Email address
- LinkedIn

## Design Direction

### Principles
- Clean, professional, minimal
- Fast loading (no heavy frameworks)
- Mobile responsive
- Dark/light consideration (dark can look more technical)
- Easy to update

### Color Palette Options

**Option A: Professional Blue**
```css
--primary: #2563eb;      /* Blue */
--primary-dark: #1e40af;
--text: #1f2937;
--text-light: #6b7280;
--bg: #ffffff;
--bg-alt: #f9fafb;
--accent: #10b981;       /* Green for CTAs */
```

**Option B: Dark Technical**
```css
--bg: #0f172a;           /* Dark blue-black */
--bg-alt: #1e293b;
--text: #f1f5f9;
--text-light: #94a3b8;
--primary: #3b82f6;      /* Blue */
--accent: #22c55e;       /* Green */
```

**Option C: Neutral Professional**
```css
--primary: #18181b;      /* Near black */
--text: #27272a;
--text-light: #71717a;
--bg: #ffffff;
--bg-alt: #f4f4f5;
--accent: #2563eb;       /* Blue accent */
```

### Typography
- System fonts (fast, native feel) OR
- Inter / IBM Plex Sans (professional, technical)
- Monospace for code/technical elements

### Components Needed
- Navigation bar
- Hero section
- Project card
- Section headers
- Feature list
- Code/technical blocks
- Call-to-action buttons
- Footer

## Content to Write

### Homepage Headlines (options)
1. "I build enterprise integrations that actually work."
2. "SAP integrations in weeks, not months."
3. "Enterprise solutions. Startup speed."
4. "Connecting SAP to everything else."

### Value Proposition
"I help companies automate workflows and connect systems—delivering working solutions in weeks instead of months. No slide decks. No endless meetings. Just software that works."

### What You Do (bullets)
- SAP to cloud integrations (DocuSign, Salesforce, ServiceNow)
- Workflow automation and approval systems
- Custom business applications
- API development and integration architecture

## Domain Name Options

**Using Your Name:**
- nathanmurray.dev
- nathanmurray.io
- nmurray.dev

**Branded:**
- rapidintegrations.dev
- bridgearchitect.io
- systemsbridge.dev
- [something]labs.dev

**Considerations:**
- Your name = personal brand, follows you forever
- Branded = can grow beyond you, potentially sellable
- .dev and .io signal technical credibility

## Technical Stack

**Pure HTML/CSS/JS (your choice)**
- No frameworks
- No build process
- Full control
- Fast loading
- Easy to deploy anywhere

**Hosting Options:**
- GitHub Pages (free, easy)
- Netlify (free tier, easy)
- Vercel (free tier, easy)
- Any static hosting

## Questions Before Building

1. **Color direction?** Light professional, dark technical, or neutral?

2. **Name direction?** Your name or a brand name?

3. **Hero message?** Which resonates most?

4. **Tone?** More corporate/professional or more direct/personality?

---

Ready to start building when you decide on direction.
