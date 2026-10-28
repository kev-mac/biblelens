Draft wording only. Source: `6d94258cf66679d40a6d29674ab45c9c7c0f36c3`.
Historical account, platform and legal facts have not been refreshed. Keep unresolved assumptions pending.

# BibleLens Privacy Policy Draft

**Draft dated October 26, 2026. Not ready to publish.**

This draft describes the code reviewed for the App Store readiness audit.
Items marked **Assumption** need an owner answer before publication.
The app also needs a working account-deletion flow before this draft can become its final policy.

## Who Runs BibleLens

BibleLens is a tool for studying biblical texts, sources, and interpretations.
You can read and search without signing in.
Cloud sync is optional. It copies saved work between your connected devices.

**Assumption A1 — Owner details:** The legal operator has not been confirmed for this policy.
Add the operator's name, privacy contact, support page, and policy start date here.
No contact address or response deadline has been verified.

## What Stays on Your Device

The app saves your notes, note titles, bookmarks, highlights, saved comparisons, and reading settings on your device.
These settings include your text size, app font, theme, and chosen Bible edition.
It also keeps local copies that help recover saved work when storage or sync has problems.

Native reading, search, and Chat requests are processed on your device.
Chat keeps recent messages for the current page session.
It does not automatically include your private notes.
Anything you paste into a question becomes part of that question.

On supported iPhones, the app can use the device's own AI model to explain retrieved passages.
This feature starts enabled when the model is ready, unless you previously turned it off.
You can turn it off in Settings.
The reviewed app code sends no questions to an outside AI service.
Generated explanations can be wrong. Check the linked sources.

## What Cloud Sync Stores

When you enable sync, the app sends saved work to the BibleLens cloud service.
The service stores it under the ID linked to your signed-in account.
The saved work includes:

- Notes and their titles, including notes on verses and passages.
- Bookmarks, selected highlights, and the text saved with those highlights.
- Saved comparisons, including passage choices, edition, title, and your note.
- Theme, text size, app font, and other reader settings.

The service also stores a version counter and the time of the latest update.
These records help devices combine changes and avoid replacing newer work with an older copy.
When notes conflict, the app may keep both edits.

Your notes may contain private details, including beliefs, if you choose to write them.
BibleLens does not ask you to state your religion or build a religion profile in the reviewed code.
Synced notes are linked to your account; they are not anonymous.
The app provides no public feed for your notes.

## Sign-In and Connected Devices

The website uses Sign in with ChatGPT for cloud sync.
The iPhone app connects through a code created on the signed-in website.
BibleLens's sync tables store an account ID, not your name, email address, or password.

The cloud service keeps protected checks of connection codes and device access keys.
These checks are called hashes. They let the service check a key without storing its original value.
Your device keeps the access key needed to connect.
Connection codes work once and expire after ten minutes.
Device access expires after 90 days and can be revoked earlier.
An expired key may still have a stored record; expiry does not mean that record has been erased.

**Assumption A2 — Sign-in provider:** The owner must confirm the provider's account fields, cookies, retention, and sharing practices.
The provider's current privacy notice must be linked in the final policy.
Signing in for sync is separate from sending a question to an AI service.

## Website Use, Maps, and Other Connections

The website handles reading and search requests on its server.
Website Chat sends your question, recent messages, and passage context to the site's search service.
The reviewed server code does not save those questions in the sync database.
The native app handles those requests locally instead.

The native app checks the website's public version file when it starts.
You can also ask it to check for updates.
That request does not include your notes or a sync access key.

When you open a map, the app requests map tiles and fonts from OpenFreeMap.
Those requests describe the map area being viewed. They do not request your device's GPS position.
The app's normal reading fonts are bundled with it.

Online services receive the network details needed to answer a request, including its internet address, called an IP address.
The code alone does not show what the hosting and map services retain.

**Assumption A3 — Service records:** The owner must confirm all service providers, stored logs, storage locations, and retention periods.
This includes the Sites host, its cloud database, the sign-in provider, and map services.
The final policy must explain their access, safeguards, and any required data transfers between countries.
It must not promise that providers keep no logs without checking.

