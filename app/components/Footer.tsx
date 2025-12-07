"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-black to-black border-t border-white/10 text-gray-500">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_45%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 relative">
              <Link href="/" className="logo">
                <Image
                  src="/icons/logo4.png"
                  alt="TechEvents Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
            <h2 className="text-xl font-semibold text-gray-200">TechEvents</h2>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            TechEvents is a personal platform where I experiment with real-world
            product ideas, event systems, and scalable UI using modern tech.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-gray-200 font-semibold mb-2">Navigation</h3>
          <Link href="/events" className="text-sm hover:text-blue-400 transition text-gray-500">
            Events
          </Link>
          <Link href="/create-event" className="text-sm hover:text-blue-400 transition text-gray-500">
            Create Event
          </Link>
          <Link href="/schedule" className="text-sm hover:text-blue-400 transition text-gray-500">
            Schedule
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-blue-400 transition text-gray-500">
            Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-gray-200 font-semibold mb-2">Project & Learning</h3>

          <Link href="/blog/how-i-built-tech-events" className="text-sm hover:text-blue-400 transition text-gray-500">
            How I built this platform
          </Link>

          <Link href="/blog/what-i-learned-from-this-project" className="text-sm hover:text-blue-400 transition text-gray-500">
            What I learned from this project
          </Link>

          <Link href="/blog/tech-stack-used" className="text-sm hover:text-blue-400 transition text-gray-500">
            Tech stack & architecture
          </Link>

          <Link href="/blog/future-roadmap" className="text-sm hover:text-blue-400 transition text-gray-500">
            Future roadmap & features
          </Link>
        </div>

        <div>
          <h3 className="text-gray-200 font-semibold mb-4">Contact</h3>

          <div className="space-y-3 text-sm mb-5 text-gray-500">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>India</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>yourmail@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>+91 XXXXX XXXXX</span>
            </div>
          </div>

          <div className="flex gap-4 text-gray-500">
            <a href="#" className="hover:text-blue-400 transition">
              <Github size={18} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <Linkedin size={18} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} TechEvents — Personal learning project built with Next.js.
      </div>
    </footer>
  );
}
