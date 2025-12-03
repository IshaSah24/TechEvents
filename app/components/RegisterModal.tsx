"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import {jwtDecode} from "jwt-decode";

interface RegisterModalProps {
  eventId: string;
  eventSlug: string;
  defaultTickets?: number;
  seatsAvailable: number;
  user?: { id: string; name?: string; email?: string } | null;
}

export default function RegisterModal({
  eventId,
  eventSlug,
  defaultTickets = 1,
  seatsAvailable,
  user,
}: RegisterModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState(defaultTickets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  function ensureAuth(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        `/event/${eventSlug}`
      )}`;
      return null;
    }

    try {
      const payload: any = jwtDecode(token);

      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token");
        window.location.href = `/login?redirect=${encodeURIComponent(
          `/event/${eventSlug}`
        )}`;
        return null;
      }
      return token;
    } catch {
      localStorage.removeItem("token");
      window.location.href = `/login?redirect=${encodeURIComponent(
        `/event/${eventSlug}`
      )}`;
      return null;
    }
  }

  async function submitBooking() {
    setError(null);

    if (tickets < 1) {
      setError("Choose at least 1 ticket");
      return;
    }
    if (tickets > seatsAvailable) {
      setError(`Only ${seatsAvailable} seats available`);
      return;
    }
    const token = ensureAuth();
    if (!token) return;

    const body = {
      eventId,
      tickets,
      totalAmount: 0,
      paymentStatus: "unpaid",
    };

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess(data.booking);
        setOpen(false);
        router.refresh();
        return;
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        setError(data.error || "Session expired. Please login again.");
        window.location.href = `/login?redirect=${encodeURIComponent(
          `/event/${eventSlug}`
        )}`;
        return;
      }

      if (res.status >= 400 && res.status < 500) {
        setError(data.error || "Booking failed. Please try again.");
        return;
      }

      setError(data.error || "Server error. Please try again later.");
    } catch (err: any) {
      setError(err?.message || "Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white border-0"
      >
        <Ticket className="h-5 w-5 mr-2" />
        Register Now
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#0f1724] rounded-lg p-6 w-full max-w-md text-white">
            <h3 className="text-lg font-semibold mb-4">Register for this event</h3>

            <div className="space-y-3 mb-4">
              <label className="block text-sm text-white/80">Tickets</label>
              <input
                type="number"
                min={1}
                max={seatsAvailable}
                value={tickets}
                onChange={(e) =>
                  setTickets(
                    Math.min(
                      Math.max(1, Number(e.target.value) || 1),
                      seatsAvailable
                    )
                  )
                }
                className="w-full p-2 rounded-md bg-[#111827] text-white"
              />
              <p className="text-xs text-white/60">Seats available: {seatsAvailable}</p>
            </div>

            {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

            <div className="flex gap-2">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={submitBooking} disabled={loading}>
                {loading ? "Registering..." : "Confirm Registration"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-md">
          Booking confirmed — ref: {success.bookingRef ?? success._id}
        </div>
        
      )}
    </>
  );
}
