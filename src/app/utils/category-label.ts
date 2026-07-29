/**
 * Maps a product's raw `category` DB value (e.g. 'fragrance-oil') to the
 * translation key already used for the matching tab on the products page
 * (`products.tab.*` in translations.ts), so the category badge shown on
 * product cards / detail pages is translated instead of showing a raw
 * English DB slug regardless of the selected language.
 *
 * Returns `null` for car-freshener scent categories ('lavender' | 'rose' |
 * 'millennium') — these are proper nouns/product names and are
 * intentionally left untranslated, same as elsewhere in the app.
 */
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  'car-fresheners': 'products.tab.carFresheners',
  diffuser: 'products.tab.diffuser',
  'fragrance-oil': 'products.tab.fragranceOil',
  'essential-oil': 'products.tab.essentialOil',
  candle: 'products.tab.candle',
  perfume: 'products.tab.perfume',
  'ladies-bag': 'products.tab.ladiesBag',
};

export function categoryLabelKey(category: string): string | null {
  return CATEGORY_LABEL_KEYS[category] ?? null;
}
