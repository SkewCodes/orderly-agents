---
name: theme-agent
version: "1.0.0"
description: "Theme generation agent for DEX UIs. Produces design tokens, brand analysis, CSS variables, and DEX Builder–compatible themes."
division: starchild
runtime: mcp
author: Starchild AI
supportedChains: [all]
tags: [theme, design-tokens, css-variables, branding, dex-builder]
---

## Overview

The Theme Agent generates and refines visual themes for DEX frontends. It analyzes brand inputs (colors, logos, references), produces design tokens, outputs CSS variables, and ensures compatibility with the DEX Builder theme system. Use it to create consistent, on-brand trading interfaces without manual token management.

## Tools / Features

| Capability | Description |
|------------|-------------|
| **Design token generation** | Creates semantic tokens (primary, secondary, success, danger, surface, text) from minimal input |
| **Brand analysis** | Extracts colors, contrast, and mood from brand assets or reference URLs |
| **CSS variable output** | Emits `--color-*`, `--spacing-*`, `--radius-*` ready for injection |
| **DEX Builder theme compatibility** | Outputs themes in the format expected by DEX Builder (Orderly) |

## Usage

### Example Prompts

- *"Generate a dark theme with electric blue accents and high contrast for trading."*
- *"Analyze this brand URL and create a theme that matches their colors."*
- *"Create design tokens for a light DEX theme: white background, green buy, red sell."*
- *"Output CSS variables for a DEX Builder–compatible theme with custom primary color #6366f1."*
- *"Generate a theme that works for both light and dark mode with proper contrast."*

### Output Format

The agent produces themes as structured objects and/or CSS:

```css
:root {
  --color-primary: #6366f1;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-surface: #0f172a;
  --color-text: #f8fafc;
  --spacing-unit: 8px;
  --radius-sm: 4px;
  --radius-md: 8px;
}
```

## Configuration

- **DEX Builder mode**: When `dexBuilderCompatible: true`, output follows Orderly DEX Builder theme schema.
- **Token scope**: Specify `light`, `dark`, or `both` for dual-mode themes.
- **Contrast**: Optional WCAG target (AA/AAA) for accessibility-aware token generation.
