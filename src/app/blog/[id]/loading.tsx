export default function Loading() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      {/* Back button skeleton */}
      <div className="mb-6 w-32 h-6 bg-gray-200 rounded animate-pulse" />
      
      <div className="space-y-8">
        {/* Title skeleton */}
        <div className="w-3/4 h-12 bg-gray-200 rounded animate-pulse" />
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}