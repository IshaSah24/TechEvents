import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href='/' className="logo">
                <Image alt="img" src="/icons/logo4.png" height={26} width={26}/>
            </Link>
            <ul>
                <Link href="/">Home</Link>
                <Link href="/events">Events </Link>
                <Link href="/create">Create Events</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar