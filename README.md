# Infinite Campfire

Infinite Campfire is a static GitHub Pages hub assembled from the approved screen-print artwork. It uses plain HTML and CSS, has no build step, and keeps all local asset references relative so the site works beneath a GitHub Pages repository path.

## Destinations

- Synonym Forest — <https://jasonatkinson123-sketch.github.io/synonym-forest/>
- Owl Attack — <https://jasonatkinson123-sketch.github.io/owl-attack/>
- Prépositions françaises — <https://jasonatkinson123-sketch.github.io/french-prepositions/>
- Derby Character Cash — <https://derby-character-cash.jjason123.chatgpt.site/>
- Jazz Ear Trainer — <https://jasonatkinson123-sketch.github.io/jazz-ear-trainer/>

## Artwork manifest

| Asset | Purpose |
| --- | --- |
| `assets/campfire-desktop-master.png` | Approved flattened 16:9 desktop scene with the blank signpost, landscape, and campfire. |
| `assets/bird-static.png` | Transparent approved bird extraction, positioned independently of the scene. |
| `assets/sign-synonym.png` | Approved blank Synonym Forest plank crop for the mobile composition. |
| `assets/sign-owl.png` | Approved blank Owl Attack plank crop for the mobile composition. |
| `assets/sign-french.png` | Approved blank Prépositions françaises plank crop for the mobile composition. |
| `assets/sign-derby.png` | Approved blank Derby Character Cash plank crop for the mobile composition. |
| `assets/sign-jazz.png` | Approved blank Jazz Ear Trainer plank crop for the mobile composition. |
| `assets/mobile-post-upper.png` | Approved post crop repeated behind the mobile planks. |
| `assets/mobile-campfire.png` | Transparent approved campfire and rock crop for mobile. |
| `assets/mobile-forest-left.png` | Transparent left-side landscape crop for mobile framing. |
| `assets/mobile-forest-right.png` | Transparent right-side landscape crop for mobile framing. |
| `assets/mobile-ground-scene.png` | Approved ground texture used behind the mobile composition. |

All production artwork above was derived from the approved poster and desktop master without redrawing it. The original source artwork is intentionally not modified by the page.

## Responsive composition

Desktop uses one 16:9 coordinate-controlled stage. The title, bird, five live labels, and five full-plank anchors are registered to the same stage as `campfire-desktop-master.png`.

At widths up to 700px, the same five anchors become a vertical portrait composition. Each uses its approved plank crop, while the approved post, bird, campfire, forest, and ground crops provide the surrounding scene. Destination text remains live HTML in both layouts.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. To test repository-subdirectory hosting, serve the parent directory and open `/infinite-campfire/` (or the worktree directory name).

## Future animated bird

`.bird-layer` contains `#bird-model-slot`, and both use `pointer-events: none` so the bird can never cover a sign interaction. The current transparent `bird-static.png` is the `.bird-static` image inside that slot.

When a future transparent `bird.glb` renderer is initialized, mount its canvas inside `#bird-model-slot` and remove or hide `.bird-static` at the same time. Do not leave the static image visible behind the renderer, or two birds will appear. WebGL and animation are intentionally not included in this version.
