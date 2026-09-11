import type { FleetState, Order } from './domain.ts';

export function createDemoState(): FleetState {
  const orders: Order[] = [
    { id: '1001', reference: 'DEMO-1001', customer: 'Sample customer A', origin: 'Bucharest, RO', destination: 'Budapest, HU', loadingSlot: 'Day 1 · 08:00–09:00', unloadingSlot: 'Day 2 · 07:00–09:00', cargo: '24 pallets · packaged goods · 12,000 kg', temperature: null, driverId: 'a', status: 'in_transit', documents: [], events: [{ title: 'Journey started', time: 'Day 1 · 09:10' }, { title: 'Assigned to Demo driver A', time: 'Day 1 · 07:30' }] },
    { id: '1002', reference: 'DEMO-1002', customer: 'Sample customer B', origin: 'Cluj-Napoca, RO', destination: 'Vienna, AT', loadingSlot: 'Day 1 · 10:00–11:00', unloadingSlot: 'Day 2 · 08:00–10:00', cargo: '18 pallets · chilled goods · 8,400 kg', temperature: '+2 °C to +6 °C', driverId: 'b', status: 'assigned', documents: [], events: [{ title: 'Assigned to Demo driver B', time: 'Day 1 · 08:00' }] },
    { id: '1003', reference: 'DEMO-1003', customer: 'Sample customer C', origin: 'Brașov, RO', destination: 'Sofia, BG', loadingSlot: 'Day 2 · 08:00–10:00', unloadingSlot: 'Day 2 · 16:00–18:00', cargo: '12 pallets · spare parts · 5,100 kg', temperature: null, driverId: null, status: 'unassigned', documents: [], events: [{ title: 'Demo order created', time: 'Day 1 · 08:20' }] },
    { id: '1004', reference: 'DEMO-1004', customer: 'Sample customer A', origin: 'Timișoara, RO', destination: 'Bratislava, SK', loadingSlot: 'Day 1 · 06:00–07:00', unloadingSlot: 'Day 1 · 15:00–17:00', cargo: '26 pallets · packaged goods · 14,200 kg', temperature: null, driverId: 'c', status: 'delivered', documents: [{ kind: 'cmr', verified: false }], events: [{ title: 'Sample CMR attached', time: 'Day 1 · 16:20' }, { title: 'Delivery recorded', time: 'Day 1 · 16:10' }] },
    { id: '1005', reference: 'DEMO-1005', customer: 'Sample customer D', origin: 'Oradea, RO', destination: 'Prague, CZ', loadingSlot: 'Day 2 · 07:00–08:00', unloadingSlot: 'Day 3 · 08:00–10:00', cargo: '20 pallets · chilled goods · 9,000 kg', temperature: '+2 °C to +6 °C', driverId: 'a', status: 'assigned', documents: [], events: [{ title: 'Assigned to Demo driver A', time: 'Day 1 · 09:00' }] },
  ];
  return { orders, drivers: [
    { id: 'a', name: 'Demo driver A', vehicle: 'DEMO-TRUCK-01' },
    { id: 'b', name: 'Demo driver B', vehicle: 'DEMO-TRUCK-02' },
    { id: 'c', name: 'Demo driver C', vehicle: 'DEMO-TRUCK-03' },
  ] };
}
