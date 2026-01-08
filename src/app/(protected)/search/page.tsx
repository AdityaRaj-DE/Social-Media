import MobileShell from "@/components/MobileShell";
import SearchTabs from "@/components/SearchTabs";

export default function SearchPage() {
  return (
    <MobileShell>
    <div className="min-h-screen mt-12 bg-bg text-text px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <SearchTabs />
      </div>
    </div>
    </MobileShell>
  );
}
