import { BookingProvider } from "@/contexts/BookingContext";
import EditBookingForm from "@/components/bookings/EditBookingForm";
import { GetServerSidePropsContext } from "next";
import { BookingType } from "@/types";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

/**
 * Get the booking details if they exist
 * @param context
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };

  const response = await fetch(`${process.env.BOOKER_URL}/booking/${id}`);
  if (!response.ok) {
    return {
      notFound: true,
    };
  }

  const bookingResponse = await response.json();
  const booking: BookingType = { id, ...bookingResponse };

  return {
    props: { booking },
  };
}

/**
 * Renders a page for editing booking details
 *
 * @param {BookingType}
 * @returns
 */
export default function EditBookingPage({
  booking,
}: {
  booking: BookingType;
}): JSX.Element {
  const router = useRouter();

  return (
    <BookingProvider
      initialBooking={{
        checkInDate: booking.bookingdates.checkin,
        checkOutDate: booking.bookingdates.checkout,
        additionalNeeds: booking.additionalneeds,
      }}
    >
      <div className="pt-10">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push("/bookings")}
            className="mr-2 text-gray-600 hover:text-gray-800"
            aria-label="Back to bookings"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-xl">Edit Booking #{booking.id}</h1>
        </div>
        <div className="lg:w-1/2 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-6 py-8">
            <EditBookingForm booking={booking} />
          </div>
        </div>
      </div>
    </BookingProvider>
  );
}
