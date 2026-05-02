export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
        <p className="text-plum/50 text-sm font-dm-sans">Loading…</p>
      </div>
    </div>
  )
}
