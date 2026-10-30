import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GTS_PILOT_COMPONENTS, isGtsPilotId, pilotScope } from './gts-pilot.ts';

describe('GTS pilot identity and scope', () => {
  it('uses distinct rider-side mirror identities and a front tyre', () => {
    assert.equal(GTS_PILOT_COMPONENTS['gts125-mirror-left'].side, 'left');
    assert.equal(GTS_PILOT_COMPONENTS['gts125-mirror-right'].side, 'right');
    assert.equal(GTS_PILOT_COMPONENTS['gts125-front-tyre'].side, null);
    assert.equal(isGtsPilotId('handlebar'), false);
  });
  it('never treats GTS 125 selection as a verified exact variant', () => {
    assert.equal(pilotScope('GTS', '125'), 'reference');
    assert.equal(pilotScope('GTS', ''), 'unknown');
    assert.equal(pilotScope('GTS', '300'), 'outside');
    assert.equal(pilotScope('PX', '125'), 'outside');
  });
});
