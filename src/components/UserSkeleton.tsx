export default function UserSkeleton() {
    return (
      <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
        <div className="h-9 w-9 rounded-full bg-surface" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 rounded bg-surface" />
          <div className="h-2 w-20 rounded bg-surface" />
        </div>
      </div>
    );
  }
  