# Architecture

The current application is an Expo/React Native demonstrator with an in-memory state store. It has no backend or persistent queue.

```text
Dispatcher screens ─┐
                    ├── applyAction ── session state
Driver screens ─────┘                      │
                                     sample fixtures
```

The dispatcher can create an order, assign a driver before the journey starts, and review an attached sample CMR. Both roles can advance an assigned journey and attach sample documents, with driver operations scoped to their assigned orders. Domain checks protect the demo from inconsistent operations, but client-side checks are not an authorization boundary for a real service.

The new component proposed for funding would introduce a separate architecture:

```text
Mobile workflow → persistent local queue → synchronisation contract
                                                  ↓
                                     open reference server
                                                  ↓
                                      adapter / fleet system
```

Queue persistence, acknowledgements, retries, duplicate suppression, conflict resolution, authentication and real file transfer remain unimplemented. The reference server must be usable without a private VALIMARTRANS installation. Interfaces and existing synchronisation libraries need comparison before choosing an implementation.

Only ordinary sample workflow data is present. This repository was created independently; customer configurations, source history, credentials, documents and brand assets were not copied.
