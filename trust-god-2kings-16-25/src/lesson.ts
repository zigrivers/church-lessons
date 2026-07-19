export type ChapterId =
  | 'offer'
  | 'board'
  | 'signal'
  | 'prayer'
  | 'book'
  | 'reform'
  | 'final-word';

export interface LessonChapter {
  readonly id: ChapterId;
  readonly label: string;
  readonly minutes: number;
}

export const CHAPTERS: readonly LessonChapter[] = [
  { id: 'offer', label: 'The offer', minutes: 4 },
  { id: 'board', label: 'The board', minutes: 4 },
  { id: 'signal', label: 'Signal or noise?', minutes: 10 },
  { id: 'prayer', label: 'Spread out the letter', minutes: 10 },
  { id: 'book', label: 'The missing book', minutes: 10 },
  { id: 'reform', label: 'Read or reform?', minutes: 8 },
  { id: 'final-word', label: 'Final word', minutes: 4 },
] as const;

export function totalMinutes(chapters: readonly LessonChapter[]): number {
  return chapters.reduce((sum, chapter) => sum + chapter.minutes, 0);
}

export function validateChapters(chapters: readonly LessonChapter[]): string[] {
  const ids = chapters.map(({ id }) => id);
  const errors: string[] = [];
  if (new Set(ids).size !== ids.length) {
    errors.push('Chapter IDs must be unique.');
  }
  if (chapters.some(({ minutes }) => minutes <= 0)) {
    errors.push('Chapter minutes must be positive.');
  }
  if (totalMinutes(chapters) !== 50) {
    errors.push('Lesson must total 50 minutes.');
  }
  return errors;
}

export function chapterForElapsed(elapsedMinutes: number): LessonChapter {
  const bounded = Math.max(0, elapsedMinutes);
  let cursor = 0;
  for (const chapter of CHAPTERS) {
    cursor += chapter.minutes;
    if (bounded < cursor) {
      return chapter;
    }
  }
  return CHAPTERS[CHAPTERS.length - 1] as LessonChapter;
}
