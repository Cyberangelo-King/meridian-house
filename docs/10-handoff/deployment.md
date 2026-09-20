# Deployment

## Current target
Netlify static deployment. netlify.toml publishes the repository root.

## Release sequence
1. Validate content.
2. Run QA.
3. Verify security headers.
4. Build/deploy.
5. Open the deployed site.
6. Test critical flows.
7. Record deployment evidence in the build journal.

A GitHub push does not itself prove that Netlify is configured or that deployment succeeded. Record the actual deployment URL and verification evidence when available.
