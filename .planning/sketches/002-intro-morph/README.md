---
sketch: 002
name: intro-morph
question: "Does the cinematic intro → chat-hero morph feel seamless rather than like two separate moments?"
winner: "B"
tags: [intro, motion, orb, transition]
---

# Sketch 002: Intro → chat morph

## Design Question
Your existing `IntroOverlay` draws hexagons → splits a glowing curtain → flies the logo to the
header. Can that same sequence **hand off into the AI chat** — the orb materializing where the
mark was — so the opening and the hero feel like one motion?

## How to View
open .planning/sketches/002-intro-morph/index.html

Press **▶ Replay intro** (bottom) to re-run. Switch variants up top. Orb toggle (top-right)
flips mesh ↔ CSS. Under `prefers-reduced-motion` it jumps straight to the end-state (no animation).

## Variants
- **A: Orb materialiseert** — curtain splits, hexagon mark fades, the iridescent orb blooms in its place, chat fades up. Cleanest read.
- **B: Hexagon wórdt orb** — the hexagon mark scales/blurs and *becomes* the orb (continuous transform). Most "magical", riskier.
- **C: Logo vliegt + orb bloeit** — keeps your current logo→header flight, and the orb blooms in parallel where the mark was. Most faithful to today's intro.

## What to Look For
- Does it feel like ONE continuous moment, or two glued together?
- Timing: curtain split (~1.5s) → orb bloom (~1.7s) → chat up (~2.3s). Too slow? Too fast?
- Variant B's "becomes" morph — does it sell, or look like a glitch?
- Does the seam flash + aurora set the futuristic tone before the orb even appears?
