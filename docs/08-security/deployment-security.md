# Deployment Security

## Netlify
Deploy only from the intended branch. Keep deploy settings documented. Never store API keys in source. Use environment variables for future server-side secrets. Review logs for accidental secret exposure. Restrict DNS/domain access. Enable HTTPS. Review redirects and headers after deployment.

## Repository
Protect main where practical. Review deployment configuration changes. Keep dependencies maintained. Never commit credentials, tokens, private keys, or production secrets.
