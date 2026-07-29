import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../utils/format-price';
import type { Currency } from '../services/locale.service';

/**
 * INTERVIEW CONCEPT: Custom Pipe
 *
 * A pure pipe (default) is memoised — Angular only re-runs it when the
 * input reference changes, making it safe and efficient in OnPush trees.
 * Passing `currency` as an explicit second argument (rather than reading a
 * signal inside the pipe) is what makes it re-evaluate when the visitor
 * switches currency, since pure pipes only recompute when an argument changes.
 *
 * Usage in template:  {{ product.price | formatPrice: locale.currency() }}
 */
@Pipe({
  name: 'formatPrice',
  standalone: true,
  pure: true, // default; re-runs only when `cents`/`currency` change
})
export class FormatPricePipe implements PipeTransform {
  transform(cents: number, currency?: Currency): string {
    return formatPrice(cents, currency);
  }
}