## Sharing, Exports, and External Links

You can download backups and export notes as files.
Those files contain the information you export. People or services you send them to can read that information.
The app does not remove exported files when you edit or delete a note.

A shared passage link points to a passage or study. It does not include your notes.
When you open an outside source or website, that service handles your visit under its own privacy rules.

No ads, advertising trackers, or purchase collection were found in the reviewed app code.
It also has no code path requesting your contacts, microphone, camera, or GPS location for these features.

**Assumption A4 — Provider use:** The owner must confirm whether any provider uses retained data for analytics, advertising, or other purposes.
No claim about all providers selling, tracking, or reusing data is approved by this draft.

## Turning Off Sync and Deleting Data

Turning off sync stops automatic sync from that device.
A request already in progress may still finish.
On iPhone, the app also tries to revoke that device's cloud access.
If that request fails, local sync still turns off, but the server key may remain valid until revoked or expired.
The website offers a separate option to disconnect all iPhones.

**Disconnecting does not delete your cloud notes.**
It also does not remove notes stored on your devices or in exported files.
The server code has no automatic deletion period for the cloud notes record.

You can edit or delete individual notes through the app.
With sync enabled, those changes can reach other devices after a successful sync.
A conflicting offline edit may be kept alongside another change.
Local recovery copies or safety backups may still contain earlier text.

There is currently no complete in-app action to delete your BibleLens account and all its cloud data.
Deleting the app or clearing local data does not send a request to erase the cloud record.
Do not rely on these actions to delete cloud notes.

**Assumption A5 — Deletion policy:** The owner must approve and implement a complete deletion process before publication.
The final policy must give its location, expected timing, and any lawful retention exceptions.
It must cover cloud notes, account links, device keys, pending codes, logs, and service backups.
It must also explain local copies, exported files, and disconnected devices.
Deleting BibleLens data must not imply that your separate ChatGPT account is deleted.

## How Data Is Protected

Cloud requests use HTTPS, which protects data while it travels over the network.
The server checks account access and separates each user's saved document.
It checks versions before accepting updates and stores hashes of device keys.

The reviewed code does not provide end-to-end encryption for notes.
The service processes their contents to store and return your saved work.
Your device also keeps local notes and recovery copies.

**Assumption A6 — Service protection:** The owner must confirm staff access rules and protections for stored data and backups.
No promise about encrypted storage, audit coverage, or a fixed security standard has been verified here.

## Questions and Policy Changes

**Assumption A7 — Rights and contact process:** The owner must provide a working privacy contact and a process for privacy requests.
Confirm how access, correction, deletion, complaints, and any local privacy rights will be handled.
Confirm whether terms for younger users are needed in the chosen countries.
BibleLens welcomes people of any faith or none. The reviewed source has no age check.

**Assumption A8 — Updates:** The owner must choose how users will learn about material changes to this policy.
Add a policy date only after the final text and actual app behavior have been checked.

## Draft Evidence Notes

These notes support review and are not part of the proposed public policy.

| Policy Topic | Source Files |
| --- | --- |
| Local notes, recovery, and exports | `src/app.js`, `src/sync-core.js`, `src/passage.js` |
| Synced fields and merge behavior | `src/sync-core.js`, `src/sync.js` |
| Account IDs, keys, expiry, and missing deletion | `worker/sync.mjs`, `db/schema.ts` |
| Native search and optional AI | `src/device-api.js`, `src/device-api-worker.js`, `src/device-bootstrap.js`, `src/device-conversation.js` |
| Website Chat and reading requests | `src/reader.js`, `worker/index.mjs`, `src/index.html` |
| Version checks, maps, and fonts | `src/release.js`, `src/places.js`, `src/data/atlas-style.json`, `src/fonts.css` |
| Mobile privacy copy | `scripts/build-mobile.mjs` |

The standalone browser model module `src/local-ai.js` exists, but no active page entry was found in this source.
Do not describe its model downloads as an active user feature without verifying a later build.
Provider operations, backups, logs, contracts, and legal duties cannot be established from these files alone.
The full audit records the source commit and the remaining verification work.
