import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles API calls to:
 *
 * POST booking
 * GET bookings
 *
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { checkInDate, checkOutDate, additionalNeeds } = req.body;
    const { firstName, lastName } = req.cookies;

    const payload = {
      firstname: firstName || "booking", // set default names
      lastname: lastName || "admin",
      totalprice: 0,
      depositpaid: true,
      bookingdates: {
        checkin: checkInDate,
        checkout: checkOutDate,
      },
      additionalneeds: additionalNeeds,
    };

    try {
      const response = await fetch(`${process.env.BOOKER_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .json({ message: "Failed to create booking", error: errorText });
      }

      const data = await response.json();
      res.status(200).json({ message: "Booking Created Successfully", data });
    } catch (error) {
      console.error("Error creating booking:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error. Please contact support." });
    }
  } else if (req.method === "GET") {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Missing required dates" });
    }

    // We have to -1 and +1 on the passed in checkin and checkout dates due to this:
    // https://github.com/mwinteringham/restful-booker/blob/main/routes/index.js#L102
    // https://github.com/mwinteringham/restful-booker/blob/main/routes/index.js#L106
    const checkIn = new Date(checkInDate as string);
    const checkOut = new Date(checkOutDate as string);

    checkIn.setDate(checkIn.getDate() - 1);
    checkOut.setDate(checkOut.getDate() + 1);

    const adjustedCheckInDate = checkIn.toISOString().split("T")[0];
    const adjustedCheckOutDate = checkOut.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${process.env.BOOKER_URL}/booking?checkin=${adjustedCheckInDate}&checkout=${adjustedCheckOutDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .json({ message: "Failed to fetch bookings", error: errorText });
      }

      const bookings = await response.json();
      const isAvailable = bookings.length == 0 ? true : false;

      res.status(200).json({ message: "success", isAvailable, bookings });
    } catch (error) {
      console.error("Error checking availability:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error. Please contact support." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
