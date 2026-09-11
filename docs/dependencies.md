# Dependency notes

The new demonstrator uses Expo SDK 57 and the React/React Native versions selected by `expo install --fix`. It does not upgrade the private source application.

`xcode` still requests uuid 7. We override only that dependency to uuid 11.1.1 to address GHSA-w5hq-g745-h8pq. Inspection of `xcode/lib/pbxProject.js` shows its UUID use is `require('uuid').v4()`, which remains available in uuid 11. The repository checks include a smoke test of this integration. Review this override when upstream updates its dependency.

No forced Expo downgrade is applied merely to satisfy `npm audit`. The lockfile is committed with the source so installations are reproducible.
