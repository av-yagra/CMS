export type ItineraryDay = { day: string; title: string; description: string };

export type AdminPackage = {
    id: string;
    title: string;
    destination: string;
    duration: string;
    price: number;
    badge: string | null;
    image: string;
    imagePosition?: string;
    summary?: string;
    description: string;
    highlights: string[];
    difficulty?: string;
    bestSeason?: string;
    startingPoint?: string;
    maxAltitude?: string;
    itinerary: ItineraryDay[];
    includes: string[];
    excludes: string[];
};
