import { describe, expect, it } from 'vitest';
import { CHAPTERS, chapterForElapsed, totalMinutes, validateChapters } from './lesson';

describe('lesson chapters', () => {
  it('fills exactly 50 minutes with unique ordered chapters', () => {
    expect(totalMinutes(CHAPTERS)).toBe(50);
    expect(CHAPTERS.map(({ id }) => id)).toEqual([
      'offer',
      'board',
      'signal',
      'prayer',
      'book',
      'reform',
      'final-word',
    ]);
    expect(validateChapters(CHAPTERS)).toEqual([]);
  });

  it('maps elapsed time to the active chapter', () => {
    expect(chapterForElapsed(0).id).toBe('offer');
    expect(chapterForElapsed(4).id).toBe('board');
    expect(chapterForElapsed(17).id).toBe('signal');
    expect(chapterForElapsed(49).id).toBe('final-word');
    expect(chapterForElapsed(500).id).toBe('final-word');
  });
});
