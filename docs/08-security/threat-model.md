# Threat Model

## Assets
Public-site integrity, content integrity, future CMS credentials, visitor conversation data, deployment credentials, third-party dependency trust, DNS/domain configuration.

## Threats and controls
- Content tampering → protected branches and least privilege.
- Supply-chain compromise → pin/minimise dependencies and review updates.
- Clickjacking → X-Frame-Options and later CSP frame-ancestors.
- MIME confusion → nosniff.
- Referrer leakage → strict-origin-when-cross-origin.
- Form abuse → validation, rate limiting, sanitisation, minimal data collection.
- CMS compromise → separate privileged editing from public rendering; never expose privileged credentials in browser code.
