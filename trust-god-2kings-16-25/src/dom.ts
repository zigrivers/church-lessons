import { CHAPTERS, type ChapterId } from './lesson';
import {
  DEFAULT_STATE,
  loadLessonState,
  reduceLessonState,
  resetLessonState,
  saveLessonState,
  type Decision,
  type LessonAction,
  type LessonState,
  type ViewMode,
} from './state';

function chapterIndex(chapter: ChapterId): number {
  return CHAPTERS.findIndex(({ id }) => id === chapter);
}

function timeRange(index: number): string {
  const start = CHAPTERS.slice(0, index).reduce((sum, chapter) => sum + chapter.minutes, 0);
  const chapter = CHAPTERS[index];
  return `${start}–${start + (chapter?.minutes ?? 0)} min`;
}

function buildChapterMenu(root: Document): void {
  const menu = root.getElementById('chapter-menu');
  if (!menu || menu.children.length > 0) {
    return;
  }
  const fragment = root.createDocumentFragment();
  CHAPTERS.forEach((chapter) => {
    const button = root.createElement('button');
    button.type = 'button';
    button.dataset.chapterTarget = chapter.id;
    button.textContent = chapter.label;
    fragment.append(button);
  });
  menu.append(fragment);
}

export function mountLesson(root: Document, storage: Storage): () => void {
  let state: LessonState = loadLessonState(storage);
  let menuOpen = false;
  buildChapterMenu(root);

  const announce = (message: string): void => {
    const region = root.querySelector<HTMLElement>('[data-announcer]');
    if (region) {
      region.textContent = message;
    }
  };

  const render = (): void => {
    root.documentElement.dataset.view = state.viewMode;

    root.querySelectorAll<HTMLElement>('[data-view-button]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.viewButton === state.viewMode));
    });

    root.querySelectorAll<HTMLElement>('[data-decision]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.decision === state.openingDecision));
    });

    root.querySelectorAll<HTMLElement>('[data-reveal-panel]').forEach((panel) => {
      panel.toggleAttribute('hidden', !state.revealedIds.includes(panel.dataset.revealPanel ?? ''));
    });

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((button) => {
      button.setAttribute(
        'aria-expanded',
        String(state.revealedIds.includes(button.dataset.reveal ?? '')),
      );
    });

    const index = Math.max(0, chapterIndex(state.activeChapter));
    const active = CHAPTERS[index] ?? CHAPTERS[0];
    const label = root.querySelector<HTMLElement>('[data-current-label]');
    const time = root.querySelector<HTMLElement>('[data-time-label]');
    if (label && active) {
      label.textContent = active.label;
    }
    if (time) {
      time.textContent = timeRange(index);
    }

    const previous = root.querySelector<HTMLButtonElement>('[data-action="previous"]');
    const next = root.querySelector<HTMLButtonElement>('[data-action="next"]');
    if (previous) {
      previous.disabled = index === 0;
    }
    if (next) {
      next.disabled = index === CHAPTERS.length - 1;
    }

    const menuButton = root.querySelector<HTMLElement>('[data-action="menu"]');
    const menu = root.getElementById('chapter-menu');
    menuButton?.setAttribute('aria-expanded', String(menuOpen));
    menu?.toggleAttribute('hidden', !menuOpen);
    root.querySelectorAll<HTMLElement>('[data-chapter-target]').forEach((button) => {
      if (button.dataset.chapterTarget === state.activeChapter) {
        button.setAttribute('aria-current', 'step');
      } else {
        button.removeAttribute('aria-current');
      }
    });

    saveLessonState(storage, state);
  };

  const dispatch = (action: LessonAction, message: string): void => {
    state = reduceLessonState(state, action);
    render();
    announce(message);
  };

  const goToChapter = (chapter: ChapterId): void => {
    const match = CHAPTERS.find(({ id }) => id === chapter);
    if (!match) {
      return;
    }
    menuOpen = false;
    dispatch({ type: 'go-to', chapter }, `${match.label} chapter.`);
    root.getElementById(chapter)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const moveChapter = (offset: -1 | 1): void => {
    const current = Math.max(0, chapterIndex(state.activeChapter));
    const destination = CHAPTERS[current + offset];
    if (destination) {
      goToChapter(destination.id);
    }
  };

  const onClick = (event: Event): void => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const target = event.target.closest<HTMLElement>('button, a');
    if (!target) {
      return;
    }

    if (target.dataset.decision) {
      dispatch(
        { type: 'choose', decision: target.dataset.decision as Decision },
        `Decision selected: ${target.textContent?.trim() ?? ''}`,
      );
      return;
    }

    if (target.dataset.reveal) {
      dispatch({ type: 'reveal', id: target.dataset.reveal }, 'Evidence revealed.');
      return;
    }

    if (target.dataset.viewButton) {
      dispatch(
        { type: 'set-view', viewMode: target.dataset.viewButton as ViewMode },
        `${target.textContent?.trim() ?? ''} view active.`,
      );
      return;
    }

    if (target.dataset.chapterTarget) {
      goToChapter(target.dataset.chapterTarget as ChapterId);
      return;
    }

    switch (target.dataset.action) {
      case 'previous':
        moveChapter(-1);
        break;
      case 'next':
        moveChapter(1);
        break;
      case 'menu':
        menuOpen = !menuOpen;
        render();
        break;
      case 'reset':
        resetLessonState(storage);
        state = DEFAULT_STATE;
        menuOpen = false;
        render();
        announce('Lesson reset.');
        break;
      case 'print':
        root.defaultView?.print();
        break;
    }
  };

  root.addEventListener('click', onClick);
  render();
  return () => root.removeEventListener('click', onClick);
}
