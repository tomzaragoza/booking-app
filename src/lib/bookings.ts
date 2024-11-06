import { BookingIdType, BookingType } from "@/types";

/**
 *
 * Get all the bookings by firstName and lastName from external booking service
 *
 * @param firstName
 * @param lastName
 * @returns
 */
export async function getBookingsByName(
  firstName: string,
  lastName: string
): Promise<BookingType[]> {
  if (!firstName || !lastName) {
    return [];
  }

  const results = await fetch(
    `${process.env.BOOKER_URL}/booking?firstname=${firstName}&lastname=${lastName}`
  );
  const bookingsById: BookingIdType[] = await results.json();

  const bookings: BookingType[] = await Promise.all(
    bookingsById.map(async (booking: BookingIdType) => {
      const response = await fetch(
        `${process.env.BOOKER_URL}/booking/${booking.bookingid}`
      );
      const bookingResponse = await response.json();

      return { id: booking.bookingid, ...bookingResponse };
    })
  );

  const bookingsSortedByCheckIn = bookings.sort(
    (bookingA: BookingType, bookingB: BookingType) =>
      new Date(bookingA.bookingdates.checkin).getTime() -
      new Date(bookingB.bookingdates.checkin).getTime()
  );

  return bookingsSortedByCheckIn;
}

/**
 *
 * Get booking by id from external booking service
 *
 * @param bookingId
 * @returns
 */
export async function getBookingById(
  bookingId: string
): Promise<BookingType | undefined> {
  const response = await fetch(
    `${process.env.BOOKER_URL}/booking/${bookingId}`
  );
  if (!response.ok) {
    return;
  }

  const bookingResponse = await response.json();
  return { id: bookingId, ...bookingResponse };
}
