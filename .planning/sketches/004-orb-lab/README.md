---
sketch: 004
name: orb-lab
question: "What orb params (colors, distortion, swirl, speed, size, opacity, blur) make the halo orb feel premium AND keep text readable — and does the hexagon→orb morph land cleanly?"
winner: null
tags: [orb, tuning, motion, paper-shaders]
---

# Sketch 004: Orb tuning lab

## Design Question
Dial in the **halo orb** (001B) against the real hero composition — orb *behind* the greeting +
prompt + chips — and confirm the **hexagon→orb morph** (002B) lands on the tuned halo
position/size. Output a copy-pasteable config for the real build.

## How to View
open .planning/sketches/004-orb-lab/index.html

- **Engine** (top): Paper mesh-gradient vs CSS-orb. Falls back to CSS if the CDN is blocked.
- **Controls panel** (right, toggle with the `controls ⇄` button): live sliders for
  colors ×5, distortion, swirl, speed, scale, grain, plus halo size/opacity/blur.
- **Presets:** Kalm · Levendig · Strak merk · Dromerig — starting points to nudge from.
- **Morph-check:** "▶ Hexagon → orb" plays the 002B morph onto the current halo; "Toon
  hexagon-eindpunt" overlays where the mark lands.
- **Export:** copy the JSON config — this becomes the orb component's props in the real build.

## What to Look For
- Does the mesh orb read premium at large size + low opacity behind text? Is the text still readable?
- Which preset is closest? Then fine-tune.
- Morph: does the hexagon convincingly *become* the orb at your chosen size/center?
- Compare mesh vs CSS at the SAME settings — is the mesh worth the WebGL context, or is CSS close enough?

## Output
The copied JSON config (colors + distortion/swirl/speed/scale/grain + halo size/opacity/blur)
is the spec handed to the real orb component in Phase 3 of the build.
