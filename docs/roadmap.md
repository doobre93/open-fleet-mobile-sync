# Roadmap

## Current demonstrator

- [x] Driver profile picker, Today screen and journey detail
- [x] Slide-to-confirm for starting and delivering a journey
- [x] Dispatch board with search, status filters and driver assignment
- [x] Simulated CMR scan, specimen CMR preview and dispatch approval
- [x] Reefer loads with temperature range and log attachment
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
