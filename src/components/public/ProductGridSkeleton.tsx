export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-card rounded-lg overflow-hidden animate-pulse">
          {/* Image */}
          <div className="aspect-square w-full" style={{ background: 'linear-gradient(135deg,#ffffff 0%,#eef1f3 55%,#fff5f5 100%)' }} />
          {/* Content */}
          <div className="p-4 space-y-2">
            <div className="h-3.5 rounded-full w-4/5" style={{ background: '#eef1f3' }} />
            <div className="h-3 rounded-full w-3/5"  style={{ background: '#e5e8ea' }} />
            <div className="h-4 rounded-full w-2/5 mt-3" style={{ background: '#dcdee0' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
