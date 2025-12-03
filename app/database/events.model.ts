import { Schema, model, models, Document } from 'mongoose';


export interface AgendaItem {
  title?: string;
  time?: string;
  speaker?: string;
  description?: string;
  type?: 'slot' | 'talk' | 'break' | string;
  meta?: any;
}

export interface Speaker {
  name: string;
  role?: string;
  company?: string;
  bio?: string;
  [key: string]: any;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  [key: string]: string | undefined;
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid' | string;
  audience: string;
  organizer: string;
  tags: string[];
  seatsTotal: number;
  seatsAvailable: number;
  agenda: AgendaItem[];


  createdAt: Date;
  updatedAt: Date;

  price?: number;
  isFree?: boolean;
  registrationDeadline?: string;
  highlights?: string[];
  requirements?: string[];
  contactEmail?: string;
  website?: string;
  socialLinks?: SocialLinks;
  speakers?: Speaker[];
}

const AgendaItemSchema = new Schema<AgendaItem>(
  {
    title: { type: String, trim: true },
    time: { type: String, trim: true },
    speaker: { type: String, trim: true },
    description: { type: String, trim: true },
    type: { type: String, trim: true, default: 'talk' },
    meta: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const SpeakerSchema = new Schema<Speaker>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    bio: { type: String, trim: true },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema<SocialLinks>(
  {
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },
  { _id: false }
);

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },

    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },

    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    date: {
      type: String,
      required: [true, 'Date is required'],
    },

    time: {
      type: String,
      required: [true, 'Time is required'],
    },

    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },

    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },

    agenda: {
      type: [AgendaItemSchema],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: AgendaItem[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one agenda item is required',
      },
    },

    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },

    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one tag is required',
      },
    },

    seatsTotal: {
      type: Number,
      required: [true, 'seatsTotal is required'],
      min: [0, 'seatsTotal cannot be negative'],
    },

    seatsAvailable: {
      type: Number,
      required: [true, 'seatsAvailable is required'],
      min: [0, 'seatsAvailable cannot be negative'],
      validate: {
        validator: function (value: number) {
          const doc: any = this;
          if (typeof doc.seatsTotal === 'number') {
            return value <= doc.seatsTotal;
          }
          return true;
        },
        message: 'seatsAvailable cannot exceed seatsTotal',
      },
    },


    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },

    isFree: {
      type: Boolean,
    },

    registrationDeadline: {
      type: String,
      validate: {
        validator: function (val: string) {
          if (val === undefined || val === null || val === '') return true;
          try {
            normalizeDate(val);
            return true;
          } catch {
            return false;
          }
        },
        message:
          'Invalid registrationDeadline; expected a parseable date string (e.g. YYYY-MM-DD or Date constructor compatible).',
      },
    },

    highlights: {
      type: [String],
    },

    requirements: {
      type: [String],
    },

    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function (val: string) {
          if (!val) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        },
        message: 'Invalid email format for contactEmail',
      },
    },

    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (val: string) {
          if (!val) return true;
          try {
            let url = val;
            if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid website URL',
      },
    },

    socialLinks: {
      type: SocialLinksSchema,
    },

    speakers: {
      type: [SpeakerSchema],
    },
  },
  { timestamps: true }
);
EventSchema.pre('validate', function (next) {
  const evt: any = this;

  if (evt.isNew) {
    if (typeof evt.seatsTotal === 'number' && (evt.seatsAvailable === undefined || evt.seatsAvailable === null)) {
      evt.seatsAvailable = evt.seatsTotal;
    }
  }

  if ((evt.isFree === undefined || evt.isFree === null) && typeof evt.price === 'number') {
    evt.isFree = evt.price === 0;
  }

  next();
});

EventSchema.pre('save', function (next) {
  const event: any = this;

  try {
    if (event.isModified?.('title') || event.isNew) {
      if (event.title) {
        event.slug = generateSlug(event.title);
      }
    }

    if (event.isModified?.('date')) {
      event.date = normalizeDate(event.date);
    }

    if (event.isModified?.('time')) {
      event.time = normalizeTime(event.time);
    }
  } catch (err) {
    return next(err as Error);
  }

  next();
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0];
}

function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  if (period) {
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23 || parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59) {
    throw new Error('Invalid time values');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
