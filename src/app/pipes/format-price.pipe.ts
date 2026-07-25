import { Pipe, PipeTransform } from '@angular/core';

/**
 * INTERVIEW CONCEPT: Custom Pipe
 *
 * A pure pipe (default) is memoised — Angular only re-runs it when the
 * input reference changes, making it safe and efficient in OnPush trees.
 *
 * Usage in template:  {{ product.price | formatPrice }}
 */
@Pipe({
  name: 'formatPrice',
  standalone: true,
  pure: true, // default; re-runs only when `cents` changes
})
export class FormatPricePipe implements PipeTransform {
  transform(cents: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(cents / 100);
  }
}
