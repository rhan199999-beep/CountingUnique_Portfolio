# Design System MASTER - Counting Unique Portfolio

*Generated: October 2026*
*Project: Counting Unique Portfolio - YouTube Creator Portfolio*
*Stack: Next.js 16 + Tailwind CSS*

## 🎯 Purpose

Single source of truth for all design tokens, component specifications, and slide generation patterns for the Counting Unique portfolio website.

---

## 📋 Three-Layer Token Architecture

### Layer 1: Primitive Tokens (Raw Values)

```json
{
  "color-ink": "#0f0f0f",
  "color-paper": "#ffffff",
  "color-mint": "#c6f5d5",
  "color-accent": "#ff6b9d",
  "color-sky": "#62c3ff",
  "color-muted": "#6b7280",
  "font-display": "Bricolage Grotesque, system-ui, sans-serif",
  "font-body": "system-ui, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  "spacing-4": "1rem",
  "spacing-6": "1.5rem",
  "shadow-sm": "0 1px 2px 0 #0f0f0f10",
  "shadow-md": "0 4px 6px -1px #0f0f0f10, 0 2px 4px -1px #0f0f0f5"
}
```

**Usage:** Import directly into CSS, use as raw values in design tools

### Layer 2: Semantic Tokens (Purpose Aliases)

```json
{
  "color-background": "var(--color-mint)",
  "color-text-primary": "var(--color-ink)",
  "color-primary": "var(--color-accent)",
  "color-card": "var(--color-mint)",
  "color-focus": "var(--color-accent)",
  "typography-base-font-size": "16",
  "typography-base-line-height": "1.5"
}
```

**Usage:** Reference in CSS `var()` functions; enables theme switching

### Layer 3: Component Tokens (Component-Specific)

```json
{
  "button": {
    "bg": "var(--color-primary)",
    "bg-hover": "color-mix(in srgb, var(--color-primary), black 10%)",
    "text": "var(--color-paper)",
    "border-radius": "0.5rem",
    "padding": "var(--spacing-3) var(--spacing-4)"
  },
  "card": {
    "bg": "var(--color-card)",
    "border": "1px solid var(--color-card-border)",
    "border-radius": "0.75rem",
    "padding": "var(--spacing-6)",
    "shadow": "var(--shadow-sm)"
  },
  "input": {
    "border": "1px solid var(--color-border-subtle)",
    "border-radius": "0.375rem",
    "padding": "var(--spacing-3)"
  }
}
```

**Usage:** Direct component styling; enables per-component customization

---

## 🎨 Color System

### Color Palette Tokens

| Token | Value | Description | Usage |
|-------|-------|-------------|-------|
| `--color-ink` | `#0f0f0f` | Primary text, borders | Body text, headings, borders |
| `--color-paper` | `#ffffff` | Backgrounds, cards | White backgrounds |
| `--color-mint` | `#c6f5d5` | Primary background | Hero, brand wall, sections |
| `--color-accent` | `#ff6b9d` | CTA, highlights | Buttons, links, active states |
| `--color-sky` | `#62c3ff` | Secondary accent | Markers, secondary highlights |
| `--color-muted` | `#6b7280` | Secondary text | Disabled text, meta info |
| `--color-error` | `#ef4444` | Error states | Error messages, warnings |

### Color Utilities

```css
/* Color mixing for shades */
color-mix(in srgb, var(--color-accent), black 10%);
/* Creates a 10% darker shade */

/* CSS var usage */
.button {
  background: var(--color-primary);
  color: var(--color-paper);
}

/* State variations */
.button:hover {
  background: color-mix(in srgb, var(--color-primary), black 10%);
}
```

---

## 🔤 Typography System

### Type Scales

| Size | Keyword | CSS | Usage |
|------|---------|-----|-------|
| `0.75rem` | `xs` | `font-size: 0.75rem` | Captions, small text |
| `0.875rem` | `sm` | `font-size: 0.875rem` | Meta info, secondary |
| `1rem` | `base` | `font-size: 1rem` | Body text (16px) |
| `1.125rem` | `lg` | `font-size: 1.125rem` | Subheadings |
| `1.25rem` | `xl` | `font-size: 1.25rem` | Large text |
| `1.5rem` | `2xl` | `font-size: 1.5rem` | Section headings |
| `1.875rem` | `3xl` | `font-size: 1.875rem` | Main headings |
| `2.25rem` | `4xl` | `font-size: 2.25rem` | Hero headline |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--typography-base-line-height` | `1.5` | Body text |
| `--typography-heading-line-height` | `1.1` | Headings |
| `--typography-caption-line-height` | `1.3` | Captions, meta |

### Font Families

```css
--font-display: "Bricolage Grotesque", "ui-sans-serif", system-ui, sans-serif;
--font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "SF Mono", "Fira Code", "Droid Sans Mono", monospace;
```

**Usage:**
- Headings, buttons, interactive elements: `var(--font-display)`
- Body text, paragraphs: `var(--font-body)`
- Code, numbers: `var(--font-mono)`

---

## 📏 Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--spacing-0` | `0` | `0px` | No spacing |
| `--spacing-1` | `0.25rem` | `4px` | Tight spacing |
| `--spacing-2` | `0.5rem` | `8px` | Standard spacing |
| `--spacing-3` | `0.75rem` | `12px` | Card padding |
| `--spacing-4` | `1rem` | `16px` | Button padding, gap |
| `--spacing-6` | `1.5rem` | `24px` | Section gap, card header |
| `--spacing-8` | `2rem` | `32px` | Large section gap |
| `--spacing-10` | `2.5rem` | `40px` | Section internal padding |
| `--spacing-12` | `3rem` | `48px` | Section max-width padding |

