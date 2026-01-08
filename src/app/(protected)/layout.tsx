import MobileShell from "@/components/MobileShell";
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import { getCurrentUser } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDoc = await getCurrentUser();
  if (!userDoc) throw new Error("Unauthorized");

  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    profilePic: userDoc.profilePic,
  };

  return (
    <MobileShell>
    <div className="min-h-screen bg-bg text-text pb-14">
      <Topbar/>
      {children}
      <Navbar user={user} />
    </div>
    </MobileShell>
  );
}
