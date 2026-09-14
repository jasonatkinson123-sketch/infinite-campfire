# Infinite Campfire

Static GitHub Pages hub. Publish `index.html` at the repository root (or copy its contents into the existing root `index.html`). It contains no build step or external dependencies.

## Destination links

- Synonym Forest: `https://jasonatkinson123-sketch.github.io/synonym-forest/`
- Owl Attack: `https://jasonatkinson123-sketch.github.io/owl-attack/`
- Prépositions françaises: `https://jasonatkinson123-sketch.github.io/french-prepositions/`
- Derby Character Cash: `https://derby-character-cash.jjason123.chatgpt.site/`
- Jazz Ear Trainer: `https://jasonatkinson123-sketch.github.io/jazz-ear-trainer/`

The first three links were recovered from the previous hub. Derby Character Cash points to its currently published site. The Jazz Ear Trainer path is the expected GitHub Pages destination and must be confirmed before publishing this hub if its repository slug differs.

## Future animated bird

The static bird is the inline SVG in `.bird-layer`. The empty `#bird-model-slot` is deliberately positioned over the central post and has `pointer-events: none`; use it as the mount point for a transparent canvas or a future `bird.glb` renderer. Keep the signs as normal HTML links underneath it.
