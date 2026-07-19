import type { ChapterId } from './lesson';

export type ViewMode = 'guide' | 'present';
export type Decision = 'surrender' | 'wait' | 'resist';

export interface LessonState {
  readonly activeChapter: ChapterId;
  readonly viewMode: ViewMode;
  readonly openingDecision?: Decision;
  readonly revealedIds: readonly string[];
}

export type LessonAction =
  | { readonly type: 'choose'; readonly decision: Decision }
  | { readonly type: 'reveal'; readonly id: string }
  | { readonly type: 'set-view'; readonly viewMode: ViewMode }
  | { readonly type: 'go-to'; readonly chapter: ChapterId }
  | { readonly type: 'reset' };

export const STORAGE_KEY = 'trust-under-pressure:v1';
export const DEFAULT_STATE: LessonState = {
  activeChapter: 'offer',
  viewMode: 'guide',
  revealedIds: [],
};

export function reduceLessonState(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'choose':
      return { ...state, openingDecision: action.decision };
    case 'reveal':
      return state.revealedIds.includes(action.id)
        ? state
        : { ...state, revealedIds: [...state.revealedIds, action.id] };
    case 'set-view':
      return { ...state, viewMode: action.viewMode };
    case 'go-to':
      return { ...state, activeChapter: action.chapter };
    case 'reset':
      return DEFAULT_STATE;
  }
}

interface ReadStorage {
  getItem(key: string): string | null;
}

interface WriteStorage {
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function loadLessonState(storage: ReadStorage): LessonState {
  try {
    const value: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
    if (!value || typeof value !== 'object') {
      return DEFAULT_STATE;
    }
    const candidate = value as Partial<LessonState>;
    return {
      activeChapter: candidate.activeChapter ?? DEFAULT_STATE.activeChapter,
      viewMode: candidate.viewMode === 'present' ? 'present' : 'guide',
      openingDecision: candidate.openingDecision,
      revealedIds: Array.isArray(candidate.revealedIds)
        ? candidate.revealedIds.filter((id): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveLessonState(
  storage: Pick<WriteStorage, 'setItem'>,
  state: LessonState,
): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The lesson remains usable when browser storage is unavailable.
  }
}

export function resetLessonState(storage: Pick<WriteStorage, 'removeItem'>): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // The lesson remains usable when browser storage is unavailable.
  }
}
