import ProductGridSkeleton from '@/components/public/ProductGridSkeleton'

export default function Loading() {
  return (
    <div className="public-page-bg min-h-screen">
      {/* Header skeleton */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg,#ffffff 0%,#f7fafc 55%,#eef1f3 100%)' }}>
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="h-3 w-20 rounded-full animate-pulse" style={{ background: '#dcdee0' }} />
          <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: '#eef1f3' }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search skeleton */}
        <div className="h-11 max-w-lg rounded-lg mb-6 animate-pulse" style={{ background: '#eef1f3' }} />
        {/* Filter skeleton */}
        <div className="flex gap-2 mb-8">
          {[80, 110, 100, 120, 95].map(w => (
            <div key={w} className="h-8 rounded-full animate-pulse" style={{ width: w, background: '#eef1f3' }} />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}
