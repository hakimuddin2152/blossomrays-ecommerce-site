import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils/formatPrice'

interface ProductJsonLdProps {
  product: Product
  url: string
}

export default function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? '',
    image: product.images?.[0] ?? '',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'BlossomRays',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'BlossomRays',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
