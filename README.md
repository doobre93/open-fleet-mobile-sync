# Open Fleet Mobile Sync

A driver and dispatch app for small transport fleets, built with Expo and React Native by LENDAGO INTERNATIONAL SRL. It covers the day-to-day loop we deal with in our own fleet: dispatch assigns a load, the driver runs it, the signed CMR comes back, dispatch approves it.

**Status:** working demo with a made-up fleet. Everything runs on the device and resets on reload. Offline synchronisation and the reference server are the next piece of work and are not in this repository yet.

## Walkthrough

1. Pick **Mihai Stoica** on the start screen. The current journey is on top — drag the orange handle to confirm delivery.
2. Open the **CMR** tab, pick the delivered order and scan the CMR (the camera is simulated).
3. **Profile → Switch profile → Dispatch office.** Open `OF-1003`, which has no driver, and assign one.
4. In the **CMR** tab, open the scanned document and approve it. The CMR preview is a specimen form filled from the order.
5. Use **+** on the board to add an order, or search by city, reference or driver.
6. **Profile → Reset demo data** puts everything back.

## Running it

Node 22.13 or newer.

```sh
npm ci
npm start       # Expo dev server; scan the QR code with Expo Go on Android or iOS
npm run web     # same app in the browser
npm run check   # typecheck, tests, web export into dist/
```

On a wide browser window the app is shown in a phone-width column.

## Layout

| Path | What lives there |
| --- | --- |
| `src/domain.ts` | Orders, roles and the rules for assigning, advancing, attaching and approving |
| `src/fixtures.ts` | The demo fleet: three drivers, five orders |
| `src/store.tsx` | Session state, current profile, toasts |
| `src/screens/` | Start screen, driver Today, dispatch board, journey detail, CMR list, profile |
| `src/components/` | Ticket card, slide-to-confirm, bottom sheet, CMR specimen, tab bar, icons |
| `tests/` | Node test runner, no extra framework |

## Where this comes from

The workflow follows the one in VALIMARTRANS, the fleet application we use internally (orders, driver assignment, delivery status, CMR and reefer paperwork). This repository is a separate, clean implementation — none of that application's code, data, credentials or history is included.

Next step is an offline action queue on the phone, a documented sync contract with idempotent retries and conflict handling, real document upload, and a small open reference server. See [roadmap](docs/roadmap.md) and [architecture](docs/architecture.md).

## Limits of the demo

- Profiles are a picker, not a login. Role checks happen on the client only.
- No network calls, uploads, location or analytics.
- Drivers, plates, customers and orders are fictional.

[lendago.ro](https://lendago.ro/) · [MIT licence](LICENSE)
