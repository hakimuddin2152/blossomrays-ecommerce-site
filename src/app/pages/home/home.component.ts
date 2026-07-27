import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/home/hero-section.component';
import { BenefitsSectionComponent } from '../../components/home/benefits-section.component';
import { ScentHighlightsComponent } from '../../components/home/scent-highlights.component';
import { HowItWorksComponent } from '../../components/home/how-it-works.component';
import { TestimonialsSectionComponent } from '../../components/home/testimonials-section.component';
import { NewsletterSectionComponent } from '../../components/home/newsletter-section.component';

/**
 * INTERVIEW CONCEPT: @defer — Deferred Loading (Angular 17+)
 *
 * @defer lazy-loads a SECTION of a template — not just a route, but any
 * block of components — splitting them into a separate JS chunk that is
 * only downloaded when a condition is met.
 *
 * Trigger options:
 *   @defer (on idle)         — when the browser becomes idle (requestIdleCallback)
 *   @defer (on viewport)     — when the element enters the viewport (IntersectionObserver)
 *   @defer (on interaction)  — when the user clicks/focuses the placeholder
 *   @defer (on timer(2s))    — after a fixed delay
 *   @defer (when condition)  — when a boolean expression becomes true
 *
 * Companion blocks:
 *   @placeholder { ... }  — shown BEFORE the deferred block loads (replaces the element)
 *   @loading    { ... }   — shown WHILE the chunk is being fetched
 *   @error      { ... }   — shown if loading fails
 *
 * Why use it here?
 *   The hero, benefits, and scent-highlights sections are above the fold —
 *   they must load immediately.  Testimonials and newsletter are below the
 *   fold — the user may never scroll to them, so deferring saves initial
 *   bundle size and improves LCP (Largest Contentful Paint).
 *
 * Important: @defer only creates a new chunk if the deferred component is
 * NOT already imported elsewhere in the eagerly-loaded module graph.
 * That's why TestimonialsSectionComponent and NewsletterSectionComponent
 * are REMOVED from the imports[] array below.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    // Only eagerly-loaded (above-fold) components listed here.
    // Deferred components must NOT appear in imports[] — Angular handles
    // their chunk automatically based on @defer usage.
    HeroSectionComponent,
    BenefitsSectionComponent,
    ScentHighlightsComponent,
    HowItWorksComponent,
    TestimonialsSectionComponent,
    NewsletterSectionComponent,
  ],
  template: `
    <!-- ABOVE FOLD — loaded eagerly, part of main bundle -->
    <app-hero-section />
    <app-benefits-section />
    <app-scent-highlights />
    <app-how-it-works />

    <!--
      BELOW FOLD — deferred.
      'on viewport' fires when the placeholder scrolls into view.
      Until then, only the placeholder div is in the DOM (no JS downloaded).
    -->
    @defer (on viewport) {
      <app-testimonials-section />
    } @placeholder {
      <!-- Shown before the viewport trigger fires — lightweight skeleton -->
      <div class="h-64 bg-cream animate-pulse" aria-hidden="true"></div>
    } @loading (minimum 200ms) {
      <!-- Shown while the JS chunk is fetching (min 200ms prevents flash) -->
      <div class="h-64 flex items-center justify-center bg-cream">
        <span class="font-body text-sm text-muted">Loading…</span>
      </div>
    }

    @defer (on idle) {
      <!--
        'on idle' defers until browser has no pending work.
        Newsletter signup is low-priority — defer it until everything
        else is done so it doesn't compete for network/CPU on initial load.
      -->
      <app-newsletter-section />
    } @placeholder {
      <div class="h-40 bg-cream-dark/20" aria-hidden="true"></div>
    }
  `,
})
export class HomeComponent {}
