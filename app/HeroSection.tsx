"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { defaultFeatures } from "./constants/features";
import { defaultLogos } from "./constants/logos";
import FeatureCard from "./components/FeatureCard";

interface HeroProps {
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  heroImageSrc?: string;
}

export default function HeroSection({
  headline = "Powering Conversation Between Builders, Thinkers, and Doers",
  subhead = "Join engineers, founders, and creators for workshops, talks, and hands-on demos.",
  primaryCtaLabel = "Explore Events",
  secondaryCtaLabel = "See Schedule",
  onPrimaryCta,
  onSecondaryCta,
  heroImageSrc = "https://imgs.search.brave.com/loQXL8Xaf4dM-8yHX8mZPvuxNq-Zowc12aWVqFwkkX8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZWNvZGVjYW1w/Lm9yZy9uZXdzL2Nv/bnRlbnQvaW1hZ2Vz/L3NpemUvdzIwMDAv/MjAyMy8wNS9FbGVn/YW50LVRyYXZlbC1C/bG9nLVlvdXR1YmUt/VGh1bWJuYWlsLnBu/Zw",
}: HeroProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-12">
        {/* ================================
            HERO SECTION HEADINGS
        =================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700">
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
              onClick={() => onPrimaryCta?.()}
              className="group inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-sky-700"
            >
              {primaryCtaLabel}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onSecondaryCta?.()}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-100"
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </motion.div>

        {/* ================================
            FEATURE + LOGO + IMAGE SECTION
        =================================== */}
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-1">
              {defaultFeatures.map((f, i) => (
                <FeatureCard key={i} feature={f} />
              ))}
            </div>

            {defaultLogos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-full border border-slate-800 p-6"
              >
                <p className="mb-4 text-center text-sm font-medium text-slate-500">
                  Trusted by
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {defaultLogos.map((logo, i) => (
                    <img
                      key={i}
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width ?? 42}
                      height={logo.height ?? 42}
                      className="h-10 object-contain opacity-60 hover:opacity-100 rounded-full transition-opacity"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <img
                src={heroImageSrc}
                alt="Hero visual"
                className="h-96 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className=" absolute  backdrop-blur-md p-6 max-w-md rounded-2xl border border-slate-800 shadow-xl lg:absolute lg:-top-40 lg:-right-8"
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

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitting(true);

                  setTimeout(() => {
                    setSubmitting(false);
                    setSuccess("Thanks! You are added to the list.");
                  }, 1200);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-600 px-4 py-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Get early access"}
                </button>
              </form>

              {success && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-center text-xs font-medium text-sky-700"
                >
                  {success}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
