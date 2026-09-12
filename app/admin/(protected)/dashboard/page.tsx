import { auth } from "@/auth";
import { destinations, packages } from "@/lib/dummy-data";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">
        Welcome, {session?.user?.name}
      </h1>
      <p className="text-zinc-600 mb-8">Here&apos;s an overview of your site.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Total Bookings</p>
          <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">—</p>
          <p className="text-xs text-zinc-400 mt-1">Coming soon</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Destinations</p>
          <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">{destinations.length}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">Packages</p>
          <p className="text-3xl font-heading font-bold text-zinc-900 mt-2">{packages.length}</p>
        </div>
      </div>
    </div>
  );
}