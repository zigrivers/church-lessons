import { mountLesson } from './dom';
import { setupMotion } from './motion';

document.documentElement.classList.add('has-js');
const cleanupLesson = mountLesson(document, localStorage);
const cleanupMotion = setupMotion(
  document,
  window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);

window.addEventListener(
  'pagehide',
  () => {
    cleanupMotion();
    cleanupLesson();
  },
  { once: true },
);
