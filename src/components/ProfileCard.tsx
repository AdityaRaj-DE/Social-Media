export default function ProfileCard({ user }: { user: any }) {
    return (
      <div className="border rounded p-4 bg-white">
        <h2 className="font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-600">Age: {user.age}</p>
      </div>
    );
  }
  