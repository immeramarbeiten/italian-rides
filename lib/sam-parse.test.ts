import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSamText } from './sam-parse.ts';

describe('SAM decoding', () => {
  it('decodes the official parser 5x5 sample into a real SVG path', () => {
    const text='<0f>0<|box;x1=10;y1=20;x2=15;y2=25;w=100;h=100|><|mask;x=0;y=0;data=5,5,!!!!!(QO(0lu8?|>';
    const [match]=parseSamText(text);
    assert.equal(match.objectId,'0');
    assert.equal(match.raster.w,5);
    assert.ok(match.svgPath && match.svgPath.length>0);
  });
  it('returns no matches for an empty response', () => assert.deepEqual(parseSamText(''), []));
});
