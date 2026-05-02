'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Product } from '@/types'

const ProductSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().int().positive(),
  compare_at_price: z.coerce.number().int().positive().optional().or(z.literal('')),
  stock: z.coerce.number().int().min(0),
  is_active: z.boolean(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
})

type ProductForm = z.infer<typeof ProductSchema>

export default function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      tagline: product.tagline ?? '',
      description: product.description ?? '',
      price: product.price,
      compare_at_price: product.compare_at_price ?? '',
      stock: product.stock,
      is_active: product.is_active,
      seo_title: product.seo_title ?? '',
      seo_description: product.seo_description ?? '',
    },
  })

  const onSubmit = async (data: ProductForm) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        compare_at_price: data.compare_at_price === '' ? null : data.compare_at_price,
      }),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Failed to save')
    } else {
      setSuccess(true)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Product Name" error={errors.name?.message} {...register('name')} />
        <Input label="Tagline" {...register('tagline')} />
      </div>

      <div>
        <label className="block text-sm font-body font-medium text-plum mb-1.5">Description</label>
        <textarea
          className="input-field min-h-[120px] resize-y"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input
          label="Price (cents)"
          type="number"
          hint="e.g. 1299 = $12.99"
          error={errors.price?.message}
          {...register('price')}
        />
        <Input
          label="Compare-at (cents)"
          type="number"
          hint="Leave blank to hide"
          {...register('compare_at_price')}
        />
        <Input
          label="Stock"
          type="number"
          error={errors.stock?.message}
          {...register('stock')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="SEO Title" {...register('seo_title')} />
        <Input label="SEO Description" {...register('seo_description')} />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          className="w-4 h-4 accent-lavender rounded"
          {...register('is_active')}
        />
        <label htmlFor="is_active" className="font-body text-sm text-plum">
          Product is active (visible on storefront)
        </label>
      </div>

      {error && (
        <p className="text-sm font-body text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">{error}</p>
      )}
      {success && (
        <p className="text-sm font-body text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
          ✓ Product saved successfully
        </p>
      )}

      <Button type="submit" loading={saving}>
        Save Changes
      </Button>
    </form>
  )
}
