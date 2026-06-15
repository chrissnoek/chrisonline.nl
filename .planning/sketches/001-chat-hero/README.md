---
sketch: 001
name: chat-hero
question: "Does the AI-chat hero layout feel right, and which orb style wins (CSS vs Paper Shaders mesh)?"
winner: null
tags: [hero, layout, orb, chat]
---

# Sketch 001: Chat hero + orb

## Design Question
Does an AI-chat-first hero feel right as the new landing identity, and which **orb**
treatment wins — the lightweight CSS conic-gradient orb, or the real `@paper-design/shaders`
mesh-gradient (loaded via esm.sh CDN)?

## How to View
open .planning/sketches/001-chat-hero/index.html

Use the **top-right toggle** to flip every variant's orb between *Paper Shaders (mesh)* and
*CSS-gradient*. If the CDN is blocked, it auto-falls back to the CSS orb.

## Variants
- **A: Orb centraal** — orb dead-center above greeting → prompt → chips. Closest to the reference video.
- **B: Orb als halo** — a large soft orb sits *behind* the prompt as an ambient halo; text floats over it.
- **C: Asymmetrisch** — orb left, greeting + prompt + chips right. More "product", less "altar".

## What to Look For
- Which orb reads as *premium* vs *CSS-demo* at hero size.
- Does the greeting copy ("Hoi, ik ben Chris's AI" / "Waarmee kan ik je helpen?") land?
- Do the generic capability chips feel inviting and clickable?
- Glass prompt field: focus ring + bloom on click into the input.
- Aurora + orb glow together — too much, or right?
