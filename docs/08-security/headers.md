# Security Headers

## Current
Configured in netlify.toml:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Next
Add a tested Content-Security-Policy after the production dependency graph is fixed. The current CDN and inline-script prototype make a strict CSP less clean.

Consider Permissions-Policy, Strict-Transport-Security after HTTPS-only operation is confirmed, and CSP frame-ancestors.
