export type BookingIdType = {
  bookingid: string;
};

export type BookingType = {
  id: number;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};
