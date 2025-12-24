export default function ProfileCard({ user }: { user: any }) {
  return (
    <div className="glass rounded-card p-4 space-y-1">
      <h2 className="text-sm font-semibold">
        {user.name}
      </h2>
      <p className="text-sm text-muted">
        {user.email}
      </p>
      <p className="text-sm text-muted">
        Age: {user.age}
      </p>
    </div>
  );
}
