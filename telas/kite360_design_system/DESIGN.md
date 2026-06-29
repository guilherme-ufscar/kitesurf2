---
name: KITE360º Design System
colors:
  surface: '#f9f9fe'
  surface-dim: '#dad9de'
  surface-bright: '#f9f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf2'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e7'
  on-surface: '#1a1c1f'
  on-surface-variant: '#43474f'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#566067'
  on-secondary: '#ffffff'
  secondary-container: '#dae4ed'
  on-secondary-container: '#5c666d'
  tertiary: '#381300'
  on-tertiary: '#ffffff'
  tertiary-container: '#592300'
  on-tertiary-container: '#d8885c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#dae4ed'
  secondary-fixed-dim: '#bec8d0'
  on-secondary-fixed: '#131d23'
  on-secondary-fixed-variant: '#3e484f'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#723610'
  background: '#f9f9fe'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e7'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style
The design system is engineered for a premium water sports marketplace, prioritizing high information density and professional utility. It targets a niche audience of kitesurfers and wingfoilers who value technical precision and equipment reliability. 

The aesthetic is **Modern Minimalist**, characterized by an "Oceanic Professional" vibe. It leverages a clean, high-contrast light theme to ensure that product photography remains the primary focal point. The emotional response is one of trust, clarity, and performance—mirroring the feeling of high-end sporting gear. The UI avoids decorative flourishes (no gradients or glassmorphism) in favor of functional clarity and a structured dashboard feel.

## Colors
The palette is rooted in the maritime environment but executed with a corporate, premium finish.

- **Primary (Deep Navy):** Used for primary calls to action, navigation headers, and critical interactive states. It provides a grounded, authoritative feel.
- **Secondary (Soft Blue):** Used for subtle accents, hover states on light surfaces, and category badges. It softens the high-contrast navy.
- **Neutral / Background:** Pure White (#FFFFFF) is the primary canvas for content, while Off-white (#F7F8FA) is used for section containers and dashboard backgrounds to provide subtle separation without using heavy borders.
- **Status:** Standard semantic colors (Success Green, Error Red) should be desaturated to fit the professional tone.

## Typography
This design system utilizes **Hanken Grotesk** across all levels to maintain a sharp, contemporary, and technical appearance. 

- **Hierarchy:** Strong contrast between bold headlines and clean, readable body text is essential for the marketplace dashboard. 
- **Price Display:** Prices are treated with specific weight (700) to ensure they are immediately scannable in product grids.
- **Localization:** All type scales support Brazilian Portuguese characters and maintain legibility at small sizes for technical specifications.
- **Uppercase Labels:** Used for categories and metadata to create a distinct visual layer above standard body text.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for desktop (12 columns) to maintain a controlled, high-density dashboard feel, transitioning to a fluid single-column layout for mobile.

- **Grid:** 12-column system with 24px gutters. Product listings should span 3 columns (4 items per row) on desktop, and 6 columns (2 items per row) on tablets.
- **Density:** Information density is high. Padding inside cards and list items is kept tight (16px) to maximize the amount of gear visible on a single screen.
- **Rhythm:** Use an 8px base grid for all internal component spacing to ensure mathematical consistency.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Fine Outlines** rather than heavy shadows, keeping the UI airy and professional.

- **Surfaces:** The primary background is White (#FFFFFF). Secondary content areas (sidebars, filters) use Off-white (#F7F8FA).
- **Outlines:** Use 1px solid borders in Light Grey (#E0E0E0) to define card boundaries and input fields.
- **Shadows:** Use a single "Soft Lift" shadow for floating elements (modals, dropdowns): `0px 4px 12px rgba(0, 0, 0, 0.05)`. Avoid shadows on standard cards unless they are in a hovered state.

## Shapes
The design system uses a **Soft (0.25rem)** roundedness level to balance the technical nature of the brand with a modern, approachable marketplace feel.

- **Components:** Buttons and input fields use the base 4px radius.
- **Cards:** Product cards and dashboard containers use the `rounded-lg` (8px) token to provide a clear but subtle visual container.
- **Images:** Equipment photography should always follow the container's corner radius for a cohesive, "built-in" look.

## Components
Consistent component styling is vital for the dashboard's professional utility.

- **Buttons:** 
    - *Primary:* Deep Navy background, White text, no border.
    - *Secondary:* Soft Blue background, Deep Navy text.
    - *Ghost:* No background, Light Grey border, Deep Navy text.
- **Input Fields:** 1px Light Grey border, White background. On focus, the border changes to Deep Navy. Labels are always positioned above the field in `label-md` style.
- **Product Cards:** Minimalist white containers with a fine grey border. The price is placed at the bottom left, with a "Condition" tag (New/Used) in the top right.
- **Chips/Badges:** Small, 4px rounded tags using Soft Blue backgrounds for categories (e.g., "Kitesurf", "Wingfoil").
- **Lists:** Used in the dashboard for "Latest Inquiries" or "Sales History." Use 1px bottom borders for separation with high horizontal padding (24px).
- **Checkboxes & Radios:** Sharp, technical appearance using the Deep Navy primary color for the "checked" state. 
- **Imagery Containers:** All equipment photos must have a `1:1` or `4:3` aspect ratio to maintain grid alignment, featuring clean professional photography against natural outdoor backdrops.