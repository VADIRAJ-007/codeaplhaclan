# Cross-Disciplinary Project Incubator & Matchmaker

A platform that intelligently matches students across different departments (Engineering, Design, Business) to collaborate on comprehensive, startup-ready projects.

## Architecture

**Approach:** Pure HTML + CSS + JavaScript (no frameworks). The app will be a multi-page SPA using hash-based routing, with `localStorage` for data persistence. All code within a few files to keep it manageable for a hackathon.

**File Structure:**
```
Hackarena/
├── index.html          ← Main entry point + routing shell
├── styles.css          ← Design system + all styles
├── app.js              ← Core app logic, routing, state management
├── matching.js         ← AI-based team matching algorithm
├── pitchdeck.js        ← Pitch deck generator logic
└── assets/             ← Generated images (logo, hero, etc.)
```

## Design System

- **Theme:** Dark mode with glassmorphism, vibrant gradient accents
- **Color Palette:**
  - Background: `#0a0a1a` (deep navy-black)
  - Surface: `rgba(255,255,255,0.05)` with backdrop-blur (glass panels)
  - Primary gradient: `#667eea → #764ba2` (indigo-purple)
  - Secondary gradient: `#43cea2 → #185a9d` (teal-blue)
  - Accent: `#f093fb` (pink glow)
  - Text: `#e2e8f0` (light gray), `#94a3b8` (muted)
- **Typography:** Google Fonts — `Inter` for body, `Outfit` for headings
- **Effects:** Glassmorphism cards, subtle glow animations, smooth page transitions, micro-interactions on hover/click

## Proposed Changes — 6 Core Sections

### 1. Landing Page (`#/` route)
- Hero section with animated gradient background and floating particles
- Tagline: "Break Academic Silos. Build Startup-Ready Projects."
- Feature cards (Profile, Match, Workspace, Milestones, Pitch Deck)
- CTA buttons → "Get Started" / "Find Your Team"
- Stats counter (animated) — e.g., "500+ Students, 120+ Projects, 15 Departments"

### 2. Skills & Interest Profile Builder (`#/profile`)
- Multi-step form with progress indicator
- **Step 1:** Basic info — Name, department (Engineering/Design/Business/Sciences/Arts), year
- **Step 2:** Skills selection — tag-based picker with categories (Programming, UI/UX, Marketing, Finance, Data Science, etc.)
- **Step 3:** Interests — startup domains (HealthTech, FinTech, EdTech, GreenTech, etc.)
- **Step 4:** Availability & goals — hours/week, looking-for (co-founder, teammate, mentor)
- Profiles stored in `localStorage`, displayed as skill-radar charts

### 3. AI-Based Team Matching (`#/match`)
- Matching algorithm that pairs **complementary** skills (not similar):
  - Engineering + Design + Business = ideal trio
  - Scores based on: department diversity, skill complementarity, interest overlap, availability alignment
- **UI:** Swipe-style card interface showing match recommendations with compatibility percentage
- Team formation: accept/reject matches, view formed teams
- Visual compatibility breakdown (radar chart overlay)

### 4. Unified Project Workspace (`#/workspace`)
- Team dashboard with project name, description, team members
- Kanban-style task board (To Do / In Progress / Done)
- Drag-and-drop task cards
- File/link sharing section
- Team chat (simulated with localStorage)
- Role assignments (Lead, Developer, Designer, Strategist)

### 5. Milestone Tracker (`#/milestones`)
- Timeline view with milestone nodes
- Pre-defined startup milestones: Ideation → Research → MVP → Testing → Pitch → Launch
- Progress bar with percentage completion
- Each milestone expandable with checklist items
- Deadline tracking with visual indicators (on-track / at-risk / overdue)

### 6. Pitch Deck Generator (`#/pitch`) — Enhanced version of existing
- Keep existing form-based approach but greatly enhance:
  - More fields: Vision, Revenue Model, Competitive Advantage, Traction, Ask
  - Modern slide templates with consistent branding
  - AI-generated suggestions (template-based tips for each slide)
  - Export as full-screen presentation mode
  - Keyboard navigation (arrow keys)

## User Review Required

> [!IMPORTANT]
> This will **replace** the current `index.html` entirely with the new platform. The existing pitch deck generator functionality will be preserved and enhanced as one section of the larger platform.

> [!NOTE]
> All data is stored in `localStorage` — no backend needed. The "AI matching" uses a scoring algorithm (not actual ML) to demonstrate the concept convincingly.

## Open Questions

1. **Scope confirmation:** Should I build all 6 sections, or would you prefer to focus on a subset for the hackathon demo?
2. **Sample data:** Should I pre-populate with demo student profiles so the matching feature works immediately on first load?
3. **Any branding preferences?** Platform name suggestion: **"NexusHub"** or **"CrossForge"** — do you have a preference or your own name?

## Verification Plan

### Automated Tests
- Open in browser and navigate through all routes
- Test profile creation → matching → workspace flow end-to-end
- Verify localStorage persistence across page reloads

### Manual Verification
- Visual inspection of all 6 sections for design quality
- Test responsive layout on different viewport sizes
- Verify pitch deck presentation mode works with keyboard navigation
