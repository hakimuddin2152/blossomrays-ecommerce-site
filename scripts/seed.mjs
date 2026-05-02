import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ujppjsblwfmwlmucxmet.supabase.co',
  'sb_secret_tuY2NPy6876aFBBsWsCDAA_DJX6lmiM'
)

const products = [
  {
    name: 'Rose Car Air Freshener',
    slug: 'rose-car-air-freshener',
    tagline: 'Bloom on the road',
    description: 'Bring the romance of a rose garden into your car. Our Fresh Rose Car Air Freshener delivers a rich, authentic floral scent that lingers beautifully throughout the day. Alcohol-free formula with a gorgeous wooden cap and vent clip design. Proudly made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'rose',
    is_active: true,
    images: [
      '/images/rose/Main_Image_Rose.jpg',
      '/images/rose/Main_Image.jpeg',
      '/images/rose/Main_Image_With_Prod_Of_Canada.jpg',
      '/images/rose/Dual_Ways.jpg',
      '/images/rose/Fragrance_Details.jpeg',
      '/images/rose/MultiUses.jpg',
      '/images/rose/Whats_In_The_Pack.jpeg',
      '/images/rose/Main_Without_Rose.jpeg',
    ],
    seo_title: 'Fresh Rose Car Air Freshener | BlossomRays',
    seo_description: 'Premium botanical rose car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
  },
  {
    name: 'Lavender Car Air Freshener',
    slug: 'lavender-car-air-freshener',
    tagline: 'Calm your commute',
    description: 'Transform every drive into a serene escape. Our Lavender Car Air Freshener releases a gentle, long-lasting botanical lavender fragrance that soothes the mind and freshens your car naturally. Crafted with premium fragrance oils, an elegant wooden cap, and a double-sealed 8ml glass bottle. Proudly made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'lavender',
    is_active: true,
    images: [
      '/images/lavender/1.jpg',
      '/images/lavender/2.jpg',
      '/images/lavender/3.jpg',
      '/images/lavender/4.jpg',
      '/images/lavender/5.jpg',
      '/images/lavender/6.jpg',
      '/images/lavender/7.jpg',
      '/images/lavender/8.jpg',
    ],
    seo_title: 'Lavender Car Air Freshener | BlossomRays',
    seo_description: 'Premium botanical lavender car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
  },
  {
    name: 'Millennium Car Air Freshener',
    slug: 'millennium-car-air-freshener',
    tagline: 'A scent beyond time',
    description: 'Elevate your drive with the signature Millennium fragrance — a refined, mysterious blend that transforms your daily commute. Premium wooden cap, double-sealed 8ml glass bottle, versatile vent clip or hanging installation. Long-lasting, alcohol-free, and proudly made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'millennium',
    is_active: true,
    images: [
      '/images/millenium/1.jpg',
      '/images/millenium/2.jpg',
      '/images/millenium/3.jpg',
      '/images/millenium/4.jpg',
      '/images/millenium/5.jpg',
      '/images/millenium/6.jpg',
      '/images/millenium/7.jpg',
      '/images/millenium/8.jpg',
    ],
    seo_title: 'Millennium Car Air Freshener | BlossomRays',
    seo_description: 'Premium Millennium scent car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
  },
]

const { data, error } = await supabase
  .from('products')
  .upsert(products, { onConflict: 'slug' })
  .select('id, name, slug')

if (error) {
  console.error('ERROR:', error.message, error.details)
  process.exit(1)
} else {
  console.log('Seeded products:')
  data.forEach(p => console.log(`  ✓ ${p.name} (${p.slug})`))
}
