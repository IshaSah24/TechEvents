import { Booking, Event } from "@/app/database";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type ReqBody = {
  additionalTickets?: number | string;
  paymentStatus?: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectToDatabase();

    const { id: bookingId } = await params;
    const body = (await req.json()) as ReqBody;

    const additionalTickets = Number(body.additionalTickets ?? 0);
    const paymentStatus = String(body.paymentStatus ?? "unpaid").toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }

    if (!Number.isInteger(additionalTickets) || additionalTickets < 1) {
      return NextResponse.json(
        { error: "additionalTickets must be an integer >= 1" },
        { status: 400 }
      );
    }

    if (!["paid", "unpaid"].includes(paymentStatus)) {
      return NextResponse.json(
        { error: "paymentStatus must be 'paid' or 'unpaid'" },
        { status: 400 }
      );
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      await session.abortTransaction();
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const event = await Event.findOneAndUpdate(
      { _id: booking.eventId, seatsAvailable: { $gte: additionalTickets } },
      { $inc: { seatsAvailable: -additionalTickets } },
      { new: true, session }
    );

    if (!event) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    const ticketPrice = typeof (event as any).price === "number"
      ? (event as any).price
      : Number((event as any).price) || 0;
    const amountToAdd = ticketPrice * additionalTickets;

    booking.tickets += additionalTickets;
    booking.amount += amountToAdd;

    if (paymentStatus === "paid") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
    }

    await booking.save({ session });
    await session.commitTransaction();

    const safeBooking = {
      id: booking._id,
      tickets: booking.tickets,
      amount: booking.amount,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      eventId: booking.eventId,
    };

    return NextResponse.json({ booking: safeBooking }, { status: 200 });
  } catch (err: any) {
    console.error("add-tickets error:", err);
    if (session) {
      try {
        await session.abortTransaction();
      } catch (e) {
        console.error("abort error:", e);
      }
    }
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  } finally {
    if (session) session.endSession();
  }
}
