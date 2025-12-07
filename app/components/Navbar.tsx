import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const isLoggedIn = true;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-white/10">
      <nav className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image alt="logo" src="/icons/logo4.png" height={28} width={28} />
          <span className="text-white font-semibold tracking-wide">TechEvents</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300 list-none p-0 m-0">
          <li className="list-none">
            <Link
              href="/"
              className="hover:text-white transition border-b-2 border-transparent hover:border-blue-400 pb-1"
            >
              Home
            </Link>
          </li>

          <li className="list-none">
            <Link
              href="/events"
              className="hover:text-white transition border-b-2 border-transparent hover:border-blue-400 pb-1"
            >
              Events
            </Link>
          </li>

          <li className="list-none">
            <Link
              href="/create"
              className="hover:text-white transition border-b-2 border-transparent hover:border-blue-400 pb-1"
            >
              Create Events
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href={isLoggedIn ? "/dashboard" : "/login?next=/dashboard"}
            className="text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
          {!isLoggedIn && (
            <Link href="/login" className="text-gray-300 hover:text-white transition">
              Login
            </Link>
          )}

          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
              i
            </div>
            Isha Sah
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
