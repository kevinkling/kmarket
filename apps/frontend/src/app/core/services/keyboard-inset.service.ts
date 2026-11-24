import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';

const TEXT_INPUT_TYPES = new Set([
  'text', 'search', 'email', 'password', 'number', 'tel', 'url', '',
]);

/**
 * Sigue al teclado virtual en el celular.
 *
 * - `--km-kb-inset`: cuánto del layout viewport queda tapado por el teclado
 *   (iOS no achica el layout viewport; Android sí con interactive-widget).
 * - `--km-vv-height`: alto visible real.
 * - `html.km-keyboard-open`: hay un campo de texto enfocado.
 *
 * Además, cuando el teclado termina de abrir, lleva el campo enfocado a la
 * vista dentro de su contenedor scrolleable (p. ej. el bottom sheet).
 */
@Injectable({ providedIn: 'root' })
export class KeyboardInsetService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private started = false;
  private frame = 0;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;

  start(): void {
    const win = this.doc.defaultView;
    if (this.started || !win) return;
    this.started = true;

    this.zone.runOutsideAngular(() => {
      const vv = win.visualViewport;
      const schedule = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.update());
      };

      vv?.addEventListener('resize', () => {
        schedule();
        this.scheduleScrollIntoView();
      });
      vv?.addEventListener('scroll', schedule);
      win.addEventListener('resize', schedule);

      this.doc.addEventListener('focusin', (event) => {
        if (this.isTextField(event.target)) {
          this.doc.documentElement.classList.add('km-keyboard-open');
          this.scheduleScrollIntoView();
        }
        schedule();
      });
      this.doc.addEventListener('focusout', () => {
        // Esperamos un tick: si el foco pasa a otro campo no queremos parpadeo.
        setTimeout(() => {
          if (!this.isTextField(this.doc.activeElement)) {
            this.doc.documentElement.classList.remove('km-keyboard-open');
          }
          schedule();
        }, 50);
      });

      this.update();
    });
  }

  private update(): void {
    const win = this.doc.defaultView;
    const vv = win?.visualViewport;
    const root = this.doc.documentElement;
    if (!win || !vv) return;

    const inset = Math.max(0, Math.round(win.innerHeight - vv.height - vv.offsetTop));
    root.style.setProperty('--km-kb-inset', `${inset}px`);
    root.style.setProperty('--km-vv-height', `${Math.round(vv.height)}px`);
  }

  private scheduleScrollIntoView(): void {
    clearTimeout(this.scrollTimer);
    // El teclado tarda ~250-300ms en terminar de abrir.
    this.scrollTimer = setTimeout(() => {
      const el = this.doc.activeElement;
      if (!this.isTextField(el)) return;
      (el as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 320);
  }

  private isTextField(target: EventTarget | Element | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    if (target instanceof HTMLTextAreaElement) return true;
    if (target instanceof HTMLInputElement) return TEXT_INPUT_TYPES.has(target.type);
    return target.isContentEditable;
  }
}
