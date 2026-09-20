# Technical Architecture

## Architecture decision

Meridian House uses a Vite + React + TypeScript frontend with Three.js for the immersive city layer.

The architecture is:

content/data -> React UI -> interaction state -> Three.js visual layer -> Vite build -> Netlify CDN

The visual layer is subordinate to the semantic document. If WebGL fails, the core content and navigation must still work.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | Safer refactors, explicit contracts, better debugging and editor tooling |
| UI | React 19 | Component boundaries and predictable UI state |
| Build | Vite 7 | Fast local development and deterministic production builds |
| 3D | Three.js 0.180 | Direct control over the lightweight procedural city layer |
| Styling | CSS | No unnecessary styling abstraction; design tokens remain inspectable |
| Hosting | Netlify | Git-based deployment, previews and CDN delivery |
| Source control | GitHub | Reviewable history, rollback and collaboration |
| Content (prototype) | Typed local data modules | Keeps fictional content separate from rendering logic |
| Content (production target) | Structured CMS/API | Allows controlled client editing without coupling content to layout |

## Repository boundaries

- src/data.ts - typed content/configuration only.
- src/App.tsx - page composition and interaction state.
- src/main.tsx - application entry point.
- src/styles.css - presentation layer.
- vite.config.ts - build tooling.
- netlify.toml - deployment contract.
- docs/ - decisions, research, architecture, QA and handoff evidence.

## Debugging and rollback model

1. Every meaningful change is committed to Git.
2. Architecture changes happen on a named branch before merge.
3. TypeScript catches interface and refactor errors before deployment.
4. npm run typecheck validates the type graph.
5. npm run build validates the production bundle.
6. npm run check runs both.
7. Netlify production deployment is tied to the production branch.
8. Deploy previews should be used for review before production changes.
9. A bad release can be reverted at Git level and redeployed through the same pipeline.

## Architectural rules

- Keep content/configuration separate from UI rendering.
- Never make WebGL a dependency for essential content.
- Clean up event listeners, animation frames, Three.js geometries and materials on unmount.
- Pin runtime and build dependencies.
- New dependencies require an explicit decision-log entry.
- Do not introduce a database, authentication layer, global state library or design-system package until a real requirement exists.

## Production evolution

When the content model is proven, introduce a CMS/API behind the same typed content contracts. Move project dossiers, field notes and institutional profiles into structured records without coupling content to layout.
