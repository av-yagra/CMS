"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Mail,
  Phone,
  Globe,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { AdminPackage } from "@/types/package";

type Booking = {
  _id: string;
  packageId: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  travelers: number;
  expectedDate: string;
  details?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
};

const statusStyles: Record<Booking["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-primary/10 text-primary border-primary/20",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [resBookings, resPackages] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/packages")
        ]);
        const dataB = await resBookings.json();
        const dataP = await resPackages.json();

        if (!resBookings.ok) {
          setError(dataB.message ?? "Failed to load bookings");
          return;
        }

        setBookings(dataB.bookings ?? []);
        setPackages(dataP.packages ?? []);
      } catch {
        setError("Could not reach the server");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  function packageTitle(packageId: string) {
    return packages.find((p) => p.id === packageId)?.title ?? packageId;
  }

  async function updateStatus(id: string, status: Booking["status"]) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message ?? "Failed to update booking");
        return;
      }

      // Update just this one booking in local state, instead of refetching everything
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: data.booking.status } : b,
        ),
      );
    } catch {
      alert("Could not reach the server");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-1">
        Bookings
      </h1>
      <p className="text-zinc-600 mb-8">
        All customer booking requests, newest first.
      </p>

      {loading ? (
        <p className="text-zinc-500">Loading bookings...</p>
      ) : error ? (
        <p className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm">
          {error}
        </p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-black/5 bg-white">
          <p className="text-zinc-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/5 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs text-zinc-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Package</th>
                  <th className="px-5 py-3 font-medium">Travelers</th>
                  <th className="px-5 py-3 font-medium">Expected Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-black/5 last:border-0 align-top"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-900">
                        {booking.name}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <Mail size={12} /> {booking.email}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} /> {booking.phone}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Globe size={12} /> {booking.nationality}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-700">
                      {packageTitle(booking.packageId)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <Users size={14} className="text-zinc-400" />
                        {booking.travelers}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <CalendarDays size={14} className="text-zinc-400" />
                        {booking.expectedDate}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {updatingId === booking._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-zinc-400"
                        />
                      ) : booking.status === "Pending" ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Confirmed")
                            }
                            title="Confirm"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "Cancelled")
                            }
                            title="Cancel"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">
                          Final
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