### Spacing Application

```css
/* Section padding */
.section {
  padding: var(--spacing-6) var(--spacing-10);
}

/• Gap between items */
.grid {
  gap: var(--spacing-4);
}

/* Card internal padding */
.card {
  padding: var(--spacing-6);
}

/* Button internal spacing */
.button {
  padding: var(--spacing-3) var(--spacing-4);
}
```

---

## 📐 Breakpoints

| Breakpoint | Label | Min-Width | Usage |
|------------|-------|-----------|-------|
| `sm` | Small | `640px` | Mobile phones |
| `md` | Medium | `768px` | iPads, small tablets |
| `lg` | Large | `1024px` | Desktop laptops |
| `xl` | Extra Large | `1280px` | Large desktops |
| `2xl` | Double Extra Large | `1536px` | Extra large screens |

### Breakpoint Usage

```css
/* Mobile-first approach */
.container {
  max-width: 100%;
  padding: var(--spacing-4);
}

@media (min-width: var(--breakpoint-md)) {
  .container {
    max-width: 72rem; /* 1152px */
  }
}

@media (min-width: var(--breakpoint-lg)) {
  .container {
    max-width: 80rem; /* 1280px */
  }
}
```

---

## 🧩 Component Specifications

### Button Component

| Property | Default | Hover | Active | Disabled |
|----------|---------|-------|--------|----------|
| `background` | `var(--color-primary)` | `color-mix(in srgb, var(--color-primary), black 10%)` | `color-mix(in srgb, var(--color-primary), black 20%)` | `var(--color-muted)` |
| `color` | `var(--color-paper)` | `var(--color-ink)` | `var(--color-ink)` | `var(--color-muted)/50` |
| `border` | `none` | `none` | `none` | `1px solid var(--color-border-subtle)` |
| `border-radius` | `var(--spacing-2)` | `same` | `same` | `same` |
| `padding-horizontal` | `var(--spacing-4)` | `same` | `same` | `same` |
| `padding-vertical` | `var(--spacing-3)` | `same` | `same` | `same` |
| `font-family` | `var(--font-display)` | `same` | `same` | `same` |
| `font-weight` | `600` | `same` | `same` | `same` |
| `font-size` | `0.875rem` | `same` | `same` | `same` |
| `transition` | `background-color 0.2s ease` | `same` | `same` | `same` |
| `cursor` | `pointer` | `pointer` | `pointer` | `not-allowed` |

### Card Component

| Property | Default | Hover | Active | Disabled |
|----------|---------|-------|--------|----------|
| `background` | `var(--color-card)` | `same` | `same` | `var(--color-muted)` |
| `border` | `1px solid var(--color-card-border)` | `same` | `same` | `var(--color-border-subtle)` |
| `border-radius` | `var(--spacing-3)` | `same` | `same` | `same` |
| `padding` | `var(--spacing-6)` | `same` | `same` | `same` |
| `shadow` | `var(--shadow-sm)` | `var(--shadow-md)` | `same` | `var(--shadow-xs)` |
| `transform` | `none` | `translateY(-2px)` | `translateY(-1px)` | `none` |
| `transition` | `box-shadow 0.2s ease, transform 0.1s ease` | `same` | `same` | `same` |

### Avatar Component

| Property | Default |
|----------|---------|
| `border` | `2px solid var(--color-paper)` |
| `border-radius` | `full` (100%) |
| `width` | `inherit` (context-dependent) |
| `height` | `inherit` (context-dependent) |

### Input Component

| Property | Default | Focus |
|----------|---------|-------|
| `border` | `1px solid var(--color-border-subtle)` | `var(--color-primary)` |
| `border-radius` | `var(--spacing-2)` | `same` |
| `padding` | `var(--spacing-3)` | `same` |
| `font-family` | `var(--font-body)` | `same` |
| `transition` | `border-color 0.2s ease` | `same` |
| `outline` | `none` | `2px solid var(--color-primary)` |
| `outline-offset` | `none` | `2px` |

---

## 📊 Chart.js Integration

### Chart Color Usage

