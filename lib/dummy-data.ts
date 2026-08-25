export const destinations = [
  {
    id: "pokhara",
    name: "Pokhara",
    country: "Nepal",
    image:
      "/images/pokhara.png",
      
       imagePosition: "center 35%",
    description: "Lakeside views with the Annapurna range as your backdrop.",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image:
      "/images/bali.png",
        imagePosition: "center 25%",
    description: "Beaches, temples, and rice terraces in one island.",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image:
      "/images/santorini.png",
      imagePosition: "center 40%",
    description: "Whitewashed cliffside villages over the Aegean Sea.",
  },
    {
    id: "kathmandu",
    name: "Kathmandu",
    country: "Nepal",
    image:
      "https://images.unsplash.com/photo-1605640797058-58b7040a0e61?w=800&q=80",
      imagePosition: "center 15%",
    description: "Ancient temples and vibrant streets in the Kathmandu Valley.",
  },
    {
    id: "chitwan",
    name: "Chitwan",
    country: "Nepal",
    image:
      "https://images.unsplash.com/photo-1762209969249-ff0fd8e13a1b?w=800&q=80",
      imagePosition: "center 60%",
    description: "Jungle safaris and wildlife in a UNESCO World Heritage park.",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    image:
      "https://images.unsplash.com/photo-1748373452031-ee1ae4eb624d?w=800&q=80",
      imagePosition: "center 40%",
    description: "Futuristic skyline, Burj Khalifa, and desert adventures.",
  },
];

export const packages = [
  {
    id: "everest-base-camp",
    title: "Everest Base Camp Trek",
    destination: "Nepal",
    duration: "14 Days",
    price: 1450,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    description:
      "Trek through Sherpa villages, rhododendron forests, and high alpine trails to stand at the foot of the world's tallest mountain. A classic Himalayan adventure with experienced local guides at every step.",
    itinerary: [
      { day: "Day 1", title: "Arrival in Kathmandu", description: "Airport pickup, trek briefing, and gear check." },
      { day: "Day 2–3", title: "Fly to Lukla, Trek to Namche Bazaar", description: "Scenic mountain flight followed by the first days on trail." },
      { day: "Day 4–5", title: "Acclimatization in Namche", description: "Short hikes to Everest View Hotel to adjust to altitude." },
      { day: "Day 6–9", title: "Trek to Everest Base Camp", description: "Pass through Tengboche, Dingboche, and Lobuche en route to base camp." },
      { day: "Day 10", title: "Everest Base Camp & Kala Patthar", description: "Reach base camp and hike to Kala Patthar for sunrise summit views." },
      { day: "Day 11–13", title: "Descend to Lukla", description: "Retrace the trail back down through familiar villages." },
      { day: "Day 14", title: "Fly back to Kathmandu", description: "Return flight and farewell dinner." },
    ],
    includes: ["Airport pickup & drop-off", "Local guide & porter", "Teahouse accommodation", "All permits & fees", "Breakfast, lunch & dinner during trek"],
    excludes: ["International flights", "Travel insurance", "Personal trekking gear", "Tips for guides & porters"],
  },
  {
    id: "bali-getaway",
    title: "Bali Island Getaway",
    destination: "Indonesia",
    duration: "7 Days",
    price: 890,
    badge: "Offer",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    description:
      "A relaxed week across Bali's temples, rice terraces, and beaches — balancing culture, nature, and downtime by the water.",
    itinerary: [
      { day: "Day 1", title: "Arrival in Denpasar", description: "Transfer to Ubud, evening at leisure." },
      { day: "Day 2", title: "Ubud Temples & Rice Terraces", description: "Visit Tegalalang rice terrace and a traditional water temple." },
      { day: "Day 3", title: "Mount Batur Sunrise Trek", description: "Early morning hike for sunrise over the volcano." },
      { day: "Day 4", title: "Transfer to Seminyak", description: "Beach time and free evening." },
      { day: "Day 5", title: "Uluwatu Temple & Sunset", description: "Cliffside temple visit with a traditional Kecak fire dance." },
      { day: "Day 6", title: "Free Day", description: "Optional surfing, spa, or island-hopping add-ons." },
      { day: "Day 7", title: "Departure", description: "Transfer to airport." },
    ],
    includes: ["Airport transfers", "6 nights hotel", "Daily breakfast", "Guided tours listed above", "Entrance fees"],
    excludes: ["International flights", "Travel insurance", "Lunch & dinner (except Day 5)", "Optional activities"],
  },
  {
    id: "santorini-escape",
    title: "Santorini Sunset Escape",
    destination: "Greece",
    duration: "5 Days",
    price: 1100,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    description:
      "Whitewashed villages, cliffside caldera views, and some of the best sunsets in the world — a short, scenic escape built around slowing down.",
    itinerary: [
      { day: "Day 1", title: "Arrival in Santorini", description: "Transfer to hotel in Oia, welcome dinner." },
      { day: "Day 2", title: "Oia & Caldera Walk", description: "Explore the village and walk the caldera-edge path to Fira." },
      { day: "Day 3", title: "Catamaran Cruise", description: "Sail past the volcano and hot springs, with a swim stop." },
      { day: "Day 4", title: "Wine Tasting in Pyrgos", description: "Visit a local vineyard and hilltop village." },
      { day: "Day 5", title: "Departure", description: "Free morning, transfer to airport." },
    ],
    includes: ["Airport transfers", "4 nights hotel", "Daily breakfast", "Catamaran cruise", "Wine tasting tour"],
    excludes: ["International flights", "Travel insurance", "Lunch & dinner (except Day 1)"],
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "United Kingdom",
    rating: 5,
    quote:
      "Our Everest Base Camp trek was flawlessly organized. The guides were knowledgeable and the whole trip felt effortless.",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "India",
    rating: 5,
    quote:
      "Bali getaway exceeded expectations. Every detail from hotels to transport was handled smoothly.",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Spain",
    rating: 4,
    quote:
      "Santorini escape was beautiful and well-paced. Would book with Paila again for our next trip.",
  },
];

export const stats = [
  { label: "Tours Completed", value: 500 },
  { label: "Destinations", value: 40 },
  { label: "Happy Travelers", value: 3200 },
  { label: "Years Experience", value: 8 },
];