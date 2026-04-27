# Design System Inspired by Cursor

## 1. Visual Theme & Atmosphere

Cursor's website is a study in warm minimalism meets code-editor elegance. The entire experience is built on a warm off-white canvas (`#f2f1ed`) with dark warm-brown text (`#26251e`) -- not pure black, not neutral gray, but a deeply warm near-black with a yellowish undertone that evokes old paper, ink, and craft. This warmth permeates every surface: backgrounds lean toward cream (`#e6e5e0`, `#ebeae5`), borders dissolve into transparent warm overlays using `oklab` color space, and even the error state (`#cf2d56`) carries warmth rather than clinical red. The result feels more like a premium print publication than a tech website.

The custom CursorGothic font is the typographic signature -- a gothic sans-serif with aggressive negative letter-spacing at display sizes (-2.16px at 72px) that creates a compressed, engineered feel. As a secondary voice, the jjannon serif font (with OpenType `"cswh"` contextual swash alternates) provides literary counterpoint for body copy and editorial passages. The monospace voice comes from berkeleyMono, a refined coding font that connects the marketing site to Cursor's core identity as a code editor. This three-font system (gothic display, serif body, mono code) gives Cursor one of the most typographically rich palettes in developer tooling.

The border system is particularly distinctive -- Cursor uses `oklab()` color space for border colors, applying warm brown at various alpha levels (0.1, 0.2, 0.55) to create borders that feel organic rather than mechanical. The signature border color `oklab(0.263084 -0.00230259 0.0124794 / 0.1)` is not a simple rgba value but a perceptually uniform color that maintains visual consistency across different backgrounds.

**Key Characteristics:**
- CursorGothic with aggressive negative letter-spacing (-2.16px at 72px, -0.72px at 36px) for compressed display headings
- jjannon serif for body text with OpenType `"cswh"` (contextual swash alternates)
- berkeleyMono for code and technical labels
- Warm off-white background (`#f2f1ed`) instead of pure white -- the entire system is warm-shifted
- Primary text color `#26251e` (warm near-black with yellow undertone)
- Accent orange `#f54e00` for brand highlight and links
- oklab-space borders at various alpha levels for perceptually uniform edge treatment
- Pill-shaped elements with extreme radius (9999px, effectively full-pill)
- 8px base spacing system with fine-grained sub-8px increments (1.5px, 2px, 2.5px, 3px, 4px, 5px, 6px)

---

## 2. Color Palette & Roles

### Primary
- **Cursor Dark** (`#26251e`): Primary text, headings, dark UI surfaces.
- **Cursor Cream** (`#f2f1ed`): Page background, primary surface.
- **Cursor Light** (`#e6e5e0`): Secondary surface, button backgrounds, card fills.
- **Pure White** (`#ffffff`): Sparingly for maximum contrast elements.
- **True Black** (`#000000`): Minimal use, specific code/console contexts.

### Accent
- **Cursor Orange** (`#f54e00`): Brand accent. Primary CTAs, active links, brand moments.
- **Gold** (`#c08532`): Secondary accent, premium or highlighted contexts.

### Semantic
- **Error** (`#cf2d56`): Warm crimson-rose rather than cold red.
- **Success** (`#1f8a65`): Muted teal-green, warm-shifted.

### Surface Scale
- **Surface 100** (`#f7f7f4`): Lightest button/card surface.
- **Surface 200** (`#f2f1ed`): Primary page background.
- **Surface 300** (`#ebeae5`): Button default background.
- **Surface 400** (`#e6e5e0`): Card backgrounds, secondary surfaces.
- **Surface 500** (`#e1e0db`): Tertiary button background.

### Border Colors
- **Border Primary** (`oklab(0.263084 -0.00230259 0.0124794 / 0.1)`): Standard border. CSS fallback: `rgba(38, 37, 30, 0.1)`
- **Border Medium** (`oklab(0.263084 -0.00230259 0.0124794 / 0.2)`): Emphasized border. CSS fallback: `rgba(38, 37, 30, 0.2)`
- **Border Strong** (`rgba(38, 37, 30, 0.55)`): Strong borders, table rules.
- **Border Solid** (`#26251e`): Full-opacity dark border.

### Shadows
- **Card Shadow**: `rgba(0,0,0,0.14) 0px 28px 70px, rgba(0,0,0,0.1) 0px 14px 32px, rgba(38,37,30,0.1) 0px 0px 0px 1px`
- **Ambient Shadow**: `rgba(0,0,0,0.02) 0px 0px 16px, rgba(0,0,0,0.008) 0px 0px 8px`

---

## 3. Typography Rules