```javascript
// Use design tokens for chart colors
const chartConfig = {
  type: 'line',
  data: {
    labels: ['Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: [5, 12, 28, 45],
      borderColor: 'var(--color-primary)',    /* Primary accent */
      backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)', /* With opacity */
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    backgroundColor: 'var(--color-paper)',
    color: 'var(--color-ink)',
    plugins: {
      legend: {
        labels: {
          color: 'var(--color-ink)'
        }
      }
    }
  }
};
```

### Required Chart.js Setup

```html
<!-- Must import in all slides/pages -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

<canvas id="revenueChart"></canvas>

<script>
  new Chart(document.getElementById('revenueChart'), config);
</script>
```

### Chart Compliance Rules

- ✅ Must use `var()` CSS variables for colors
- ✅ Must use Chart.js (not CSS-only bars)
- ✅ Must import `assets/design-tokens.css`
- ✅ Must center-align content
- ✅ Must include navigation (arrows, progress bar)
- ✅ Focus on persuasion/conversion

---

## 📄 Slide Generation Requirements

### ALL Slides MUST Include:

1. **Design Token Import:**
   ```html
   <link rel="stylesheet" href="assets/design-tokens.css">
   ```

2. **CSS Variable Usage:**
   ```css
   background: var(--slide-bg);
   color: var(--color-primary);
   font-family: var(--typography-font-heading);
   ```

3. **Chart.js Usage** (if applicable):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
   ```

4. **Navigation:**
   - Keyboard arrows
   - Click-to-advance
   - Progress bar indicator

5. **Content Structure:**
   - Center-aligned main content
   - Clear hierarchy (H1 → H2 → body)
   - Compelling visuals over text

6. **Token Compliance:**
   - ❌ **NO hardcoded hex colors** (e.g., `#0D0D0D`, `#FF6B6B`)
   - ✅ **USE tokens only** (e.g., `var(--slide-bg)`, `var(--color-primary)`)
   - ✅ **USE CSS variables** for fonts, spacing, colors
   - ✅ **Semantic layer enables** light/dark theme switching

### Token Compliance Examples

**Correct:**
```css
background: var(--slide-bg);
color: var(--color-primary);
font-family: var(--typography-font-heading);
```

**Incorrect (VIOLATION):**
```css
background: #0D0D0D;
color: #FF6B6B;
font-family: 'Space Grotesk';
```

---

## 🔄 Design System Workflow

### 1. Create/Update Tokens

```json
// Edit assets/design-tokens.json
// Run: node scripts/generate-tokens.cjs --config assets/design-tokens.json -o assets/design-tokens.css
```

### 2. Persist Across Sessions

```bash
# Persist design system for this project
python scripts/search-slides.py "project name" --design-system --persist --output-dir "."
```

**Creates:**
- `design-system/<project-slug>/MASTER.md` — Global Source of Truth
- `design-system/<project-slug>/pages/` — Page-specific overrides

### 3. Retrieve Design System

When building a specific page:

1. Read `design-system/<project-slug>/MASTER.md`
2. Check if `design-system/<project-slug>/pages/<page-name>.md` exists
3. If yes: page rules override Master
4. If no: use Master rules exclusively

### 4. Generate Slides

```bash
# Generate a 10-slide investor pitch
/slides:create "10-slide investor pitch for Counting Unique portfolio"
```

---

## 📦 Files in Repository

| File/Path | Purpose |
|-----------|---------|
| `docs/brand-guidelines.md` | Brand voice, visual identity, asset management |
| `assets/design-tokens.json` | Primitive → semantic → component tokens |
| `assets/design-tokens.css` | CSS-ready token definitions |
| `src/app/globals.css` | Base styles with `var()` references |
| `src/components/Partners.tsx` | Brand wall using CSS tokens |
| `src/components/Hero.tsx` | Hero section using CSS tokens |
| `src/components/VideoTabs.tsx` | Video cards using CSS tokens |
| `src/lib/youtube.ts` | YouTube data integration |
| `tests/e2e/responsive.spec.ts` | 14 E2E tests for all breakpoints |

---

## 🎯 Quick Reference: Most Used Tokens

| Situation | Token | CSS Example |
|-----------|-------|-------------|
| Body text color | `--color-ink` | `color: var(--color-ink);` |
| Primary background | `--color-mint` | `background: var(--color-mint);` |
| CTA button | `--color-accent` | `background: var(--color-accent);` |
| Button text | `--color-paper` | `color: var(--color-paper);` |
| Base font size | `16px` | `font-size: 16px;` (or `var(--typography-base-font-size)`) |
| Base line height | `1.5` | `line-height: var(--typography-base-line-height);` |
| Section gap | `var(--spacing-6)` | `gap: var(--spacing-6);` |
| Mobile breakpoint | `768px` | `@media (min-width: 768px)` |

---

*This MASTER.md is the source of truth for all design decisions in the Counting Unique portfolio. Update tokens in `assets/design-tokens.json` and regenerate `assets/design-tokens.css` when making visual changes. All components should reference tokens via `var()` functions, not hardcoded values.*

*Last generated: October 2026*
*Skill: design-system v2.0*