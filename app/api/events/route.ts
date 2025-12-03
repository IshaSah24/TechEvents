import { v2 as cloudinary } from 'cloudinary';
import { Event } from "@/app/database";
import { connectToDatabase } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

function safeParseJSON<T = any>(val: unknown): T | undefined {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "object") return val as T;
    if (typeof val !== "string") return undefined;
    try {
        return JSON.parse(val) as T;
    } catch {
        return undefined;
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();

        let event: any = Object.fromEntries(formData.entries());
        try {
            const parsedAgenda = safeParseJSON(event.agenda);
            if (parsedAgenda !== undefined) event.agenda = parsedAgenda;

            const parsedSpeakers = safeParseJSON(event.speakers);
            if (parsedSpeakers !== undefined) event.speakers = parsedSpeakers;

            const parsedSocialLinks = safeParseJSON(event.socialLinks);
            if (parsedSocialLinks !== undefined) event.socialLinks = parsedSocialLinks;

            const parsedTags = safeParseJSON(event.tags);
            if (parsedTags !== undefined) event.tags = parsedTags;

            const parsedHighlights = safeParseJSON(event.highlights);
            if (parsedHighlights !== undefined) event.highlights = parsedHighlights;

            const parsedRequirements = safeParseJSON(event.requirements);
            if (parsedRequirements !== undefined) event.requirements = parsedRequirements;
        } catch (err) {
            return NextResponse.json(
                { message: "Invalid JSON in one of the form-data fields", error: (err as Error).message || err },
                { status: 400 }
            );
        }

        if (event.seatsTotal !== undefined) {
            const n = Number(event.seatsTotal);
            event.seatsTotal = Number.isNaN(n) ? event.seatsTotal : n;
        }
        if (event.seatsAvailable !== undefined) {
            const n = Number(event.seatsAvailable);
            event.seatsAvailable = Number.isNaN(n) ? event.seatsAvailable : n;
        }
        if (event.price !== undefined) {
            const n = Number(event.price);
            event.price = Number.isNaN(n) ? event.price : n;
        }
        if (event.isFree !== undefined) {
            if (typeof event.isFree === "string") event.isFree = event.isFree === "true";
            else event.isFree = Boolean(event.isFree);
        }

        if (event.mode !== undefined) {
            if (typeof event.mode === "string") {
                event.mode = event.mode.trim().toLowerCase();
            }
            if (!["online", "offline", "hybrid"].includes(event.mode)) {
                return NextResponse.json(
                    { message: "Mode must be either online, offline, or hybrid" },
                    { status: 400 }
                );
            }
        } else {
            return NextResponse.json({ message: "Mode is required" }, { status: 400 });
        }
        if ((event.seatsAvailable === undefined || event.seatsAvailable === null) && typeof event.seatsTotal === "number") {
            event.seatsAvailable = event.seatsTotal;
        }
        const file = formData.get("image") as File | null;

        if (file && typeof (file as File).arrayBuffer === "function") {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadFileToCloudinary = await new Promise<any>((res, rej) => {
                cloudinary.uploader
                    .upload_stream({ resource_type: "image", folder: "TechEvents" }, (error, result) => {
                        if (error) return rej(error);
                        res(result);
                    })
                    .end(buffer);
            });

            event.image = (uploadFileToCloudinary as { secure_url: string }).secure_url;
        } else if (event.image && typeof event.image === "string") {
            try {
                if (!/^https?:\/\//i.test(event.image)) {
                    event.image = `https://${event.image}`;
                }
                new URL(event.image);
            } catch {
                return NextResponse.json({ message: "Invalid image URL provided" }, { status: 400 });
            }
        } else {
            return NextResponse.json({ message: "Image file is required (form-data 'image')" }, { status: 400 });
        }

        const requiredStrings = ["title", "description", "overview", "venue", "location", "date", "time", "audience", "organizer"];
        for (const key of requiredStrings) {
            if (!event[key] || (typeof event[key] === "string" && event[key].trim() === "")) {
                return NextResponse.json({ message: `${key} is required` }, { status: 400 });
            }
        }

        const createdEvent = await Event.create(event);

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        if (e && (e as any)._message && (e as any).errors) {
            return NextResponse.json(
                { message: "Event validation failed", error: (e as any)._message, details: (e as any).errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "failed to create the event", error: e instanceof Error ? e.message : String(e) },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const event = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Event list retrieved successfully", event }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "Failed to get the events", error: e instanceof Error ? e.message : e }, { status: 500 });
    }
}


