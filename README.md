# Open Fleet Mobile Sync

A transport workflow demonstrator by LENDAGO INTERNATIONAL SRL, and a proposed project for independently reusable mobile synchronisation.

**Status:** a working, session-only demo. Offline synchronisation and the reference server are proposed work, not implemented features. No grant has been awarded.

## Try the workflow

1. Open the order board as **Dispatcher**. Find `DEMO-1003` and assign a sample driver.
2. Switch to **Driver** and choose the same driver. Open the assigned order.
3. Start the journey, then mark it as delivered.
4. Add a sample CMR and open its preview.
5. Switch back to Dispatcher and mark the CMR as reviewed.
6. Use **Reset demo** to restore the initial five orders.

You can also create a demo order, search routes and references, filter by delivery status and explore driver assignments. All records are fictional and explicitly labelled. Document previews contain sample route information, not scans, signatures or actual transport records.

## Run locally

Use a Node.js version supported by the installed Expo SDK. See `package.json` for the minimum version.

```sh
npm ci
npm run web
```

The CLI prints the local address. For a production web export:

```sh
npm run check
```

This runs TypeScript checks, domain tests and a web build. Serve the generated `dist/` folder with a static HTTP server. The application uses Expo and React Native, including React Native Web. Native Android and iOS device validation is separate from the browser checks.

## Existing work and proposed work

The workflow choices were informed by the existing VALIMARTRANS mobile code: orders, driver assignment, delivery status, CMR and temperature-report handling. This repository is a new standalone implementation. It does not contain that private application's source tree, database, credentials, deployment configuration or Git history.

The proposed next step is a persistent mobile action queue, a documented client/server contract, safe retries, duplicate handling, conflict review, real document transfer, and an open reference server. See [the roadmap](docs/roadmap.md) and [architecture](docs/architecture.md).

## Boundaries

- State is held in memory. Reloading or resetting restores the sample dataset.
- Role switching demonstrates workflows; it is not login or server-side authorization.
- No uploads, production API requests, accounts, geolocation or analytics are included.
- The driver actions and dispatcher review are local demo state changes, not messages to other people.
- The demo is not production fleet software or evidence of a completed grant milestone.

## Development

`src/domain.ts` contains the workflow rules, `src/fixtures.ts` the sample dataset, `src/ui.tsx` shared UI components, and `App.tsx` the demo screens. Tests exercise assignment visibility, role restrictions, delivery transitions, CMR review and input validation. These tests do not establish production security or synchronisation reliability.

Project preparation and implementation used generative-AI assistance. This is disclosed here and in the funding application; no exclusively human authorship or independently audited results are claimed.

Company: [lendago.ro](https://lendago.ro/). Source licensing: [MIT](LICENSE). Third-party dependencies retain their own licences.
