# Meridian House

Institutional authority-site prototype for Meridian House, a fictional multidisciplinary practice combining architecture, research, urban intelligence, technology/modelling, strategic planning and advisory.

## Current architecture

**Vite + React + TypeScript + Three.js + CSS + Netlify + GitHub**

The project is deliberately structured so that content, interface state, visual rendering, build tooling and deployment configuration have clear boundaries.

### Development

- Node.js 22
- Vite development server
- TypeScript strict mode
- React component architecture
- Three.js isolated to the immersive CityScene layer

### Quality gates

`npm run typecheck` validates the TypeScript graph.

`npm run build` validates the production bundle.

`npm run check` runs both.

GitHub Actions repeats the typecheck and production build on pushes and pull requests.

### Deployment

Netlify builds the production branch with:

`npm run build`

and publishes:

`dist`

Netlify's Git workflow is the intended production path so every production release has a corresponding Git commit.

## Method

**Observe → Map → Understand → Question → Design → Test → Build / Advise → Observe Again**

## Documentation

The build is documented as a reusable TWM case-study system:

**Client problem → insight → hypothesis → decision → architecture → implementation → evidence → learning**

Start with the [documentation reader](./docs/README.md).

### Repository map

- `src/` — application code
- `src/data.ts` — typed content contracts and prototype content
- `src/App.tsx` — page composition and interaction state
- `src/styles.css` — visual system
- `docs/00-client` — brief and requirements
- `docs/01-world-model` — institutional logic and fictional-content policy
- `docs/02-research` — research outputs and visitor questions
- `docs/03-decisions` — decision log and ADRs
- `docs/04-information-architecture` — sitemap, content model, journey
- `docs/05-design` — visual, interaction and 3D direction
- `docs/06-architecture` — frontend, content, performance and accessibility
- `docs/07-build-journal` — chronological build evidence
- `docs/08-security` — security model and deployment controls
- `docs/09-qa` — release checklists and testing
- `docs/10-handoff` — deployment, maintenance and content guidance

## Content status

All projects, people and institutional claims in this prototype are fictional internal content and must be approved or verified before public representation.
