import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './events.model';
import User from './user.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.exists({ _id: booking.eventId });
      if (!eventExists) {
        const err = new Error(`Event with ID ${booking.eventId} does not exist`);
        err.name = 'ValidationError';
        return next(err);
      }
    } catch (err: any) {
      const error = new Error(`Invalid event ID format or DB error: ${err.message}`);
      error.name = 'ValidationError';
      return next(error);
    }
  }

  if (booking.isModified('userId') || booking.isNew) {
    try {
      const userExists = await User.exists({ _id: booking.userId });
      if (!userExists) {
        const err = new Error(`User with ID ${booking.userId} does not exist`);
        err.name = 'ValidationError';
        return next(err);
      }
    } catch (err: any) {
      const error = new Error(`Invalid user ID format or DB error: ${err.message}`);
      error.name = 'ValidationError';
      return next(error);
    }
  }

  next();
});

BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true, name: 'uniq_event_user' });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);
export default Booking;
