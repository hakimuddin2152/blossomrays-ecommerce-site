import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';

/**
 * INTERVIEW CONCEPT: Custom Attribute Directive
 *
 * A directive is a class that adds behaviour to a DOM element without
 * providing a template.  Three kinds:
 *
 *   • Component     — directive WITH a template (@Component extends @Directive)
 *   • Attribute     — changes appearance/behaviour of existing element (this file)
 *   • Structural    — reshapes the DOM (*ngIf, *ngFor, *ngSwitch)
 *
 * This is a STANDALONE attribute directive.  Apply it to any element that
 * should close/hide when the user clicks outside it:
 *
 *   <div appClickOutside (clickedOutside)="mobileOpen.set(false)">
 *     ...menu content...
 *   </div>
 *
 * How it works:
 *   @HostListener('document:click', ['$event.target'])
 *   listens to click events on the DOCUMENT (not just this element).
 *   ElementRef gives us access to the host DOM node so we can check
 *   whether the click landed inside or outside.
 *
 * Key APIs:
 *   @HostListener  — binds a DOM event on the host element OR a global
 *                    target (document, window, body).
 *   @Output        — exposes a custom event that parent templates can
 *                    listen to with (clickedOutside)="..."
 *   ElementRef     — wrapper around the raw DOM node; injected via inject().
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef);

  /** Emits when a click lands outside the host element. */
  @Output() clickedOutside = new EventEmitter<void>();

  /**
   * Listens to every click on the document.
   * @param target — the DOM element that was actually clicked.
   */
  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    const isInside = target instanceof Node && this.el.nativeElement.contains(target);
    if (!isInside) {
      this.clickedOutside.emit();
    }
  }
}
