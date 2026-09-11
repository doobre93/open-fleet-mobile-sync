import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, awaitingCmrReview, filterOrders, visibleOrders } from '../src/domain.ts';
import { createDemoState } from '../src/fixtures.ts';

const dispatcher = { role: 'dispatcher' } as const;
const driver = { role: 'driver', driverId: 'a' } as const;

test('assignment makes an order visible only to the selected driver', () => {
  const initial = createDemoState();
  const assigned = applyAction(initial, { type: 'assign', orderId: '1003', driverId: 'a' }, dispatcher, '10:00');
  assert.equal(visibleOrders(assigned, driver).length, 3);
  assert.equal(visibleOrders(assigned, { role: 'driver', driverId: 'b' }).length, 1);
  assert.equal(initial.orders.find(order => order.id === '1003')?.status, 'unassigned');
});

test('drivers cannot alter someone else’s order or assign themselves an order', () => {
  assert.throws(() => applyAction(createDemoState(), { type: 'advance', orderId: '1002' }, driver, '10:00'), /not assigned/);
  assert.throws(() => applyAction(createDemoState(), { type: 'assign', orderId: '1005', driverId: 'b' }, driver, '10:00'), /dispatcher/);
});

test('delivery workflow rejects unassigned journeys and reassignment in transit', () => {
  const initial = createDemoState();
  assert.throws(() => applyAction(initial, { type: 'advance', orderId: '1003' }, dispatcher, '10:00'), /Assign a driver/);
  assert.throws(() => applyAction(initial, { type: 'assign', orderId: '1001', driverId: 'b' }, dispatcher, '10:00'), /already started/);
  const transit = applyAction(initial, { type: 'advance', orderId: '1005' }, driver, '10:00');
  const delivered = applyAction(transit, { type: 'advance', orderId: '1005' }, driver, '11:00');
  assert.equal(delivered.orders.find(order => order.id === '1005')?.status, 'delivered');
  assert.throws(() => applyAction(delivered, { type: 'advance', orderId: '1005' }, driver, '12:00'), /cannot be restarted/);
});

test('CMR review requires a document and dispatcher role; repeated actions are harmless', () => {
  const initial = createDemoState();
  assert.throws(() => applyAction(initial, { type: 'verify', orderId: '1001' }, dispatcher, '10:00'), /Attach a CMR/);
  const attached = applyAction(initial, { type: 'attach', orderId: '1001', kind: 'cmr' }, driver, '10:00');
  assert.equal(applyAction(attached, { type: 'attach', orderId: '1001', kind: 'cmr' }, driver, '10:00'), attached);
  assert.throws(() => applyAction(attached, { type: 'verify', orderId: '1001' }, driver, '10:00'), /dispatcher/);
  const reviewed = applyAction(attached, { type: 'verify', orderId: '1001' }, dispatcher, '10:00');
  assert.equal(reviewed.orders.find(order => order.id === '1001')?.documents[0]?.verified, true);
});

test('new orders validate input, get unique references, and reset restores isolated fixtures', () => {
  assert.throws(() => applyAction(createDemoState(), { type: 'create', origin: ' ', destination: 'Vienna', cargo: 'Boxes' }, dispatcher, '10:00'));
  const created = applyAction(createDemoState(), { type: 'create', origin: ' Iași ', destination: 'Vienna', cargo: 'Boxes' }, dispatcher, '10:00');
  assert.equal(created.orders[0]?.reference, 'OF-1006');
  assert.equal(created.orders[0]?.origin, 'Iași');
  created.orders[1]!.documents.push({ kind: 'cmr', verified: true });
  assert.equal(createDemoState().orders[0]?.documents.length, 0);
});

test('search matches any field, including the assigned driver, and respects the status filter', () => {
  const state = createDemoState();
  const references = (query: string, status: Parameters<typeof filterOrders>[3] = 'all') =>
    filterOrders(state, state.orders, query, status).map(order => order.reference);
  assert.deepEqual(references('  VIENNA '), ['OF-1002']);
  assert.deepEqual(references('stoica'), ['OF-1001', 'OF-1005']);
  assert.deepEqual(references('stoica', 'assigned'), ['OF-1005']);
  assert.equal(references('').length, state.orders.length);
});

test('CMR review counter tracks attached documents until they are reviewed', () => {
  const initial = createDemoState();
  assert.equal(awaitingCmrReview(initial.orders), 1);
  const attached = applyAction(initial, { type: 'attach', orderId: '1001', kind: 'cmr' }, driver, '10:00');
  assert.equal(awaitingCmrReview(attached.orders), 2);
  const reviewed = applyAction(attached, { type: 'verify', orderId: '1004' }, dispatcher, '10:05');
  assert.equal(awaitingCmrReview(reviewed.orders), 1);
});
