# 08 — Security

## Current posture
No authentication, secrets, database, accounts, payment handling, server-side form processing, or sensitive-data collection.

## Current headers
Netlify sets X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Referrer-Policy: strict-origin-when-cross-origin.

## Production priorities
Content Security Policy; dependency pinning/integrity; HTTPS-only deployment; controlled third-party scripts; input validation/rate limiting for future forms; protected CMS/auth boundaries; least privilege; supply-chain review; safe error handling; content backups.

The final CSP must match the actual production asset architecture.
