import BookingCard from "@/components/bookings/BookingCard";
import { getBookingsByName } from "@/lib/bookings";
import { BookingType } from "@/types";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useState } from "react";

/**
 * Get all bookings based on the "logged in" user's name
 * @param context
 * @returns
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { firstName, lastName } = context.req.cookies;

  if (!firstName || !lastName) {
    return {
      props: { bookings: [] },
    };
  }

  const bookings = await getBookingsByName(firstName, lastName);

  return {
    props: { bookings },
  };
}

/**
 * Renders a page for viewing all bookings
 *
 * @param {BookingType[]}
 * @returns
 */
export default function BookingsPage({
  bookings: initialBookings,
}: {
  bookings: BookingType[];
}) {
  const [bookings, setBookings] = useState<BookingType[]>(initialBookings);

  // Remove bookings from DOM as they are deleted from external service
  function removeBooking(id: number) {
    setBookings((prevBookings) =>
      prevBookings.filter((booking: BookingType) => booking.id !== id)
    );
  }

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl">Bookings</h1>
        {bookings.length > 0 && (
          <Link
            href="/bookings/new"
            className="inline-flex justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
          >
            + New Booking
          </Link>
        )}
      </div>

      <div>
        {bookings.length > 0 ? (
          <>
            {bookings.map((booking: BookingType) => (
              <BookingCard
                booking={booking}
                key={booking.id}
                onDelete={() => removeBooking(booking.id)}
              />
            ))}
          </>
        ) : (
          <>
            <p className="text-black pb-8">No bookings yet!</p>
            <Link
              href="/bookings/new"
              className="inline-flex justify-center rounded-md bg-zinc-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
            >
              + Create a Booking
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
