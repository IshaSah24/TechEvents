import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  ExternalLink,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Event, { IEvent } from "@/app/database/events.model";
import { connectToDatabase } from "@/app/lib/mongodb";
import RegisterModal from "@/app/components/RegisterModal";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


interface JwtUserPayload {
  id: string;
  name?: string;
  email?: string;
}

interface PageProps {
  params: { slug: string };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const  cookieStore  = cookies();
  const token  = (await cookieStore).get("token")?.value;
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment variables");
  let currentUser: JwtUserPayload | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
  
      if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
        currentUser = {
          id: (decoded as any).id,
          name: (decoded as any).name,
          email: (decoded as any).email,
        };
      }
    } catch (err) {
      currentUser = null;
    }
  }


  const event = (await Event.findOne({ slug }).lean()) as
    | (IEvent & { _id?: any })
    | null;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Event not found
          </h1>
          <p className="text-muted-foreground">
            The event you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const seatsPercentage = event.seatsTotal
    ? ((event.seatsTotal - event.seatsAvailable) / event.seatsTotal) * 100
    : 0;

  return (
    <main className="min-h-screen bg-[#1a2332] text-white w-full">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2638]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Events</span>
          </Link>
          <div className="text-sm text-white/60">
            Organized by {event.organizer ?? "Unknown"}
          </div>
        </div>
      </nav>

      <section className="relative min-h-[65vh] flex items-end pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332] via-[#2a4a6a]/40 to-[#1a2332]">
          <div className="absolute inset-0 opacity-30">
            <Image
              src={event.image ?? "/placeholder.jpg"}
              alt={event.title ?? "Event image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="relative container mx-auto px-6 pb-12 pt-20">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full border-0 text-sm font-medium hover:bg-blue-700">
                {event.tags?.[0] ?? "General"}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/30 text-white px-3 py-1 rounded-full text-sm"
              >
                {event.mode ?? "Online/Offline"}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/70 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6">About This Event</h2>
              <div className="text-white/70 leading-relaxed space-y-4 whitespace-pre-line">
                {event.description}
              </div>
            </div>
            {Array.isArray(event.highlights) && event.highlights.length > 0 && (
              <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <h2 className="text-2xl font-semibold mb-6">
                  Event Highlights
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {event.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(event.requirements) &&
              event.requirements.length > 0 && (
                <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    Requirements
                  </h2>
                  <ul className="space-y-2.5">
                    {event.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-white/70"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 text-sm bg-[#1e2a3d]/80 text-white/60 rounded-full border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Event Agenda</h2>
              <div className="relative">
                <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-white/10" />
                <ul className="space-y-8">
                  {(event.agenda ?? []).map((item: any, i: number) => {
                    const it =
                      typeof item === "string" ? { title: item } : item ?? {};
                    return (
                      <li key={it._id ?? i} className="relative pl-8">
                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#1a2332]" />
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            {it.time && (
                              <span className="flex items-center gap-1.5 text-sm font-medium text-blue-400">
                                <Clock className="h-4 w-4" />
                                {it.time}
                              </span>
                            )}
                            {it.speaker && (
                              <span className="flex items-center gap-1.5 text-sm text-white/50">
                                <User className="h-4 w-4" />
                                {it.speaker}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-white">
                            {it.title}
                          </h4>
                          {it.description && (
                            <p className="text-white/60 text-sm">
                              {it.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <div className="bg-[#1e2a3d]/80 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                <div className="bg-[#243447] p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${event.price ?? 0}
                    </span>
                    <span className="text-white/60">per person</span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Seats Available</span>
                      <span className="font-semibold text-white">
                        {event.seatsAvailable} / {event.seatsTotal}
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${seatsPercentage}%` }}
                      />
                    </div>
                  </div>

                  {event.registrationDeadline && (
                    <div className="flex items-center gap-2 text-sm text-white/60 bg-[#1a2332]/60 p-3 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>Register by {event.registrationDeadline}</span>
                    </div>
                  )}

                      <RegisterModal
                        eventId={event._id.toString()}
                        eventSlug={event.slug}
                        seatsAvailable={event.seatsAvailable}
                        user={currentUser ? {...currentUser} : null} 
                      />

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="font-semibold text-lg mb-5">Event Details</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{event.date}</p>
                      <p className="text-sm text-white/60">{event.time}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{event.venue}</p>
                      <p className="text-sm text-white/60">{event.location}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Organizer</p>
                      <p className="text-sm text-white/60">{event.organizer}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Audience</p>
                      <p className="text-sm text-white/60">{event.audience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {(event.contactEmail || event.website) && (
                <div className="bg-[#1e2a3d]/60 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="font-semibold text-lg mb-5">Contact</h3>
                  <div className="space-y-3">
                    {event.contactEmail && (
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {event.contactEmail}
                      </a>
                    )}
                    {event.website && (
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Event Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#1e2a3d]/40 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © 2024 {event.organizer}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
