export default function FeedPostSkeleton() {
    return (
      <div className="glass rounded-card p-4 space-y-3 animate-pulse">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-surface" />
          <div className="h-3 w-24 rounded bg-surface" />
        </div>
  
        {/* Content */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-surface" />
          <div className="h-3 w-5/6 rounded bg-surface" />
        </div>
  
        {/* Image placeholder */}
        <div className="h-48 w-full rounded-lg bg-surface" />
  
        {/* Actions */}
        <div className="flex gap-6 pt-2">
          <div className="h-4 w-12 rounded bg-surface" />
          <div className="h-4 w-12 rounded bg-surface" />
        </div>
      </div>
    );
  }
  