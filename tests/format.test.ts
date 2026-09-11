import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cargoParts, distance, firstName, greeting, splitPlace } from '../src/format.ts';

test('places split into city and country code only when the code is present', () => {
  assert.deepEqual(splitPlace('Cluj-Napoca, RO'), {city: 'Cluj-Napoca', country: 'RO'});
  assert.deepEqual(splitPlace('Warehouse 3, Chiajna'), {city: 'Warehouse 3, Chiajna', country: null});
});

test('cargo descriptions break into their parts and free text stays whole', () => {
  assert.deepEqual(cargoParts('24 pallets · packaged goods · 12,000 kg'), ['24 pallets', 'packaged goods', '12,000 kg']);
  assert.deepEqual(cargoParts('loose steel coils'), ['loose steel coils']);
});

test('small labels', () => {
  assert.equal(firstName('Mihai Stoica'), 'Mihai');
  assert.equal(distance(830), '830 km');
  assert.equal(distance(null), '— km');
  assert.equal(greeting(new Date(2026, 8, 12, 7)), 'Good morning');
  assert.equal(greeting(new Date(2026, 8, 12, 2)), 'Late shift');
});
