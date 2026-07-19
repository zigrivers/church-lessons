import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountLesson } from './dom';

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

let storage: Storage;

beforeEach(() => {
  document.body.innerHTML = `
    <button data-decision="wait" aria-pressed="false">Wait</button>
    <button data-reveal="claim-history" aria-expanded="false">Reveal</button>
    <div data-reveal-panel="claim-history" hidden>Evidence used beyond its limit</div>
    <button data-view-button="guide" aria-pressed="true">Guide</button>
    <button data-view-button="present" aria-pressed="false">Present</button>
    <button data-action="previous">Back</button>
    <button data-action="menu" aria-expanded="false">Menu</button>
    <span data-current-label></span>
    <span data-time-label></span>
    <div id="chapter-menu" hidden></div>
    <button data-action="next">Next</button>
    <button data-action="reset">Reset</button>
    <section id="offer"></section>
    <section id="board"></section>
    <section id="signal"></section>
    <section id="prayer"></section>
    <section id="book"></section>
    <section id="reform"></section>
    <section id="final-word"></section>
    <div data-announcer></div>`;
  document.documentElement.dataset.view = 'guide';
  storage = createMemoryStorage();
  Element.prototype.scrollIntoView = vi.fn();
});

describe('teacher controls', () => {
  it('selects decisions and reveals evidence', () => {
    const cleanup = mountLesson(document, storage);
    document.querySelector<HTMLButtonElement>('[data-decision="wait"]')?.click();
    document.querySelector<HTMLButtonElement>('[data-reveal="claim-history"]')?.click();
    expect(document.querySelector('[data-decision="wait"]')?.getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(document.querySelector('[data-reveal-panel="claim-history"]')?.hasAttribute('hidden')).toBe(
      false,
    );
    cleanup();
  });

  it('switches to Present view and reset restores Guide view', () => {
    const cleanup = mountLesson(document, storage);
    document.querySelector<HTMLButtonElement>('[data-view-button="present"]')?.click();
    expect(document.documentElement.dataset.view).toBe('present');
    document.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    expect(document.documentElement.dataset.view).toBe('guide');
    cleanup();
  });

  it('navigates chapters and enforces first and last boundaries', () => {
    const cleanup = mountLesson(document, storage);
    const back = document.querySelector<HTMLButtonElement>('[data-action="previous"]');
    const next = document.querySelector<HTMLButtonElement>('[data-action="next"]');
    const menu = document.querySelector<HTMLButtonElement>('[data-action="menu"]');

    expect(back?.disabled).toBe(true);
    expect(document.querySelector('[data-current-label]')?.textContent).toBe('The offer');
    expect(document.querySelector('[data-time-label]')?.textContent).toBe('0–4 min');

    next?.click();
    expect(document.querySelector('[data-current-label]')?.textContent).toBe('The board');
    expect(document.querySelector('[data-time-label]')?.textContent).toBe('4–8 min');

    menu?.click();
    expect(document.querySelectorAll('[data-chapter-target]')).toHaveLength(7);
    document.querySelector<HTMLButtonElement>('[data-chapter-target="final-word"]')?.click();
    expect(next?.disabled).toBe(true);
    expect(document.querySelector('[data-current-label]')?.textContent).toBe('Final word');
    cleanup();
  });
});
