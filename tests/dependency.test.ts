import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('xcode can generate unique project identifiers with the patched uuid dependency', () => {
  const project = require('xcode').project('unused-demo-project.pbxproj');
  project.hash = { project: { objects: {} } };
  const first = project.generateUuid();
  const second = project.generateUuid();
  assert.match(first, /^[A-F0-9]{24}$/);
  assert.notEqual(first, second);
});
