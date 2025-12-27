export default function PostSkeleton() {
    return (
      <div className="glass rounded-card p-4 space-y-3 animate-pulse">
        <div className="h-3 w-24 bg-surface rounded" />
        <div className="h-4 w-full bg-surface rounded" />
        <div className="h-4 w-5/6 bg-surface rounded" />
        <div className="h-40 w-full bg-surface rounded-lg" />
      </div>
    );
  }
  