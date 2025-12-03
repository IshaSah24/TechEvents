import { connectToDatabase } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Booking, Event, User } from "@/app/database";

const JWT_SECRET = process.env.JWT_SECRET; 

export async function POST(req: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    if (!JWT_SECRET) {
      console.error("Missing JWT_SECRET env var");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    await connectToDatabase();

    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = payload.userId || payload.sub || payload.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const body = (await req.json()) || {};
    const {
      eventId,
      tickets = 1,
      paymentStatus = "unpaid",
    } = body;

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
    }
    if (!Number.isInteger(tickets) || tickets < 1) {
      return NextResponse.json({ error: "tickets must be an integer >= 1" }, { status: 400 });
    }
    if (!["unpaid", "paid", "failed"].includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400 });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const event = await Event.findOneAndUpdate(
      { _id: eventId, seatsAvailable: { $gte: tickets } },
      { $inc: { seatsAvailable: -tickets } },
      { new: true, session }
    );

    if (!event) {
      await session.abortTransaction();
      return NextResponse.json({ error: "Not enough seats available or event not found" }, { status: 400 });
    }

    const ticketPrice = (event as any).price ?? 0;
    const finalAmount = ticketPrice * tickets;

    const existingBooking = await Booking.findOne({ eventId, userId }).session(session);

    let booking;
    if (existingBooking) {
      existingBooking.tickets += tickets;
      existingBooking.amount = (existingBooking.amount ?? 0) + finalAmount;

      if (paymentStatus === "paid") {
        existingBooking.paymentStatus = "paid";
        existingBooking.status = "confirmed";
      }

      await existingBooking.save({ session });
      booking = existingBooking;
    } else {
      const created = await Booking.create(
        [
          {
            eventId,
            userId,
            tickets,
            amount: finalAmount,
            paymentStatus,
            status: paymentStatus === "paid" ? "confirmed" : "pending",
            bookingRef: `BK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          },
        ],
        { session }
      );
      booking = created[0];
    }

    await session.commitTransaction();

    return NextResponse.json(
      {
        booking,
        event: { id: event._id, seatsTotal: (event as any).seatsTotal, seatsAvailable: (event as any).seatsAvailable },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("booking error:", err);
    if (session) {
      try {
        await session.abortTransaction();
      } catch (e) {
        console.error("abort error:", e);
      }
    }

    if (err?.code === 11000) {
      return NextResponse.json({ error: "Booking already exists for this user and event" }, { status: 409 });
    }
    return NextResponse.json({ error: err?.message ?? "server error" }, { status: 500 });
  } finally {
    if (session) session.endSession();
  }
}
