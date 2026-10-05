function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-bg-surface-2 ${className}`} aria-hidden="true" />;
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" role="status" aria-label="Loading search results">
      {['Artists', 'Albums', 'Tracks'].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <SkeletonBlock className="h-4 w-20" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <SkeletonBlock className="h-12 w-12 shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <SkeletonBlock className="h-3 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ))}
      <span className="sr-only">Loading search results…</span>
    </div>
  );
}
