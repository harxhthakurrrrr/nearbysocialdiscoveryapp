import { gsap } from 'gsap';

export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const staggerFadeIn = (elements, stagger = 0.1) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, stagger, ease: 'power3.out' }
  );
};

export const scaleUp = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, delay, ease: 'back.out(1.7)' }
  );
};
