import React, { createContext, useState, ReactNode } from "react";

interface BookingContextProps {
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  additionalNeeds: string;
  setAdditionalNeeds: (needs: string) => void;
  message: string;
  setMessage: (status: string) => void;
}

interface BookingProviderProps {
  children: ReactNode;
  initialBooking?: {
    checkInDate: string;
    checkOutDate: string;
    additionalNeeds: string;
  };
}

const defaultContext: BookingContextProps = {
  checkInDate: "",
  setCheckInDate: () => {},
  checkOutDate: "",
  setCheckOutDate: () => {},
  additionalNeeds: "",
  setAdditionalNeeds: () => {},
  message: "",
  setMessage: () => {},
};

export const BookingContext =
  createContext<BookingContextProps>(defaultContext);

export const BookingProvider = ({
  children,
  initialBooking,
}: BookingProviderProps) => {
  const [checkInDate, setCheckInDate] = useState(
    initialBooking?.checkInDate || ""
  );
  const [checkOutDate, setCheckOutDate] = useState(
    initialBooking?.checkOutDate || ""
  );
  const [additionalNeeds, setAdditionalNeeds] = useState(
    initialBooking?.additionalNeeds || ""
  );
  const [message, setMessage] = useState("");

  return (
    <BookingContext.Provider
      value={{
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        additionalNeeds,
        setAdditionalNeeds,
        message,
        setMessage,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
