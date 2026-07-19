import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_STATE,
  loadLessonState,
  reduceLessonState,
  resetLessonState,
  saveLessonState,
} from './state';

describe('lesson state', () => {
  it('selects a decision, reveals evidence, changes view, and navigates', () => {
    const decided = reduceLessonState(DEFAULT_STATE, { type: 'choose', decision: 'wait' });
    const revealed = reduceLessonState(decided, { type: 'reveal', id: 'claim-history' });
    const presented = reduceLessonState(revealed, { type: 'set-view', viewMode: 'present' });
    const navigated = reduceLessonState(presented, { type: 'go-to', chapter: 'prayer' });
    expect(navigated).toMatchObject({
      openingDecision: 'wait',
      revealedIds: ['claim-history'],
      viewMode: 'present',
      activeChapter: 'prayer',
    });
  });

  it('does not duplicate revealed IDs', () => {
    const once = reduceLessonState(DEFAULT_STATE, { type: 'reveal', id: 'claim-history' });
    expect(reduceLessonState(once, { type: 'reveal', id: 'claim-history' }).revealedIds).toEqual([
      'claim-history',
    ]);
  });

  it('loads valid state and fails closed for malformed storage', () => {
    const valid = {
      getItem: vi.fn(() => JSON.stringify({ ...DEFAULT_STATE, viewMode: 'present' })),
    };
    const invalid = { getItem: vi.fn(() => '{bad json') };
    expect(loadLessonState(valid).viewMode).toBe('present');
    expect(loadLessonState(invalid)).toEqual(DEFAULT_STATE);
  });

  it('rejects unknown persisted chapters and decisions', () => {
    const storage = {
      getItem: vi.fn(() =>
        JSON.stringify({
          ...DEFAULT_STATE,
          activeChapter: 'invented-chapter',
          openingDecision: 'panic',
        }),
      ),
    };

    expect(loadLessonState(storage)).toEqual(DEFAULT_STATE);
  });

  it('saves and resets only the lesson key', () => {
    const storage = { setItem: vi.fn(), removeItem: vi.fn() };
    saveLessonState(storage, DEFAULT_STATE);
    resetLessonState(storage);
    expect(storage.setItem).toHaveBeenCalledOnce();
    expect(storage.removeItem).toHaveBeenCalledWith('trust-under-pressure:v1');
  });
});
