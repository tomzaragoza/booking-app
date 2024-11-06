import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Get Auth token from /auth endpoint for use in PATCH and DELETE calls
 * @returns
 */
async function getAuthToken() {
  try {
    const authResponse = await fetch(`${process.env.BOOKER_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: process.env.AUTH_USERNAME,
        password: process.env.AUTH_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Failed to obtain token: ${errorText}`);
    }

    const authData = await authResponse.json();
    return authData.token;
  } catch (error) {
    console.error("Error obtaining token:", error);
    throw error;
  }
}

/**
 * Handles API calls to:
 *
 * PATCH booking
 * DELETE booking
 *
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    const { checkInDate, checkOutDate, additionalNeeds } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Structure: https://github.com/mwinteringham/restful-booker/blob/main/routes/index.js#L465
    const payload = {
      additionalneeds: additionalNeeds,
      ...(checkInDate && checkOutDate
        ? {
            bookingdates: {
              checkin: checkInDate,
              checkout: checkOutDate,
            },
          }
        : {}),
    };

    try {
      const token = await getAuthToken();
      const response = await fetch(`${process.env.BOOKER_URL}/booking/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .json({ message: "Failed to update booking", error: errorText });
      }

      const data = await response.json();
      res.status(200).json({ message: "Booking Updated Successfully", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error. Please contact support." });
    }
  } else if (req.method === "DELETE") {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${process.env.BOOKER_URL}/booking/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res
          .status(response.status)
          .json({ message: "Failed to delete booking", error: errorText });
      }

      res.status(200).json({ message: "Booking Deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error. Please contact support." });
    }
  }
}
