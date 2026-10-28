# iOS Sync Credential Storage

Status: exact implementation plan; no native change in B3.

`package.json` has Capacitor core, iOS, Android and local-llm. None exposes secure credential storage.
The local-llm plugin handles inference. It is not a Keychain store.
There is no existing secure-storage plugin that meets the requested constraint.
Do not put the token in Capacitor Preferences. It is not secure credential storage.

1. Add a reviewed Capacitor Keychain plugin in a separate native change, or implement a small native bridge.
   Pin its version and review its native source, maintenance, licence and backup behavior first.
2. On iOS, store one device token in Keychain under service `BibleLens.sync`, account `device-token-v1`.
   Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`; disable Keychain sharing and cloud replication.
   Expose only `get`, `set`, and `remove`. Do not log values or expose a generic Keychain query.
3. Keep merge bases, revision, owner, disconnect intent and enabled state in the existing metadata record.
   Remove the bearer token from every metadata serialization, export, error, backup and diagnostic.
   Web sessions keep their existing cookie-based flow. Web code must never call the native token bridge.
4. Gate native startup on asynchronous credential hydration before pairing, polling, focus, online events or revocation.
   Read the existing Keychain item first. Treat missing storage and bridge errors as different states.
   A bridge error must pause sync and preserve local notes and the old credential for a retry.
5. Migrate an existing localStorage bearer by writing Keychain, then reading back and comparing its exact bytes.
   Only then write metadata without the token. If either storage operation fails, retain the old record and pause.
   If a crash leaves both copies, retry the same migration. Never silently replace a different Keychain token.
   A missing token must require pairing; never use enabled metadata alone as proof of authorization.
6. Pairing must persist and verify the new token before marking sync enabled or starting document requests.
   If secure persistence fails, retain only the newly issued token in memory long enough to revoke it.
   Report the failure without its value; do not fall back to localStorage.
7. Disconnect must keep the token in Keychain until server revocation succeeds or returns 401.
   Persist disconnect intent before the request. Disable writes and retry revocation on reconnect or next launch.
   Then remove the Keychain item and clear disconnect intent. Removal failures keep intent for retry.
   Account changes must disable sync and retain local edits; never attach the old base to a new account.
8. Keep server token hashes, expiry, origin checks, revision checks and three-way merges unchanged.
   Secure storage reduces disk exposure; injected script could still call an authorized native bridge.
9. Test migration, bridge failures, full storage, interrupted writes, duplicate copies and concurrent launch events.
   Test offline pairing/disconnect, revoked and expired tokens, account changes and owner mismatch.
   Run `check:sync`, native browser tests and a device Keychain inspection after a separately authorized signed build.
   Verify no plaintext bearer remains in localStorage, exports, logs or packaged assets.

No signing, plugin install, native sync or entitlement edit was performed. Native validation remains required.
