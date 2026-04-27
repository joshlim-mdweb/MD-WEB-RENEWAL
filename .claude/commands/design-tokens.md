Extract design tokens from the Figma file or screenshot provided.

Steps:

1. If a Figma URL is given, fetch the node data via Figma API
2. If a screenshot is given, analyze colors, typography, and spacing visually
3. If CSS values are given, parse them directly

Output:

- Tailwind CSS v4 config additions (colors, fonts, spacing, border-radius, shadows)
- CSS custom properties (`--color-*`, `--font-*`, `--spacing-*`)
- Brief summary of the design language (tone, style)

Apply directly to `src/app/globals.css` and `tailwind.config.ts` if they exist.
