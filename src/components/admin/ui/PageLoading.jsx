export default function PageLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Card skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Filter skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-50 rounded-lg" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-50/50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
