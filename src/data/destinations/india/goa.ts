import { Destination } from "../destinationTypes";

export const goa: Destination = {
  id: "goa",

  name: "Goa",

  state: "Goa",

  country: "India",

  heroImage:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",

  description:
    "Goa is India's most popular beach destination, famous for beaches, Portuguese heritage, nightlife, seafood, churches, forts and water sports.",

  famousFoods: [
    "Goan Fish Curry",
    "Prawn Balchão",
    "Vindaloo",
    "Bebinca",
    "Feni"
  ],

  localTransport: [
    "Taxi",
    "Rental Scooter",
    "Bus",
    "Auto",
    "Self Drive Car"
  ],

  bestSeason: "October to March",

  airport: "Manohar International Airport (GOX)",

  railwayStation: "Madgaon Junction",

  languages: [
    "Konkani",
    "English",
    "Hindi"
  ],

  currency: "INR",

  famousPlaces: [
  {
    id: "calangute",
    name: "Calangute Beach",
    category: "Beach",
    description:
      "The largest and most famous beach in Goa, known for water sports, nightlife, beach shacks and shopping.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
    latitude: 15.5439,
    longitude: 73.7553,
    duration: "2 Hours",
    estimatedCost: 500,
    rating: 4.7,
    famousFor: ["Beach", "Water Sports", "Sunset"],
    bestTime: "Morning & Evening",
    tips: [
      "Visit before noon to avoid crowds",
      "Try parasailing",
      "Carry sunscreen"
    ]
  },

  {
    id: "baga",
    name: "Baga Beach",
    category: "Beach",
    description:
      "Popular for nightlife, clubs, cafes and exciting water sports.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    latitude: 15.5553,
    longitude: 73.7517,
    duration: "3 Hours",
    estimatedCost: 800,
    rating: 4.8,
    famousFor: ["Nightlife", "Beach", "Water Sports"],
    bestTime: "Evening",
    tips: [
      "Visit Tito's Lane",
      "Enjoy beach cafes",
      "Book water sports early"
    ]
  },

  {
    id: "aguada",
    name: "Fort Aguada",
    category: "Historical",
    description:
      "A 17th-century Portuguese fort overlooking the Arabian Sea.",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41",
    latitude: 15.4936,
    longitude: 73.7737,
    duration: "2 Hours",
    estimatedCost: 100,
    rating: 4.8,
    famousFor: ["History", "Fort", "Photography"],
    bestTime: "Morning",
    tips: [
      "Carry water",
      "Wear comfortable shoes",
      "Ideal for photography"
    ]
  },

  {
    id: "bomjesus",
    name: "Basilica of Bom Jesus",
    category: "Church",
    description:
      "UNESCO World Heritage Site famous for Portuguese architecture.",
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b",
    latitude: 15.5009,
    longitude: 73.9115,
    duration: "1.5 Hours",
    estimatedCost: 0,
    rating: 4.8,
    famousFor: ["Church", "UNESCO", "Architecture"],
    bestTime: "Morning",
    tips: [
      "Dress modestly",
      "Photography allowed",
      "Visit with Se Cathedral"
    ]
  },

  {
    id: "dudhsagar",
    name: "Dudhsagar Waterfalls",
    category: "Nature",
    description:
      "One of India's tallest waterfalls surrounded by lush forests.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    latitude: 15.3144,
    longitude: 74.3148,
    duration: "Half Day",
    estimatedCost: 1200,
    rating: 4.9,
    famousFor: ["Waterfall", "Nature", "Trekking"],
    bestTime: "Monsoon",
    tips: [
      "Wear trekking shoes",
      "Carry water",
      "Visit early morning"
    ]
  }
]
};

export default goa;