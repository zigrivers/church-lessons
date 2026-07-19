import { describe, expect, it } from 'vitest';
import { motionPolicy } from './motion';

describe('motion policy', () => {
  it('disables scrubbing and stacking for reduced motion', () => {
    expect(motionPolicy(true, 1440)).toEqual({ textScrub: false, cardStack: false });
  });

  it('keeps readable text motion but uses a normal card list on narrow screens', () => {
    expect(motionPolicy(false, 390)).toEqual({ textScrub: true, cardStack: false });
  });

  it('enables both selected paradigms on projector screens', () => {
    expect(motionPolicy(false, 1440)).toEqual({ textScrub: true, cardStack: true });
  });
});
