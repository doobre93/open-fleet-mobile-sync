import type { Driver, FleetState, Order } from './domain.ts';

function dayLabel(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Intl.DateTimeFormat('en-GB', {weekday: 'short', day: 'numeric'}).format(date);
}

const drivers: Driver[] = [
  {id: 'a', name: 'Mihai Stoica', truck: 'Scania R 450 · reefer', plate: 'B 214 LDG'},
  {id: 'b', name: 'Andrei Popa', truck: 'Volvo FH 460 · reefer', plate: 'CJ 08 LDG'},
  {id: 'c', name: 'Radu Ilie', truck: 'DAF XF 480 · curtainsider', plate: 'TM 31 LDG'},
];

const orders: Order[] = [
  {
    id: '1001',
    reference: 'OF-1001',
    customer: 'Customer 014',
    origin: 'Bucharest, RO',
    destination: 'Budapest, HU',
    distanceKm: 830,
    loadingSlot: 'Today 08:00–09:00',
    unloadingSlot: 'Tomorrow 07:00–09:00',
    cargo: '24 pallets · packaged goods · 12,000 kg',
    temperature: null,
    driverId: 'a',
    status: 'in_transit',
    documents: [],
    events: [
      {title: 'Journey started', time: 'Today 09:10'},
      {title: 'Assigned to Mihai Stoica', time: 'Today 07:30'},
    ],
  },
  {
    id: '1002',
    reference: 'OF-1002',
    customer: 'Customer 027',
    origin: 'Cluj-Napoca, RO',
    destination: 'Vienna, AT',
    distanceKm: 720,
    loadingSlot: 'Today 10:00–11:00',
    unloadingSlot: 'Tomorrow 08:00–10:00',
    cargo: '18 pallets · chilled goods · 8,400 kg',
    temperature: '+2 °C to +6 °C',
    driverId: 'b',
    status: 'assigned',
    documents: [],
    events: [{title: 'Assigned to Andrei Popa', time: 'Today 08:00'}],
  },
  {
    id: '1003',
    reference: 'OF-1003',
    customer: 'Customer 031',
    origin: 'Brașov, RO',
    destination: 'Sofia, BG',
    distanceKm: 430,
    loadingSlot: 'Tomorrow 08:00–10:00',
    unloadingSlot: 'Tomorrow 16:00–18:00',
    cargo: '12 pallets · spare parts · 5,100 kg',
    temperature: null,
    driverId: null,
    status: 'unassigned',
    documents: [],
    events: [{title: 'Order created', time: 'Today 08:20'}],
  },
  {
    id: '1004',
    reference: 'OF-1004',
    customer: 'Customer 014',
    origin: 'Timișoara, RO',
    destination: 'Bratislava, SK',
    distanceKm: 560,
    loadingSlot: 'Today 06:00–07:00',
    unloadingSlot: 'Today 15:00–17:00',
    cargo: '26 pallets · packaged goods · 14,200 kg',
    temperature: null,
    driverId: 'c',
    status: 'delivered',
    documents: [{kind: 'cmr', verified: false}],
    events: [
      {title: 'CMR scanned', time: 'Today 16:20'},
      {title: 'Delivery confirmed', time: 'Today 16:10'},
    ],
  },
  {
    id: '1005',
    reference: 'OF-1005',
    customer: 'Customer 042',
    origin: 'Oradea, RO',
    destination: 'Prague, CZ',
    distanceKm: 780,
    loadingSlot: 'Tomorrow 07:00–08:00',
    unloadingSlot: `${dayLabel(2)} 08:00–10:00`,
    cargo: '20 pallets · chilled goods · 9,000 kg',
    temperature: '+2 °C to +6 °C',
    driverId: 'a',
    status: 'assigned',
    documents: [],
    events: [{title: 'Assigned to Mihai Stoica', time: 'Today 09:00'}],
  },
];

export function createDemoState(): FleetState {
  return {
    drivers: drivers.map(driver => ({...driver})),
    orders: orders.map(order => ({
      ...order,
      documents: order.documents.map(document => ({...document})),
      events: order.events.map(event => ({...event})),
    })),
  };
}
