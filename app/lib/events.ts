import { connectToDatabase } from "@/app/lib/mongodb";
import { Event } from "@/app/database";

export async function getAllEvents() {
    await connectToDatabase();

    const events = await Event.find()
        .select('title slug image location date time mode audience organizer agenda seatsTotal seatsAvailable')
        .sort({ createdAt: -1 })
        .lean();


    return JSON.parse(JSON.stringify(events));
}