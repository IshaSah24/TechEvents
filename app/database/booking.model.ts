import { Schema, model, models, Document, Types } from "mongoose";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  tickets: number;
  amount: number;
  paymentStatus: "unpaid" | "paid" | "failed";
  status: "pending" | "confirmed" | "cancelled";
  bookingRef: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    tickets: {
      type: Number,
      required: true,
      min: [1, "Minimum 1 ticket"],
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    bookingRef: {
      type: String,
      unique: true,
      required: true,
      default: () => `BK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    },
  },
  { timestamps: true }
);

// Prevent duplicate booking for same user/event
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
