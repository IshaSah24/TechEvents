
import { Calendar, Users} from "lucide-react";

export interface Feature {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }

export const defaultFeatures: Feature[] = [
    {
      title: "Hands-on workshops",
      description:"Build projects with expert mentors and walk away with deployable demos.",
      icon: Calendar,
    },
    {
      title: "Networking",
      description: "Meet builders, founders and hiring teams from top companies.",
      icon: Users,
    },
  ];