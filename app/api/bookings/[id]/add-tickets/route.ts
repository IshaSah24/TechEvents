import { Booking, Event } from "@/app/database";
import { connectToDatabase } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    let session: mongoose.ClientSession | null = null;
    try {
        await connectToDatabase();
        const bookingId = params.id;
        const body = await req.json();
        const { additionalTickets = 0, paymentStatus = "unpaid" } = body;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json({ error: "invalid  booking id" });
        }

        if (!Number.isInteger(additionalTickets) || additionalTickets < 1) {
            return NextResponse.json({ error: "additional Tickets must  be >= 1" }, { status: 400 });
        }

        session = await mongoose.startSession();
        session.startTransaction();


        const booking = await Booking.findById(bookingId).session(session);

        if (!booking) {
            await session.abortTransaction();
            return NextResponse.json({ error: "booking not found " }, { status: 404 });
        }

        const event = await Event.findOneAndUpdate(
            { _id: booking.eventId, seatsAvailable: { $gte: additionalTickets } },
            { $inc: { seatsAvailable: -additionalTickets } },
            { new: true, session }
        );

        if (!event) {
            await session.abortTransaction();
            return NextResponse.json({ error: "Not enough seats available" }, { status: 400 });
        }

        const ticketPrice = (event as any).price ?? 0;
        const amountToAdd = ticketPrice * additionalTickets;


        booking.tickets += additionalTickets;
        booking.amount += amountToAdd;


        if (paymentStatus === "paid") {
            booking.paymentStatus = "paid";
            booking.status = "confirmed";
        }

        await booking.save({ session });
        await session.commitTransaction();

        return NextResponse.json({ booking }, { status: 200 });


    }  catch (err: any) {
        console.error("add-tickets error:", err);
        if (session) {
          try {
            await session.abortTransaction();
          } catch (e) {
            console.error("abort error:", e);
          }
        }
        return NextResponse.json({ error: err?.message ?? "server error" }, { status: 500 });
      } finally {
        if (session) session.endSession();
      }
}

