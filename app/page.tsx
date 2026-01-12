import HeroSection from "./HeroSection";    
import AllEvents from "./components/AllEvents";
import { IEvent } from "./database/events.model";
import { getAllEvents } from "./lib/events";
// import { events } from "./constants/eventsDummy";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {
  // const  response  = await fetch (`${BASE_URL}/api/events`);
  const events = await getAllEvents();
  // const data   = await response.json();
  // console.log(data);
  // const events = data.event
  
   
  return (
    <main  className="w-full min-h-screen sm:px-10 px-5 mx-auto ">
      <HeroSection />
      <section className="container mx-auto px-4 py-16">
      <h1 className="h1-bluish text-center opacity-[.9]">Top Events</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-sky-200 via-blue-300 to-cyan-600 rounded-full mx-auto mt-2 opacity-[.8]"></div>


        <ul className="flex gap-12 justify-center flex-wrap mt-8">
          {events && events.length > 0 && events.map((event : IEvent, index : any) => (
            <li key={index} className="list-none">
              <AllEvents {...event}  slug={event.slug} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
