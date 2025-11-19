import { ArrowRight } from "lucide-react"

const ExploreBtn = () => {
  return (
    <section>
        <button className="group inline-flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-600/30 transition-all hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-600/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
        <a href="#events">
            Explore Events
        </a>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </button>


    </section>
  )
}

export default ExploreBtn