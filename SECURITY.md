# Security Policy

## Supported release

| Release | Supported |
| --- | --- |
| 001 build1 | Yes |

## Security design

- No API keys, tokens, private keys, passwords, or hard-coded credentials.
- No `.env` files or secret configuration.
- No third-party libraries or remote executable code.
- No host permissions.
- No content scripts and no automatic execution on websites.
- Manifest V3 extension-page content security policy allows scripts only from the extension package.
- Page capture begins only after the user selects the extension's save button.

## Reporting a security problem

Report security concerns privately to the repository owner. Do not include confidential webpage content, credentials, saved MHTML files, or personal data in a public issue.
