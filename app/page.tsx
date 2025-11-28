"use client";

import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Briefcase, ArrowRight, Check } from "lucide-react";
import AllEvents from "./components/AllEvents";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface Logo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface HeroProps {
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  features?: Feature[];
  logos?: Logo[];
  heroImageSrc?: string;
}

const events = [
  {
    image:
      "https://imgs.search.brave.com/oxkE9sZ6KCM2aw7FcLn5TLO5U8UaHqOIpFvnf55Cs5g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjgv/OTM5Lzc3My9zbWFs/bC9jb25mZXJlbmNl/LXdpdGgtYXVkaWVu/Y2UtYW5kLXN0YWdl/LXNob3dpbmctcGFu/ZWwtaW4tYnJpZ2h0/bHktbGl0LWluZG9v/ci1zcGFjZS1mcmVl/LXBob3RvLmpwZw",
    time: "2024-09-15T09:00:00",
    date: "September 15-16, 2024",
    location: "San Francisco, CA",
    title: "Tech Innovators Conference 2024",
  },
  {
    image: "https://imgs.search.brave.com/ffnTcwWUR95WKXiaXkIvvs5aEJBvjZaiCiBtQoHOC28/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibGFj/a2lzdGVjaGNvbmZl/cmVuY2UuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzEy/L0F1ZGllbmNlMi01/MDB4NTAwLmpwZw",
    time: "2024-09-15T09:00:00",
    date: "September 15-16, 2024",
    location: "San Francisco, CA",
    title: "Tech Innovators Conference 2024",
  },

  {
    image:
      "https://imgs.search.brave.com/oSjaFTUQXfmLZT0OWWgsGEk36i7-8OYAulwR61d3TDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTEv/MTA3Lzk4OC9zbWFs/bC90ZWNobmljaWFu/LWhhbmRsaW5nLXRo/ZS1saWdodHMtYXQt/YS1jb25mZXJlbmNl/LXBob3RvLkpQRw",
    time: "2024-09-15T09:00:00",
    date: "September 15-16, 2024",
    location: "San Francisco, CA",
    title: "Tech Innovators Conference 2024",
  },
];

const defaultFeatures: Feature[] = [
  {
    title: "Hands-on workshops",
    description:
      "Build projects with expert mentors and walk away with deployable demos.",
    icon: Calendar,
  },
  {
    title: "Networking",
    description: "Meet builders, founders and hiring teams from top companies.",
    icon: Users,
  },
];

const defaultLogos: Logo[] = [
  {
    src: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=200",
    alt: "Partner 1",
  },
  {
    src: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200",
    alt: "Partner 2",
  },
  {
    src: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=200",
    alt: "Partner 3",
  },
];
 
const defaultHeroImage =
  "https://imgs.search.brave.com/loQXL8Xaf4dM-8yHX8mZPvuxNq-Zowc12aWVqFwkkX8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZWNvZGVjYW1w/Lm9yZy9uZXdzL2Nv/bnRlbnQvaW1hZ2Vz/L3NpemUvdzIwMDAv/MjAyMy8wNS9FbGVn/YW50LVRyYXZlbC1C/bG9nLVlvdXR1YmUt/VGh1bWJuYWlsLnBu/Zw";

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
      className="group rounded-2xl border-[1.8px] border-slate-800 p-6 shadow-md transition-all hover:border-sky-100/30 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
    >
      <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-sky-50 p-3 transition-colors group-hover:bg-sky-100">
        <Icon className="h-6 w-6 text-sky-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-300">
        {feature.title}
      </h3>
      <p className="text-slate-500">{feature.description}</p>
    </motion.div>
  );
}

export default function HeroSection({
  headline = "Powering  Conversation  Between Buider, Thinker,  and Doers",
  subhead = "Join engineers, founders and creators for two days of workshops, talks and hands-on demos.",
  primaryCtaLabel = "Explore Events",
  secondaryCtaLabel = "See schedule",
  onPrimaryCta,
  onSecondaryCta,
  features = defaultFeatures,
  logos = defaultLogos,
  heroImageSrc = defaultHeroImage,
}: HeroProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />

      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
              </span>
              TechEvent • Community • Innovation
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              {headline}
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
              {subhead}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() =>
                  onPrimaryCta ? onPrimaryCta() : console.log("RSVP clicked")
                }
                className="group inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-600/30 transition-all hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-600/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                {primaryCtaLabel}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() =>
                  onSecondaryCta
                    ? onSecondaryCta()
                    : console.log("See schedule clicked")
                }
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {secondaryCtaLabel}
              </button>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="grid gap-6 sm:grid-cols-1">
                {features.map((f, i) => (
                  <FeatureCard key={i} feature={f} index={i} />
                ))}
              </div>

              {logos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="rounded-full border border-slate-800 p-6"
                >
                  <p className="mb-4 text-center text-sm font-medium text-slate-500">
                    Trusted by
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8 rounded-full">
                    {logos.map((logo, i) => (
                      <img
                        key={i}
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width ?? 42}
                        height={logo.height ?? 42}
                        className="h-8 object-contain opacity-60 transition-opacity hover:opacity-100 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:scale-[1.01] transition-all duration-200">
                <img
                  src={heroImageSrc}
                  alt="People at a tech event"
                  className="h-96 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className=" backdrop-blur-md p-6 relative z-10 mx-auto lg:mb-120 max-w-md rounded-2xl border border-slate-800  p-6 shadow-xl lg:absolute lg:-bottom-8 lg:-right-8 lg:mt-0 lg:max-w-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-900">
                    <Check className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300">
                      Early Access
                    </h3>
                    <p className="text-xs text-slate-500">
                      Get ticket alerts & workshop codes
                    </p>
                  </div>
                </div>

                <form className="space-y-3">
                  <div>
                    <label htmlFor="hero-email" className="sr-only">
                      Email for early access
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                       className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-slate-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-black hover:border-[.4px] duration-300 transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Get early access"}
                  </button>
                </form>

                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-xs font-medium text-sky-700"
                  >
                    {success}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <h1 className="  h1-redish">Top  Events</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-red-950 via-rose-600 to-red-300 rounded-full mt-2"></div>
        <ul className="flex gap-12 justify-center flex-wrap mt-8">
          {events.map((event, index) => (
            <li key={index} className="list-none">
              <AllEvents {...event} />
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
