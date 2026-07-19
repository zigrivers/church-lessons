import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MotionPolicy {
  textScrub: boolean;
  cardStack: boolean;
}

export function motionPolicy(reduced: boolean, width: number): MotionPolicy {
  if (reduced) {
    return { textScrub: false, cardStack: false };
  }
  return { textScrub: true, cardStack: width >= 900 };
}

export function setupMotion(root: Document, reduced: boolean): () => void {
  const policy = motionPolicy(reduced, root.defaultView?.innerWidth ?? 0);
  if (!policy.textScrub && !policy.cardStack) {
    return () => undefined;
  }

  const context = gsap.context(() => {
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-scrub-word]'));
    const copy = root.querySelector<HTMLElement>('[data-scrub-copy]');
    if (policy.textScrub && copy && words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: copy,
            start: 'top 82%',
            end: 'bottom 42%',
            scrub: 0.6,
          },
        },
      );
    }

    const stack = root.querySelector<HTMLElement>('[data-reform-stack]');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-reform-card]'));
    if (policy.cardStack && stack && cards.length > 1) {
      root.documentElement.classList.add('motion-stack');
      cards.forEach((card, index) => gsap.set(card, { zIndex: index + 1 }));
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: 'top top',
          end: `+=${cards.length * 320}`,
          pin: stack,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(1).forEach((card, index) => {
        timeline.fromTo(
          card,
          { yPercent: 115, scale: 0.96 },
          {
            yPercent: index * 3,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
          },
          index,
        );
      });
    }
  }, root.body);

  return () => {
    context.revert();
    root.documentElement.classList.remove('motion-stack');
  };
}