### Font Family
- **Display/Headlines**: `CursorGothic` → fallback: `system-ui, Helvetica Neue, Arial`
- **Body/Editorial**: `jjannon` → fallback: `Georgia, Cambria, Times New Roman`
- **Code/Technical**: `berkeleyMono` → fallback: `ui-monospace, SFMono-Regular, Menlo`
- **UI/System**: `system-ui` → fallback: `-apple-system, Segoe UI, Arial`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display Hero | CursorGothic | 72px | 400 | 1.10 | -2.16px |
| Section Heading | CursorGothic | 36px | 400 | 1.20 | -0.72px |
| Sub-heading | CursorGothic | 26px | 400 | 1.25 | -0.325px |
| Title Small | CursorGothic | 22px | 400 | 1.30 | -0.11px |
| Body Serif | jjannon | 19.2px | 500 | 1.50 | normal |
| Body Serif SM | jjannon | 17.28px | 400 | 1.35 | normal |
| Body Sans | CursorGothic | 16px | 400 | 1.50 | normal |
| Button Label | CursorGothic | 14px | 400 | 1.00 | normal |
| Caption | CursorGothic | 11px | 400 | 1.50 | normal |
| Mono Body | berkeleyMono | 12px | 400 | 1.67 | normal |

### Principles
- Letter-spacing scales with size: -2.16px at 72px → -0.72px at 36px → -0.325px at 26px → normal at 16px
- CursorGothic weight 400 only — size and tracking create hierarchy, not weight
- Three voices: Gothic (display/UI), serif (editorial), mono (code)

---

## 4. Component Stylings

### Buttons

**Primary (Warm Surface)**
- Background: `#ebeae5` · Text: `#26251e` · Padding: 10px 14px · Radius: 8px
- Hover: text → `#cf2d56`

**Secondary Pill**
- Background: `#e6e5e0` · Text: `rgba(38,37,30,0.6)` · Padding: 3px 8px · Radius: 9999px
- Hover: text → `#cf2d56`

**Ghost**
- Background: `rgba(38,37,30,0.06)` · Text: `rgba(38,37,30,0.55)` · Padding: 6px 12px

### Cards & Containers
- Background: `#e6e5e0` or `#f2f1ed`
- Border: `1px solid rgba(38,37,30,0.1)`
- Radius: 8px (standard) / 10px (featured)
- Shadow: Card Shadow for elevated cards

### Navigation
- Background: `#f2f1ed` (warm cream)
- Links: 14px CursorGothic / system-ui, weight 500
- Bottom border: `1px solid rgba(38,37,30,0.1)`

---

## 5. Layout Principles

### Spacing
- Base: 8px
- Fine: 1.5, 2, 2.5, 3, 4, 5, 6px (sub-8px micro-adjustments)
- Extended: 16, 24, 32, 48, 64, 96px

### Grid
- Max content width: ~1200px
- Hero: centered, top padding 80–120px
- Feature sections: 2–3 column grids

### Border Radius
- 4px: compact cards, images
- 8px: primary buttons, cards, menus
- 10px: featured cards
- 9999px: pill buttons, tags, badges

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Page background, text blocks |
| Border Ring | `rgba(38,37,30,0.1) 0px 0px 0px 1px` | Standard card border |
| Ambient | `rgba(0,0,0,0.02) 0px 0px 16px` | Floating elements |
| Elevated Card | Card Shadow | Modals, popovers, elevated cards |

---

## 7. Interaction & Motion

- Hover: button/link text → `#cf2d56` (warm crimson — signature interaction)
- Cards: Ambient → Elevated shadow on hover
- Focus: `rgba(0,0,0,0.1) 0px 4px 12px` (no cold blue focus rings)
- Color transition: 150ms ease · Shadow transition: 200ms ease

---

## 8. Responsive Behavior

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | <600px | Single column, reduced padding |
| Tablet | 600–900px | 2-column grids |
| Desktop | >1279px | Full layout, max content width |

- Hero: 72px → 36px → 26px (proportional letter-spacing maintained)
- Feature cards: 3-col → 2-col → single
- Section spacing: 80px → 48px → 32px on mobile

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Page background:    #f2f1ed
Primary text:       #26251e
Secondary text:     rgba(38, 37, 30, 0.55)
CTA bg:             #ebeae5
Accent:             #f54e00
Error/hover:        #cf2d56
Success:            #1f8a65
Border:             rgba(38, 37, 30, 0.1)
```

### Iteration Rules
1. Always warm — `#f2f1ed` bg, `#26251e` text. Never pure white/black for primary surfaces
2. Letter-spacing scales with CursorGothic size (see Typography table)
3. Three fonts, three voices: CursorGothic · jjannon · berkeleyMono
4. Pill (9999px) for tags/filters; 8px for buttons and cards
5. Hover → `#cf2d56` text shift is the signature interaction
6. Large blur shadows (28px, 70px) for diffused atmospheric depth
7. Sub-8px spacing for micro-alignment (1.5, 2, 3, 4, 5, 6px)
