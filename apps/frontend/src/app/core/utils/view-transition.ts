import { ChangeDetectorRef } from '@angular/core';

export type KmVtDirection = 'forward' | 'back' | 'replace';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function runViewTransition(
  cdr: ChangeDetectorRef,
  direction: KmVtDirection,
  update: () => void,
): void {
  const apply = (): void => {
    update();
    cdr.detectChanges();
  };

  const start = (document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }).startViewTransition;

  if (prefersReducedMotion() || typeof start !== 'function') {
    apply();
    return;
  }

  const root = document.documentElement;
  root.dataset['kmVt'] = direction;

  start.call(document, apply).finished.finally(() => {
    delete root.dataset['kmVt'];
  });
}
