import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDoc = await getCurrentUser();

  if (!userDoc) {
    throw new Error("Unauthorized");
  }

  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    profilePic: userDoc.profilePic,
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top Navigation (Desktop / Global) */}
      <Navbar user={user} />

      {/* Page Content */}
      {children}
    </div>
  );
}
