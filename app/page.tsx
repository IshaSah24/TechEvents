import HeroSection from "./HeroSection";    
import AllEvents from "./components/AllEvents";
import { IEvent } from "./database/events.model";
// import { events } from "./constants/eventsDummy";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {
  const  response  = await fetch (`${BASE_URL}/api/events`);
  const data   = await response.json();
  console.log(data);
  const events = data.event
  
  
  return (
    <main  className="w-full min-h-screen">
      <HeroSection />
      <section className="container mx-auto px-4 py-16">
        <h1 className="h1-redish text-center">Top Events</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-red-950 via-rose-600 to-red-300 rounded-full mx-auto mt-2"></div>

        <ul className="flex gap-12 justify-center flex-wrap mt-8">
          {events && events.length > 0 && events.map((event : IEvent, index : any) => (
            <li key={index} className="list-none">
              <AllEvents {...event} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
