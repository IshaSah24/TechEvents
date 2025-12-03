import { ArrowRight, MapPin, Calendar, Clock, Users, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AgendaItem {
  title?: string;
  time?: string;
  speaker?: string;
  [key: string]: any;
}

interface Props {
  title: string;
  image: string;
  slug: string;
  href?: string;
  location?: string;
  date?: string;
  time?: string;
  registerHref?: string;
  mode?: string;
  audience?: string;
  organizer?: string;
  agenda?: Array<string | AgendaItem>;
  seatsAvailable?: number;
  seatsTotal?: number;
}

const AllEvents = (props: Props) => {
  const {
    image,
    slug,
    title,
    location = "Unknown location",
    date = "TBD",
    time = "12:00 PM",
    href,
    registerHref = "/register",
    mode,
    audience,
    organizer,
    agenda = [],
    seatsAvailable,
    seatsTotal,
  } = props;

  const hrefRes = href ?? `/event/${slug}`;

  const getAgendaLabel = (item: string | AgendaItem) => {
    if (typeof item === "string") {
      return item.replace(/[\[\]"]+/g, "");
    }
    return item?.title ?? JSON.stringify(item);
  };

  return (
    <div className="w-full">
      <Link
        href={hrefRes}
        className="group relative block overflow-hidden rounded-sm lg:rounded-xl"
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="h-64 w-full object-cover rounded-sm lg:rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:brightness-70 filter"
        />

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm lg:rounded-xl flex items-center justify-center">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-white mb-3 px-6">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-5 flex flex-col gap-3 bg-slate-900/20 p-4 rounded-xl border border-slate-200/10 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-600">{title}</h3>

        <div className="flex flex-col gap-2 text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm">{time}</span>
            </div>
          </div>

          {mode && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-sm">{mode}</span>
            </div>
          )}

          {audience && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-sm">Audience: {audience}</span>
            </div>
          )}

          {organizer && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-sm">Organizer: {organizer}</span>
            </div>
          )}

          {agenda.length > 0 && (
            <div className="flex items-start gap-2">
              <List className="h-4 w-4 text-slate-500 mt-1" />
              <ul className="text-sm list-disc list-inside">
                {agenda.map((item, idx) => (
                  <li key={idx}>{getAgendaLabel(item)}</li>
                ))}
              </ul>
            </div>
          )}

          {seatsAvailable !== undefined && seatsTotal !== undefined && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Seats: {seatsAvailable}/{seatsTotal}
            </div>
          )}
        </div>

        <div className="h-[1px] bg-slate-200/20 my-2"></div>

        <div className="flex justify-end">
          <Link
            href={registerHref}
            className="inline-flex items-center gap-2 rounded-full bg-slate-700 text-slate-200 px-5 py-2 text-sm font-medium shadow cursor-pointer hover:bg-slate-900 hover:border-[.1px] transition"
          >
            Register Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
