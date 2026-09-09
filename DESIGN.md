# Design System: Veritas — AI Document & Identity Verification

## 1. Visual Theme & Atmosphere

A restrained, vault-like interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is clinical yet warm — like a private bank's verification lounge. Deep charcoal surfaces anchor trust; a single muted champagne accent signals verified status. Density sits at 5 — balanced enough for complex verification flows without feeling cramped. Variance at 7 — asymmetric splits and offset grid compositions reject the "centered dashboard" default. Motion at 6 — fluid CSS transitions with spring physics, never flashy, always weighty.

The design communicates: **precision, discretion, authority**. Every pixel reinforces that this system handles sensitive identity data with the care of a Swiss vault.

## 2. Color Palette & Roles

- **Vault Black** (#0F0F12) — Primary background, Zinc-950 depth. Never use pure black
- **Surface Stone** (#1A1A1F) — Card fills, elevated containers, modal backgrounds
- **Marble White** (#F5F5F4) — Primary text, high-contrast headings on dark surfaces
- **Muted Pewter** (#A1A1AA) — Secondary text, metadata, helper labels, timestamps
- **Whisper Border** (rgba(226,232,240,0.08)) — Structural borders, 1px dividers, subtle separations
- **Champagne Gold** (#D4AF37) — Single accent for CTAs, verified badges, focus rings, active states. Saturation controlled at 65%
- **Verified Green** (#22C55E) — Status indicator only — success states, completed verifications. Never used for interactive elements
- **Alert Amber** (#F59E0B) — Warning states, pending verifications, caution indicators
- **Denial Rose** (#E11D48) — Error states, failed verifications, critical alerts

## 3. Typography Rules

- **Display:** `Outfit` — Geometric sans-serif with refined character. Track-tight at -0.02em. Weight-driven hierarchy: 600 for section heads, 700 for hero statements. Not screaming — authority through restraint
- **Body:** `Satoshi` — Modern geometric with excellent readability. Relaxed leading at 1.6. Max-width 65ch. Secondary color (#A1A1AA) for body text against dark surfaces
- **Mono:** `JetBrains Mono` — For verification codes, document IDs, timestamps, numeric data. Used in high-density verification tables
- **Scale:** Headlines via `clamp(1.75rem, 4vw, 2.75rem)`. Body minimum 1rem/16px. No text below 14px
- **Banned:** Inter, system fonts, generic serifs. Serif always banned in verification dashboards

## 4. Component Stylings

- **Buttons:** Flat, no outer glow. Tactile -1px translateY on active state with 100ms ease. Champagne Gold fill for primary actions (Verify, Submit). Ghost/outline for secondary (Cancel, Back). Minimum 44px tap target
- **Cards:** Generously rounded corners (1.5rem). Diffused shadow tinted to background hue (rgba(0,0,0,0.25)). Used for document preview containers and verification status panels. High-density tables: replace cards with border-top dividers
- **Inputs:** Label above, helper text optional below, error text in Denial Rose beneath. Focus ring in Champagne Gold (2px offset). No floating labels. Generous padding (1rem vertical)
- **Status Indicators:** Pill-shaped badges with semantic colors. Verified = Verified Green background, Marble White text. Pending = Alert Amber. Failed = Denial Rose. All with subtle inward shadow for depth
- **Document Preview:** Rounded corners (1rem), subtle border in Whisper Border color. Placeholder shows outlined document icon with Muted Pewter stroke. Loaded state shows image with Champagne Gold border on hover
- **Loaders:** Skeletal shimmer matching exact layout dimensions. Pulse animation at 2s interval. No circular spinners
- **Empty States:** Composed compositions — centered icon (outlined, Muted Pewter) with instructional text. Never just "No data"
- **Error States:** Denial Rose left-border accent on containers. Inline error text below affected inputs. Toast notifications for system errors

## 5. Layout Principles

Grid-first responsive architecture. CSS Grid over Flexbox math — never calc() percentage hacks. Max-width containment at 1280px centered. Generous internal padding (clamp(1.5rem, 4vw, 3rem)).

- **Hero Section:** Left-aligned asymmetric composition. Headline occupies left 60%, verification illustration or document preview occupies right 40%. No centered hero layouts
- **Verification Flow:** Single-column centered layout (max-width 640px) for document upload and identity forms. Focus and reduce distraction
- **Dashboard Grid:** 2-column asymmetric grid — primary verification status panel (span 2), secondary panels (span 1 each). Never 3 equal cards
- **Navigation:** Top bar with logo left, minimal nav items right. Clean, no dropdowns on primary nav
- **Full-Height Sections:** min-h-[100dvh] — never h-screen (iOS Safari catastrophic jump)

## 6. Motion & Interaction

Spring physics for all interactive elements: stiffness 100, damping 20. Premium, weighty feel. No linear easing.

- **Staggered Orchestration:** Verification steps cascade with 80ms delays. Never mount lists instantly — waterfall reveals communicate systematic processing
- **Perpetual Micro-Interactions:** Verification status pulse (subtle opacity 0.8→1→0.8 at 3s interval). Document preview float (2px translateY oscillation at 4s). Processing shimmer on pending items
- **Hardware-Accelerated:** Animate exclusively via transform and opacity. Never animate top, left, width, height
- **Transition Timing:** 200ms ease-out for hover states. 300ms spring for layout shifts. 400ms for modal entrances
- **Isolated Components:** CPU-heavy animations (document scanning effects, liveness detection) in isolated Client Components

## 7. Anti-Patterns (Banned)

- No emojis anywhere
- No Inter font
- No generic serif fonts (Times New Roman, Georgia, Garamond)
- No pure black (#000000) — use Vault Black (#0F0F12)
- No neon/outer glow shadows
- No purple/blue neon aesthetic — this is luxury, not tech startup
- No oversaturated accents — Champagne Gold at 65% saturation maximum
- No excessive gradient text on large headers
- No custom mouse cursors
- No overlapping elements — clean spatial separation always
- No 3-column equal card layouts
- No generic names ("John Doe", "Acme Corp", "Nexus Systems")
- No fake round numbers (99.99% accuracy, 50% faster)
- No AI copywriting clichés ("Elevate your verification", "Seamless identity", "Unleash AI-powered", "Next-Gen document")
- No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- No broken Unsplash links — use picsum.photos or SVG document icons
- No centered Hero sections
- No generic "trust badges" (Norton, McAfee) — use specific compliance mentions only
- No stock photos of people — use abstract document illustrations or SVG identity icons

---

**Usage with Stitch:** Copy this DESIGN.md into your Stitch project. When generating screens, reference specific sections: "Generate a document upload screen following Section 4 (Component Stylings) and Section 5 (Layout Principles) with the Vault Black palette from Section 2."
