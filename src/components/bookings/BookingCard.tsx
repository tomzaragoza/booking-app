import { BookingType } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface BookingCardProps {
  booking: BookingType;
  onDelete: () => void;
}

/**
 *
 * Render a card with booking details
 *
 * @param {BookingCardProps}
 * @returns
 */
export default function BookingCard({ booking, onDelete }: BookingCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function deleteBooking() {
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDelete();
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow lg:w-1/2 mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="pb-4">Booking #{booking.id}</h3>
        <p>Check In: {booking.bookingdates.checkin}</p>
        <p>Check Out: {booking.bookingdates.checkout}</p>
        <p>Additional Needs: {booking.additionalneeds}</p>
      </div>
      <div className="px-4 py-3 flex justify-end space-x-2">
        {confirmDelete ? (
          <>
            <button
              onClick={deleteBooking}
              className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="inline-flex justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Delete
          </button>
        )}
        <Link
          href={`/bookings/${booking.id}/edit`}
          className="inline-flex justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
