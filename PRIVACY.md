# Privacy Policy - VFE MHTML 001

**Effective date:** 2026-07-27  
**Release:** 001 build1  
**Author:** Flavius

VFE MHTML 001 is designed to perform one user-requested task: save the active Chrome tab as an MHTML file.

## Data collection

The extension does not collect personal information, browsing history, page content, account data, analytics, diagnostics, or usage statistics.

## Data processing

When the user selects **Save page as MHTML**, Chrome's local `pageCapture` API creates a snapshot of the active tab. The extension passes that locally generated snapshot to Chrome's download system so the user can choose where to save it.

No captured page content is transmitted to the author, a remote server, or a third party.

## Data storage

The extension does not maintain its own database or persistent storage. The only resulting file is the `.mhtml` file saved by the user through Chrome's Save As dialog.

## Network activity

The extension contains no analytics, advertising, telemetry, remote scripts, external fonts, content delivery network resources, or third-party libraries. It does not make its own network requests.

The webpage being captured may already have its own network activity; that activity belongs to the webpage and is not initiated by this extension.

## Permissions

- `activeTab`: temporary access to the tab selected by the user.
- `pageCapture`: generation of the local MHTML snapshot.
- `downloads`: saving the snapshot through Chrome's download system.

The extension requests no permanent host permissions.

## Changes

Material changes to this policy should be recorded in the project changelog and included in a new release.
