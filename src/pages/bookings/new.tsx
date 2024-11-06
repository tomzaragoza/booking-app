// NewBookingPage.tsx
import { BookingProvider } from "@/contexts/BookingContext";
import NewBookingForm from "@/components/bookings/NewBookingForm";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

export default function NewBookingPage() {
  const router = useRouter();

  return (
    <BookingProvider>
      <div className="pt-10">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push("/bookings")}
            className="mr-2 text-gray-600 hover:text-gray-800"
            aria-label="Back to bookings"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-xl">New Booking</h1>
        </div>
        <div className="lg:w-1/2 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-6 py-8">
            <NewBookingForm />
          </div>
        </div>
      </div>
    </BookingProvider>
  );
}
