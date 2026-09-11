export type DeliveryStatus = 'unassigned' | 'assigned' | 'in_transit' | 'delivered';
export type DocumentKind = 'cmr' | 'temperature';
export type Actor = { role: 'dispatcher' } | { role: 'driver'; driverId: string };
export interface Driver { id: string; name: string; vehicle: string }
export interface FleetDocument { kind: DocumentKind; verified: boolean }
export interface Order {
  id: string;
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  loadingSlot: string;
  unloadingSlot: string;
  cargo: string;
  temperature: string | null;
  driverId: string | null;
  status: DeliveryStatus;
  documents: FleetDocument[];
  events: { title: string; time: string }[];
}
export interface FleetState { orders: Order[]; drivers: Driver[] }
export type FleetAction =
  | { type: 'assign'; orderId: string; driverId: string | null }
  | { type: 'advance'; orderId: string }
  | { type: 'attach'; orderId: string; kind: DocumentKind }
  | { type: 'verify'; orderId: string }
  | { type: 'create'; origin: string; destination: string; cargo: string };

export const statusLabels: Record<DeliveryStatus, string> = {
  unassigned: 'Unassigned', assigned: 'Assigned', in_transit: 'In transit', delivered: 'Delivered',
};

export function visibleOrders(state: FleetState, actor: Actor): Order[] {
  return actor.role === 'dispatcher' ? state.orders : state.orders.filter(order => order.driverId === actor.driverId);
}

export function applyAction(state: FleetState, action: FleetAction, actor: Actor, time: string): FleetState {
  if (action.type === 'create') {
    if (actor.role !== 'dispatcher') throw new Error('Only the dispatcher can create an order.');
    const fields = [action.origin, action.destination, action.cargo].map(value => value.trim());
    if (fields.some(value => value.length < 2 || value.length > 120)) {
      throw new Error('Use between 2 and 120 characters for each field.');
    }
    const sequence = Math.max(1000, ...state.orders.map(order => Number(order.id))) + 1;
    const order: Order = {
      id: String(sequence), reference: `DEMO-${sequence}`, customer: 'Sample customer',
      origin: fields[0]!, destination: fields[1]!, cargo: fields[2]!,
      loadingSlot: 'Not scheduled', unloadingSlot: 'Not scheduled', temperature: null,
      driverId: null, status: 'unassigned', documents: [], events: [{ title: 'Demo order created', time }],
    };
    return { ...state, orders: [order, ...state.orders] };
  }

  const order = state.orders.find(item => item.id === action.orderId);
  if (!order) throw new Error('Order not found.');
  if (actor.role === 'driver' && order.driverId !== actor.driverId) throw new Error('This order is not assigned to you.');
  let updated: Order = { ...order };
  let event: string;

  switch (action.type) {
    case 'assign': {
      if (actor.role !== 'dispatcher') throw new Error('Only the dispatcher can assign drivers.');
      if (order.status === 'in_transit' || order.status === 'delivered') throw new Error('This journey has already started.');
      const driver = state.drivers.find(item => item.id === action.driverId);
      if (action.driverId !== null && !driver) throw new Error('Driver not found.');
      if (order.driverId === action.driverId) return state;
      updated = { ...order, driverId: action.driverId, status: action.driverId ? 'assigned' : 'unassigned' };
      event = driver ? `Assigned to ${driver.name}` : 'Driver assignment removed';
      break;
    }
    case 'advance':
      if (order.status !== 'assigned' && order.status !== 'in_transit') throw new Error('Assign a driver before starting a journey. Delivered orders cannot be restarted.');
      updated.status = order.status === 'assigned' ? 'in_transit' : 'delivered';
      event = updated.status === 'in_transit' ? 'Journey started' : 'Delivery recorded';
      break;
    case 'attach':
      if (action.kind === 'temperature' && !order.temperature) throw new Error('This order does not require a temperature report.');
      if (order.documents.some(document => document.kind === action.kind)) return state;
      updated.documents = [...order.documents, { kind: action.kind, verified: false }];
      event = action.kind === 'cmr' ? 'Sample CMR attached' : 'Sample temperature report attached';
      break;
    case 'verify':
      if (actor.role !== 'dispatcher') throw new Error('Only the dispatcher can review a CMR.');
      if (!order.documents.some(document => document.kind === 'cmr')) throw new Error('Attach a CMR before marking it as reviewed.');
      if (order.documents.some(document => document.kind === 'cmr' && document.verified)) return state;
      updated.documents = order.documents.map(document => document.kind === 'cmr' ? { ...document, verified: true } : document);
      event = 'Sample CMR marked as reviewed';
      break;
  }
  updated.events = [{ title: event, time }, ...order.events];
  return { ...state, orders: state.orders.map(item => item.id === order.id ? updated : item) };
}
