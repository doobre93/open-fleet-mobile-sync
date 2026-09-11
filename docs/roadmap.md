# Roadmap

## Current demonstrator

- [x] Dispatcher order board, search and status filters
- [x] Sample driver workspaces and assignments
- [x] Delivery state transitions and local activity history
- [x] Sample CMR and temperature-report previews
- [x] Local CMR review and resettable fixtures
- [x] Domain workflow tests

## Proposed synchronisation project

These items are not complete and funding has not been awarded. The application requests EUR 6,000 for 200 hours; the final scope and milestones would depend on selection and agreement.

| Milestone | Hours | Proposed EUR |
| --- | ---: | ---: |
| Requirements and synchronisation contract | 24 | 720 |
| Persistent queue and synchronisation core | 44 | 1,320 |
| Mobile driver workflow integration | 44 | 1,320 |
| Open reference server and adapter boundary | 36 | 1,080 |
| Failure tests, documentation and release | 44 | 1,320 |
| Coordination and reporting | 8 | 240 |
| Total | 200 | 6,000 |

The existing demo and its development are outside that proposed funding request. The mobile milestone concerns integration with the new synchronisation component, not recreating these screens.

Acceptance cases to define and implement include interrupted connectivity, app restarts, repeated requests, stale records, interrupted uploads, expired credentials and independent server installation. No success rates or timings have been measured for those future capabilities.
