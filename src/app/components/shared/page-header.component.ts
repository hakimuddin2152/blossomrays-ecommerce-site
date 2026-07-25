import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * INTERVIEW CONCEPT: Content Projection (ng-content)
 *
 * ng-content lets a parent inject arbitrary HTML/components into a child's
 * template — the Angular equivalent of React's `children` prop.
 *
 * Named slots (select attribute) let you project into specific zones.
 * The default <ng-content> catches anything not matched by a named slot.
 *
 * Usage in a parent template:
 *
 *   <app-page-header>
 *     <span eyebrow>Our Collection</span>      ← fills [eyebrow] slot
 *     <span title>Shop All Products</span>     ← fills [title] slot
 *     <span subtitle>Browse our range</span>   ← fills [subtitle] slot
 *   </app-page-header>
 *
 * Why use it here:
 *   Every page (Products, Account, Admin) needs a consistent header block.
 *   Instead of duplicating the wrapper HTML, each page projects its own
 *   text content in — one place to update styling.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-b border-cream-dark bg-white px-4 sm:px-6 py-10">
      <div class="max-w-7xl mx-auto">
        <!-- Named slot: eyebrow label above the title -->
        <p class="section-eyebrow mb-2">
          <ng-content select="[eyebrow]" />
        </p>

        <!-- Named slot: main heading -->
        <h1 class="font-display text-4xl font-semibold text-plum">
          <ng-content select="[title]" />
        </h1>

        <!-- Default slot: optional subtitle / any extra content -->
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {}
