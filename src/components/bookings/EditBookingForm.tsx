import { BookingContext } from "@/contexts/BookingContext";
import { BookingType } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string, options?: RequestInit) =>
  fetch(url, options).then((res) => res.json());

/**
 * Render a form for editing the booking details
 *
 * @param {BookingType} booking The booking data
 * @returns {ReactNode}
 */
export default function EditBookingForm({
  booking,
}: {
  booking: BookingType;
}): JSX.Element {
  const [datesChanged, setDatesChanged] = useState(false);
  const [needsChanged, setNeedsChanged] = useState(false);
  const {
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    additionalNeeds,
    setAdditionalNeeds,
    message,
  } = useContext(BookingContext);

  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const isDateValid =
    checkInDate &&
    checkOutDate &&
    new Date(checkInDate) < new Date(checkOutDate);

  const { data: bookings, error: bookingsError } = useSWR(
    datesChanged && checkInDate && checkOutDate
      ? `/api/bookings?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      : null,
    fetcher
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      additionalNeeds,
      ...(datesChanged && isDateValid
        ? {
            checkInDate,
            checkOutDate,
          }
        : {}),
    };

    await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    router.push("/bookings");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="checkInDate"
          className="block text-sm font-medium text-gray-900"
        >
          Check In Date
        </label>
        <input
          type="date"
          id="checkInDate"
          value={checkInDate}
          onChange={(e) => {
            setCheckInDate(e.target.value);
            setDatesChanged(true);
          }}
          required
          min={today}
          className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-zinc-600 focus:ring focus:ring-zinc-600 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="checkOutDate"
          className="block text-sm font-medium text-gray-900"
        >
          Check Out Date
        </label>
        <input
          type="date"
          id="checkOutDate"
          value={checkOutDate}
          onChange={(e) => {
            setCheckOutDate(e.target.value);
            setDatesChanged(true);
          }}
          required
          min={checkInDate || today}
          className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-zinc-600 focus:ring focus:ring-zinc-600 sm:text-sm"
        />
        {!isDateValid && checkInDate && checkOutDate && (
          <p className="text-red-500 text-sm mt-2">
            Check-in date must be earlier than check-out date.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="additionalNeeds"
          className="block text-sm font-medium text-gray-900"
        >
          Additional Needs (optional)
        </label>
        <textarea
          id="additionalNeeds"
          value={additionalNeeds}
          onChange={(e) => {
            setAdditionalNeeds(e.target.value);
            setNeedsChanged(true);
          }}
          className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-zinc-600 focus:ring focus:ring-zinc-600 sm:text-sm"
          placeholder="Any additional requests or needs"
        />
      </div>

      {bookings && (
        <p className="text-sm mt-2">
          {bookings.isAvailable && isDateValid
            ? "Dates are available!"
            : "Selected dates are not available. Please choose different dates."}
        </p>
      )}

      <div className="flex justify-end">
        <Link href="/bookings" className="px-3 py-2" passHref>
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!needsChanged && (!isDateValid || !bookings?.isAvailable)}
          className={`inline-flex justify-center rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            needsChanged || (isDateValid && bookings?.isAvailable)
              ? "bg-zinc-800 hover:bg-zinc-700 focus-visible:outline-zinc-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>

      {message && <p className="text-green-500 pt-4">{message}</p>}
    </form>
  );
}
