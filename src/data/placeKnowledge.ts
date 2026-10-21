import type { Activity, BudgetBreakdown, DayItinerary, Hotel, PackingItem } from '../store/useStore';
import { getImageForPlace } from './destinations';

type KnownPlace = {
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  image?: string;
  duration?: string;
  cost?: number;
  rating?: number;
};

type KnownRestaurant = {
  name: string;
  cuisine: string;
  mustTry: string;
  location: string;
  lat: number;
  lng: number;
  rating?: number;
  priceRange?: string;
};

type KnownDestination = {
  key: string;
  label: string;
  country: string;
  currency: string;
  places: KnownPlace[];
  restaurants: KnownRestaurant[];
  hotels: Hotel[];
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
const CITY_IMAGE = 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80';
const BEACH_IMAGE = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80';
const PALACE_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed6979b?w=800&q=80';
const TEMPLE_IMAGE = 'https://images.unsplash.com/photo-1545594862-0cde20f6f6b8?w=800&q=80';
const WATER_IMAGE = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80';
const INTERNATIONAL_CITY_IMAGE = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80';

const makeHotel = (
  name: string,
  location: string,
  lat: number,
  lng: number,
  pricePerNight: number,
  stars = 4,
): Hotel => ({
  name,
  stars,
  pricePerNight,
  currency: 'INR',
  rating: 4.4,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  location,
  amenities: ['WiFi', 'Restaurant', 'AC', 'Breakfast'],
  description: `Comfortable stay near ${location} with easy access to major sightseeing areas.`,
  bookingUrl: 'https://www.booking.com',
  lat,
  lng,
});

export const TOURIST_PLACE_LIBRARY: KnownDestination[] = [
  {
    key: 'goa',
    label: 'Goa, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Baga Beach', location: 'Baga, North Goa', lat: 15.5553, lng: 73.7517, type: 'beach', description: 'Popular beach area known for shacks, water sports, and nightlife.', cost: 500 },
      { name: 'Calangute Beach', location: 'Calangute, North Goa', lat: 15.5439, lng: 73.7553, type: 'beach', description: 'One of Goa’s busiest beaches with long sandy stretches and cafes.', cost: 300 },
      { name: 'Fort Aguada', location: 'Candolim, Goa', lat: 15.4927, lng: 73.7730, type: 'historical', description: 'A 17th-century Portuguese fort overlooking the Arabian Sea.', cost: 100 },
      { name: 'Basilica of Bom Jesus', location: 'Old Goa', lat: 15.5009, lng: 73.9116, type: 'historical', description: 'UNESCO-listed basilica and one of Old Goa’s most important churches.', cost: 0 },
      { name: 'Dudhsagar Falls', location: 'Mollem, Goa', lat: 15.3144, lng: 74.3143, type: 'nature', description: 'A tall four-tiered waterfall in the Western Ghats.', duration: '4 hours', cost: 1200 },
      { name: 'Fontainhas Latin Quarter', location: 'Panjim, Goa', lat: 15.4989, lng: 73.8278, type: 'culture', description: 'Colorful Portuguese-era lanes, cafes, and heritage homes.', cost: 0 },
    ],
    restaurants: [
      { name: 'Britto’s', cuisine: 'Goan Seafood', mustTry: 'Fish curry rice', location: 'Baga Beach', lat: 15.5557, lng: 73.7515 },
      { name: 'Viva Panjim', cuisine: 'Goan', mustTry: 'Prawn balchao', location: 'Fontainhas, Panjim', lat: 15.4984, lng: 73.8272 },
    ],
    hotels: [
      makeHotel('Novotel Goa Candolim', 'Candolim, North Goa', 15.5150, 73.7651, 8500, 5),
      makeHotel('Vivanta Goa, Panaji', 'Panaji, Goa', 15.4968, 73.8278, 11000, 5),
    ],
  },
  {
    key: 'agra',
    label: 'Agra, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Taj Mahal', location: 'Dharmapuri, Agra', lat: 27.1751, lng: 78.0421, type: 'historical', description: 'The iconic white marble mausoleum and UNESCO World Heritage Site.', cost: 1100 },
      { name: 'Agra Fort', location: 'Rakabganj, Agra', lat: 27.1795, lng: 78.0211, type: 'historical', description: 'Massive Mughal red sandstone fort beside the Yamuna River.', cost: 650 },
      { name: 'Mehtab Bagh', location: 'Nagla Devjit, Agra', lat: 27.1797, lng: 78.0417, type: 'garden', description: 'Riverside garden with one of the best sunset views of the Taj Mahal.', cost: 300 },
      { name: 'Itmad-ud-Daulah', location: 'Moti Bagh, Agra', lat: 27.1929, lng: 78.0310, type: 'historical', description: 'A delicate marble tomb often called the Baby Taj.', cost: 300 },
      { name: 'Fatehpur Sikri', location: 'Fatehpur Sikri, Uttar Pradesh', lat: 27.0945, lng: 77.6679, type: 'historical', description: 'Former Mughal capital with palaces, courtyards, and Buland Darwaza.', duration: '4 hours', cost: 650 },
    ],
    restaurants: [
      { name: 'Pinch of Spice', cuisine: 'North Indian', mustTry: 'Mughlai curries', location: 'Fatehabad Road', lat: 27.1613, lng: 78.0362 },
      { name: 'Joney’s Place', cuisine: 'Cafe, Indian', mustTry: 'Malai kofta', location: 'Tajganj', lat: 27.1696, lng: 78.0417 },
    ],
    hotels: [
      makeHotel('Taj Hotel & Convention Centre Agra', 'Taj East Gate Road, Agra', 27.1610, 78.0489, 9000, 5),
      makeHotel('Crystal Sarovar Premiere', 'Fatehabad Road, Agra', 27.1577, 78.0368, 5500, 4),
    ],
  },
  {
    key: 'rajasthan',
    label: 'Rajasthan, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Amber Fort', location: 'Amer, Jaipur', lat: 26.9855, lng: 75.8513, type: 'historical', description: 'Hilltop Rajput fort with ornate palaces and courtyards.', cost: 500 },
      { name: 'City Palace Jaipur', location: 'Jaipur', lat: 26.9258, lng: 75.8237, type: 'palace', description: 'Royal palace complex with museums and courtyards.', cost: 300 },
      { name: 'Hawa Mahal', location: 'Jaipur', lat: 26.9239, lng: 75.8267, type: 'historical', description: 'The Palace of Winds, famous for its honeycomb facade.', cost: 200 },
      { name: 'Mehrangarh Fort', location: 'Jodhpur', lat: 26.2983, lng: 73.0180, type: 'fort', description: 'One of India’s grandest forts, rising above the Blue City.', cost: 600 },
      { name: 'Lake Pichola', location: 'Udaipur', lat: 24.5760, lng: 73.6790, type: 'lake', description: 'Scenic lake framed by palaces, ghats, and old city views.', cost: 500 },
      { name: 'Jaisalmer Fort', location: 'Jaisalmer', lat: 26.9124, lng: 70.9136, type: 'fort', description: 'Living golden sandstone fort in the Thar Desert.', cost: 250 },
      { name: 'Sam Sand Dunes', location: 'Jaisalmer', lat: 26.8406, lng: 70.5388, type: 'desert', description: 'Golden Thar Desert dunes for sunset views and camel safaris.', image: PALACE_IMAGE, duration: '3 hours', cost: 1200 },
    ],
    restaurants: [
      { name: 'Laxmi Misthan Bhandar', cuisine: 'Rajasthani', mustTry: 'Dal baati churma', location: 'Johari Bazaar, Jaipur', lat: 26.9166, lng: 75.8235 },
      { name: 'Gypsy Restaurant', cuisine: 'Rajasthani Thali', mustTry: 'Marwari thali', location: 'Jodhpur', lat: 26.2758, lng: 73.0089 },
    ],
    hotels: [
      makeHotel('Alsisar Haveli', 'Sansar Chandra Road, Jaipur', 26.9226, 75.8038, 7000, 4),
      makeHotel('Ratan Vilas', 'Jodhpur', 26.2711, 73.0183, 6500, 4),
    ],
  },
  {
    key: 'kerala',
    label: 'Kerala, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Alleppey Backwaters', location: 'Alappuzha', lat: 9.4981, lng: 76.3388, type: 'nature', description: 'Houseboat routes through quiet canals, villages, and lagoons.', duration: '4 hours', cost: 2500 },
      { name: 'Munnar Tea Gardens', location: 'Munnar', lat: 10.0889, lng: 77.0595, type: 'nature', description: 'Rolling tea estates and cool hill-station scenery.', cost: 200 },
      { name: 'Eravikulam National Park', location: 'Munnar', lat: 10.1970, lng: 77.0060, type: 'wildlife', description: 'Protected highland park known for Nilgiri tahr and views.', cost: 500 },
      { name: 'Fort Kochi', location: 'Kochi', lat: 9.9656, lng: 76.2427, type: 'culture', description: 'Historic coastal district with Chinese fishing nets and colonial streets.', cost: 0 },
      { name: 'Kovalam Beach', location: 'Thiruvananthapuram', lat: 8.3988, lng: 76.9789, type: 'beach', description: 'Famous crescent beach with lighthouse views.', cost: 0 },
    ],
    restaurants: [
      { name: 'Dhe Puttu', cuisine: 'Kerala', mustTry: 'Puttu and kadala curry', location: 'Kochi', lat: 10.0057, lng: 76.3070 },
      { name: 'Villa Maya', cuisine: 'Kerala, Global', mustTry: 'Seafood curry', location: 'Thiruvananthapuram', lat: 8.4932, lng: 76.9470 },
    ],
    hotels: [
      makeHotel('Fragrant Nature Kochi', 'Fort Kochi', 9.9635, 76.2504, 8500, 5),
      makeHotel('Abad Copper Castle', 'Munnar', 10.0800, 77.0647, 5500, 3),
    ],
  },
  {
    key: 'manali',
    label: 'Manali, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Hadimba Devi Temple', location: 'Old Manali', lat: 32.2483, lng: 77.1802, type: 'spiritual', description: 'Ancient wooden temple set among cedar forest.', cost: 0 },
      { name: 'Solang Valley', location: 'Burwa, Himachal Pradesh', lat: 32.3160, lng: 77.1570, type: 'adventure', description: 'Adventure valley for paragliding, skiing seasonally, and mountain views.', cost: 1500 },
      { name: 'Rohtang Pass', location: 'Himachal Pradesh', lat: 32.3719, lng: 77.2463, type: 'nature', description: 'High mountain pass with snow views when open.', duration: '5 hours', cost: 2000 },
      { name: 'Manu Temple', location: 'Old Manali', lat: 32.2574, lng: 77.1774, type: 'spiritual', description: 'Temple dedicated to Sage Manu in old Manali lanes.', cost: 0 },
      { name: 'Mall Road Manali', location: 'Manali', lat: 32.2432, lng: 77.1892, type: 'shopping', description: 'Central market street for cafes, woollens, and local food.', cost: 0 },
    ],
    restaurants: [
      { name: 'Johnson’s Cafe', cuisine: 'Continental, Himachali', mustTry: 'Trout fish', location: 'Circuit House Road', lat: 32.2465, lng: 77.1876 },
      { name: 'Cafe 1947', cuisine: 'Cafe, Italian', mustTry: 'Wood-fired pizza', location: 'Old Manali', lat: 32.2543, lng: 77.1776 },
    ],
    hotels: [
      makeHotel('The Himalayan', 'Hadimba Road, Manali', 32.2474, 77.1855, 9500, 5),
      makeHotel('Zostel Manali', 'Old Manali', 32.2551, 77.1774, 1200, 2),
    ],
  },
  {
    key: 'varanasi',
    label: 'Varanasi, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Kashi Vishwanath Temple', location: 'Lahori Tola, Varanasi', lat: 25.3109, lng: 83.0107, type: 'spiritual', description: 'One of India’s most sacred Shiva temples.', cost: 0 },
      { name: 'Dashashwamedh Ghat', location: 'Ghats of Varanasi', lat: 25.3062, lng: 83.0104, type: 'spiritual', description: 'Main ghat known for the evening Ganga Aarti.', cost: 0 },
      { name: 'Assi Ghat', location: 'Varanasi', lat: 25.2887, lng: 83.0068, type: 'spiritual', description: 'Lively southern ghat popular for morning rituals and cafes.', cost: 0 },
      { name: 'Sarnath', location: 'Sarnath, Varanasi', lat: 25.3762, lng: 83.0220, type: 'historical', description: 'Buddhist pilgrimage site where Buddha gave his first sermon.', cost: 300 },
      { name: 'Ramnagar Fort', location: 'Ramnagar, Varanasi', lat: 25.2692, lng: 83.0255, type: 'fort', description: '18th-century fort and museum across the Ganga.', cost: 200 },
    ],
    restaurants: [
      { name: 'Kashi Chat Bhandar', cuisine: 'Street Food', mustTry: 'Tamatar chaat', location: 'Godowlia', lat: 25.3098, lng: 83.0056 },
      { name: 'Brown Bread Bakery', cuisine: 'Cafe', mustTry: 'Thali and bakery items', location: 'Pandey Ghat', lat: 25.3045, lng: 83.0089 },
    ],
    hotels: [
      makeHotel('BrijRama Palace', 'Darbhanga Ghat, Varanasi', 25.3057, 83.0097, 18000, 5),
      makeHotel('Hotel Alka', 'Meer Ghat, Varanasi', 25.3083, 83.0103, 3000, 3),
    ],
  },
  {
    key: 'dubai',
    label: 'Dubai, UAE',
    country: 'UAE',
    currency: 'AED',
    places: [
      { name: 'Burj Khalifa', location: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, type: 'attraction', description: 'World-famous skyscraper with observation decks.', cost: 4500 },
      { name: 'Dubai Mall', location: 'Downtown Dubai', lat: 25.1975, lng: 55.2796, type: 'shopping', description: 'Huge mall with aquarium, dining, and entertainment.', cost: 0 },
      { name: 'Dubai Creek', location: 'Deira/Bur Dubai', lat: 25.2644, lng: 55.3117, type: 'culture', description: 'Historic waterway best explored by abra.', cost: 100 },
      { name: 'Palm Jumeirah', location: 'Dubai', lat: 25.1124, lng: 55.1390, type: 'attraction', description: 'Iconic palm-shaped island with resorts and viewpoints.', cost: 0 },
      { name: 'Al Fahidi Historical District', location: 'Bur Dubai', lat: 25.2637, lng: 55.3006, type: 'culture', description: 'Restored heritage quarter with wind towers and museums.', cost: 0 },
    ],
    restaurants: [
      { name: 'Arabian Tea House', cuisine: 'Emirati', mustTry: 'Machboos', location: 'Al Fahidi', lat: 25.2634, lng: 55.3008, priceRange: 'AED 70-120 per person' },
      { name: 'Al Ustad Special Kabab', cuisine: 'Persian', mustTry: 'Special kebab', location: 'Bur Dubai', lat: 25.2568, lng: 55.2976, priceRange: 'AED 45-80 per person' },
    ],
    hotels: [
      { ...makeHotel('Rove Downtown', 'Downtown Dubai', 25.2016, 55.2796, 9000, 3), currency: 'AED' },
      { ...makeHotel('Taj Dubai', 'Business Bay, Dubai', 25.1926, 55.2673, 18000, 5), currency: 'AED' },
    ],
  },
  {
    key: 'singapore',
    label: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    places: [
      { name: 'Gardens by the Bay', location: 'Marina Bay', lat: 1.2816, lng: 103.8636, type: 'nature', description: 'Futuristic gardens with Supertrees and cooled conservatories.', cost: 2500 },
      { name: 'Marina Bay Sands', location: 'Marina Bay', lat: 1.2834, lng: 103.8607, type: 'attraction', description: 'Iconic hotel and waterfront skyline landmark.', cost: 0 },
      { name: 'Sentosa Island', location: 'Sentosa', lat: 1.2494, lng: 103.8303, type: 'beach', description: 'Resort island with beaches and attractions.', cost: 1500 },
      { name: 'Chinatown Singapore', location: 'Outram', lat: 1.2836, lng: 103.8441, type: 'culture', description: 'Historic district with temples, markets, and hawker food.', cost: 0 },
      { name: 'Singapore Botanic Gardens', location: 'Tanglin', lat: 1.3138, lng: 103.8159, type: 'nature', description: 'UNESCO-listed tropical garden.', cost: 0 },
    ],
    restaurants: [
      { name: 'Tian Tian Hainanese Chicken Rice', cuisine: 'Singaporean', mustTry: 'Chicken rice', location: 'Maxwell Food Centre', lat: 1.2803, lng: 103.8448, priceRange: 'SGD 8-15 per person' },
      { name: 'Lau Pa Sat', cuisine: 'Hawker Food', mustTry: 'Satay', location: 'Raffles Quay', lat: 1.2806, lng: 103.8504, priceRange: 'SGD 12-25 per person' },
    ],
    hotels: [
      { ...makeHotel('Hotel Mi Bencoolen', 'Bencoolen, Singapore', 1.3003, 103.8494, 10000, 4), currency: 'SGD' },
      { ...makeHotel('Village Hotel Sentosa', 'Sentosa, Singapore', 1.2528, 103.8223, 17000, 4), currency: 'SGD' },
    ],
  },
  {
    key: 'mumbai',
    label: 'Mumbai, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Gateway of India', location: 'Apollo Bandar, Mumbai', lat: 18.9220, lng: 72.8347, type: 'historical', description: 'Mumbai’s landmark arch facing the Arabian Sea.', image: CITY_IMAGE, cost: 0 },
      { name: 'Marine Drive', location: 'South Mumbai', lat: 18.9432, lng: 72.8234, type: 'promenade', description: 'Iconic seaside boulevard also called the Queen’s Necklace.', image: CITY_IMAGE, cost: 0 },
      { name: 'Elephanta Caves', location: 'Elephanta Island', lat: 18.9633, lng: 72.9315, type: 'historical', description: 'UNESCO-listed rock-cut cave temples reached by ferry.', image: TEMPLE_IMAGE, duration: '4 hours', cost: 600 },
      { name: 'Chhatrapati Shivaji Maharaj Terminus', location: 'Fort, Mumbai', lat: 18.9402, lng: 72.8356, type: 'architecture', description: 'UNESCO-listed Victorian Gothic railway station.', image: CITY_IMAGE, cost: 0 },
      { name: 'Juhu Beach', location: 'Juhu, Mumbai', lat: 19.0988, lng: 72.8267, type: 'beach', description: 'Popular city beach known for sunset and street food.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Sanjay Gandhi National Park', location: 'Borivali, Mumbai', lat: 19.2147, lng: 72.9106, type: 'nature', description: 'Large protected urban forest with Kanheri Caves nearby.', image: WATER_IMAGE, cost: 100 },
    ],
    restaurants: [
      { name: 'Britannia & Co.', cuisine: 'Parsi', mustTry: 'Berry pulao', location: 'Ballard Estate', lat: 18.9346, lng: 72.8402 },
      { name: 'Trishna', cuisine: 'Seafood', mustTry: 'Butter garlic crab', location: 'Kala Ghoda', lat: 18.9288, lng: 72.8324 },
    ],
    hotels: [
      makeHotel('The Gordon House Hotel', 'Colaba, Mumbai', 18.9239, 72.8315, 8500, 4),
      makeHotel('Residency Hotel Fort', 'Fort, Mumbai', 18.9346, 72.8330, 6000, 3),
    ],
  },
  {
    key: 'andaman',
    label: 'Andaman Islands, India',
    country: 'India',
    currency: 'INR',
    places: [
      { name: 'Radhanagar Beach', location: 'Havelock Island', lat: 11.9844, lng: 92.9508, type: 'beach', description: 'A celebrated white-sand beach with clear blue water.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Cellular Jail', location: 'Port Blair', lat: 11.6757, lng: 92.7470, type: 'historical', description: 'Colonial-era prison and important freedom struggle memorial.', image: CITY_IMAGE, cost: 300 },
      { name: 'Netaji Subhash Chandra Bose Island', location: 'Near Port Blair', lat: 11.6767, lng: 92.7626, type: 'historical', description: 'Former Ross Island with colonial ruins and sea views.', image: BEACH_IMAGE, cost: 200 },
      { name: 'Bharatpur Beach', location: 'Neil Island', lat: 11.8354, lng: 93.0344, type: 'beach', description: 'Shallow turquoise beach good for glass-bottom boat rides.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Elephant Beach', location: 'Havelock Island', lat: 12.0033, lng: 92.9486, type: 'adventure', description: 'Popular snorkeling and water sports beach.', image: BEACH_IMAGE, cost: 1000 },
    ],
    restaurants: [
      { name: 'New Lighthouse Restaurant', cuisine: 'Seafood', mustTry: 'Grilled fish', location: 'Port Blair', lat: 11.6689, lng: 92.7476 },
      { name: 'Anju Coco Resto', cuisine: 'Seafood, Indian', mustTry: 'Prawn curry', location: 'Havelock Island', lat: 11.9658, lng: 92.9888 },
    ],
    hotels: [
      makeHotel('SeaShell Havelock', 'Havelock Island', 11.9650, 92.9940, 12000, 4),
      makeHotel('Sinclairs Bayview', 'Port Blair', 11.6641, 92.7476, 7000, 4),
    ],
  },
  {
    key: 'bali',
    label: 'Bali, Indonesia',
    country: 'Indonesia',
    currency: 'IDR',
    places: [
      { name: 'Uluwatu Temple', location: 'Pecatu, Bali', lat: -8.8291, lng: 115.0849, type: 'spiritual', description: 'Clifftop sea temple famous for sunset and Kecak dance.', image: TEMPLE_IMAGE, cost: 700 },
      { name: 'Tegallalang Rice Terraces', location: 'Ubud, Bali', lat: -8.4310, lng: 115.2793, type: 'nature', description: 'Layered rice terraces north of Ubud.', image: WATER_IMAGE, cost: 300 },
      { name: 'Tanah Lot', location: 'Beraban, Bali', lat: -8.6212, lng: 115.0868, type: 'spiritual', description: 'Sea temple set dramatically on an offshore rock.', image: TEMPLE_IMAGE, cost: 600 },
      { name: 'Mount Batur', location: 'Kintamani, Bali', lat: -8.2423, lng: 115.3754, type: 'adventure', description: 'Volcano trek popular for sunrise views.', image: WATER_IMAGE, duration: '5 hours', cost: 2500 },
      { name: 'Seminyak Beach', location: 'Seminyak, Bali', lat: -8.6913, lng: 115.1574, type: 'beach', description: 'Upscale beach area with cafes and sunset spots.', image: BEACH_IMAGE, cost: 0 },
    ],
    restaurants: [
      { name: 'Warung Babi Guling Ibu Oka', cuisine: 'Balinese', mustTry: 'Babi guling', location: 'Ubud', lat: -8.5069, lng: 115.2625, priceRange: 'IDR 80k-150k per person' },
      { name: 'Made’s Warung Seminyak', cuisine: 'Indonesian', mustTry: 'Nasi campur', location: 'Seminyak', lat: -8.6908, lng: 115.1661, priceRange: 'IDR 100k-200k per person' },
    ],
    hotels: [
      { ...makeHotel('Adiwana Unagi Suites', 'Ubud, Bali', -8.4948, 115.2645, 9000, 4), currency: 'IDR' },
      { ...makeHotel('Courtyard by Marriott Bali Seminyak', 'Seminyak, Bali', -8.6894, 115.1645, 14000, 5), currency: 'IDR' },
    ],
  },
  {
    key: 'paris',
    label: 'Paris, France',
    country: 'France',
    currency: 'EUR',
    places: [
      { name: 'Eiffel Tower', location: 'Champ de Mars, Paris', lat: 48.8584, lng: 2.2945, type: 'landmark', description: 'Paris’s most famous iron tower and observation point.', image: INTERNATIONAL_CITY_IMAGE, cost: 2500 },
      { name: 'Louvre Museum', location: 'Rue de Rivoli, Paris', lat: 48.8606, lng: 2.3376, type: 'museum', description: 'World-class museum home to the Mona Lisa and vast collections.', image: INTERNATIONAL_CITY_IMAGE, cost: 1900 },
      { name: 'Notre-Dame Cathedral', location: 'Ile de la Cite, Paris', lat: 48.8530, lng: 2.3499, type: 'historical', description: 'Gothic cathedral landmark on the Seine.', image: INTERNATIONAL_CITY_IMAGE, cost: 0 },
      { name: 'Montmartre and Sacre-Coeur', location: 'Montmartre, Paris', lat: 48.8867, lng: 2.3431, type: 'culture', description: 'Hilltop basilica and artsy neighborhood views.', image: INTERNATIONAL_CITY_IMAGE, cost: 0 },
      { name: 'Palace of Versailles', location: 'Versailles', lat: 48.8049, lng: 2.1204, type: 'palace', description: 'Grand royal palace and gardens outside Paris.', image: PALACE_IMAGE, duration: '5 hours', cost: 2200 },
    ],
    restaurants: [
      { name: 'Bouillon Chartier', cuisine: 'French', mustTry: 'Confit de canard', location: 'Grands Boulevards', lat: 48.8718, lng: 2.3437, priceRange: 'EUR 20-35 per person' },
      { name: 'Le Relais de l’Entrecote', cuisine: 'French', mustTry: 'Steak frites', location: 'Saint-Germain', lat: 48.8555, lng: 2.3334, priceRange: 'EUR 35-50 per person' },
    ],
    hotels: [
      { ...makeHotel('Hotel Joke Astotel', '9th Arrondissement, Paris', 48.8825, 2.3330, 16000, 3), currency: 'EUR' },
      { ...makeHotel('Novotel Paris Les Halles', 'Les Halles, Paris', 48.8606, 2.3467, 23000, 4), currency: 'EUR' },
    ],
  },
  {
    key: 'maldives',
    label: 'Maldives',
    country: 'Maldives',
    currency: 'USD',
    places: [
      { name: 'Male City', location: 'Male', lat: 4.1755, lng: 73.5093, type: 'culture', description: 'Compact capital with markets, mosques, and waterfront views.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Hulhumale Beach', location: 'Hulhumale', lat: 4.2105, lng: 73.5449, type: 'beach', description: 'Accessible beach near Velana International Airport.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Maafushi Island', location: 'Kaafu Atoll', lat: 3.9423, lng: 73.4907, type: 'beach', description: 'Popular local island for budget stays and excursions.', image: BEACH_IMAGE, cost: 0 },
      { name: 'Banana Reef', location: 'North Male Atoll', lat: 4.2424, lng: 73.5292, type: 'adventure', description: 'Famous dive and snorkeling reef.', image: BEACH_IMAGE, cost: 3500 },
      { name: 'Vaadhoo Island', location: 'Raa Atoll', lat: 5.8575, lng: 72.9929, type: 'nature', description: 'Known for seasonal bioluminescent beach sightings.', image: BEACH_IMAGE, cost: 0 },
    ],
    restaurants: [
      { name: 'Seagull Cafe House', cuisine: 'Maldivian, Cafe', mustTry: 'Reef fish curry', location: 'Male', lat: 4.1769, lng: 73.5100, priceRange: 'USD 15-30 per person' },
      { name: 'Arena Beach Restaurant', cuisine: 'Seafood', mustTry: 'Grilled tuna', location: 'Maafushi', lat: 3.9439, lng: 73.4912, priceRange: 'USD 20-40 per person' },
    ],
    hotels: [
      { ...makeHotel('Samann Grand', 'Male', 4.1773, 73.5174, 13000, 4), currency: 'USD' },
      { ...makeHotel('Arena Beach Hotel', 'Maafushi', 3.9445, 73.4911, 10000, 4), currency: 'USD' },
    ],
  },
  {
    key: 'tokyo',
    label: 'Tokyo, Japan',
    country: 'Japan',
    currency: 'JPY',
    places: [
      { name: 'Senso-ji Temple', location: 'Asakusa, Tokyo', lat: 35.7148, lng: 139.7967, type: 'spiritual', description: 'Tokyo’s oldest temple and lively Nakamise shopping street.', image: TEMPLE_IMAGE, cost: 0 },
      { name: 'Shibuya Crossing', location: 'Shibuya, Tokyo', lat: 35.6595, lng: 139.7005, type: 'landmark', description: 'World-famous pedestrian crossing surrounded by neon and shops.', image: INTERNATIONAL_CITY_IMAGE, cost: 0 },
      { name: 'Meiji Shrine', location: 'Shibuya, Tokyo', lat: 35.6764, lng: 139.6993, type: 'spiritual', description: 'Peaceful Shinto shrine in a forested city park.', image: TEMPLE_IMAGE, cost: 0 },
      { name: 'Tokyo Skytree', location: 'Sumida, Tokyo', lat: 35.7101, lng: 139.8107, type: 'landmark', description: 'Tall broadcast tower with observation decks.', image: INTERNATIONAL_CITY_IMAGE, cost: 2200 },
      { name: 'Tsukiji Outer Market', location: 'Chuo, Tokyo', lat: 35.6655, lng: 139.7707, type: 'food', description: 'Busy food market known for seafood, snacks, and breakfast spots.', image: CITY_IMAGE, cost: 0 },
    ],
    restaurants: [
      { name: 'Sushizanmai Tsukiji', cuisine: 'Sushi', mustTry: 'Tuna nigiri', location: 'Tsukiji', lat: 35.6655, lng: 139.7708, priceRange: 'JPY 2500-5000 per person' },
      { name: 'Ichiran Shibuya', cuisine: 'Ramen', mustTry: 'Tonkotsu ramen', location: 'Shibuya', lat: 35.6607, lng: 139.6999, priceRange: 'JPY 1200-2200 per person' },
    ],
    hotels: [
      { ...makeHotel('Richmond Hotel Premier Asakusa', 'Asakusa, Tokyo', 35.7130, 139.7930, 11000, 4), currency: 'JPY' },
      { ...makeHotel('JR Kyushu Hotel Blossom Shinjuku', 'Shinjuku, Tokyo', 35.6888, 139.7008, 18000, 4), currency: 'JPY' },
    ],
  },
];

export function findKnownDestination(destination: string): KnownDestination | undefined {
  const normalized = destination.toLowerCase();
  return TOURIST_PLACE_LIBRARY.find(item =>
    normalized.includes(item.key) || item.label.toLowerCase().includes(normalized.replace(', india', '').trim()),
  );
}

function toActivity(place: KnownPlace): Activity {
  return {
    name: place.name,
    description: place.description,
    duration: place.duration || '2 hours',
    cost: place.cost ?? 0,
    rating: place.rating || 4.5,
    image: place.image || getImageForPlace(place.name) || DEFAULT_IMAGE,
    location: place.location,
    lat: place.lat,
    lng: place.lng,
    type: place.type,
  };
}

export function buildDestinationFallbackItinerary(
  destination: string,
  days: number,
  startDate: string,
  budget: number,
  currency: string,
) {
  const known = findKnownDestination(destination) || TOURIST_PLACE_LIBRARY[0];
  const selectedDays = Math.max(1, days);
  const itinerary: DayItinerary[] = Array.from({ length: selectedDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    const offset = (index * 3) % known.places.length;
    const dayPlaces = [known.places[offset], known.places[(offset + 1) % known.places.length], known.places[(offset + 2) % known.places.length]];
    const restaurant = known.restaurants[index % known.restaurants.length];

    return {
      day: index + 1,
      date: date.toISOString().split('T')[0],
      theme: `${known.label} Highlights`,
      morning: [toActivity(dayPlaces[0])],
      afternoon: [toActivity(dayPlaces[1])],
      evening: [toActivity(dayPlaces[2])],
      restaurants: [{
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        priceRange: restaurant.priceRange || `${currency} 500-1200 per person`,
        rating: restaurant.rating || 4.4,
        image: getImageForPlace('restaurant'),
        mustTry: restaurant.mustTry,
        location: restaurant.location,
        lat: restaurant.lat,
        lng: restaurant.lng,
      }],
      dailyExpense: Math.max(1500, Math.round(budget / selectedDays)),
      tips: ['Verify opening hours before visiting.', 'Keep extra time for local traffic and queues.'],
      localTransport: known.country === 'India' ? 'Use local taxis, autos, metro where available, or a pre-booked day cab.' : 'Use public transport, taxis, or a pre-booked day tour.',
    };
  });

  const packingList: PackingItem[] = [
    { category: 'Documents', icon: 'ID', items: ['Government ID or passport', 'Hotel booking details', 'Emergency contacts'] },
    { category: 'Daily Carry', icon: 'Bag', items: ['Water bottle', 'Power bank', 'Comfortable walking shoes', 'Sunscreen'] },
    { category: 'Local Ready', icon: 'Map', items: ['Offline maps', 'Small cash', 'Weather-appropriate clothing'] },
  ];

  const budgetBreakdown: BudgetBreakdown = {
    hotel: Math.round(budget * 0.4),
    food: Math.round(budget * 0.22),
    transport: Math.round(budget * 0.16),
    activities: Math.round(budget * 0.14),
    shopping: Math.round(budget * 0.05),
    miscellaneous: Math.round(budget * 0.03),
    total: budget,
    currency,
    alternatives: [
      { category: 'Hotel', original: Math.round(budget * 0.4), cheaper: Math.round(budget * 0.25), tip: 'Choose a guesthouse or hotel slightly away from the main tourist zone.' },
      { category: 'Transport', original: Math.round(budget * 0.16), cheaper: Math.round(budget * 0.09), tip: 'Group nearby places together and use public transport where practical.' },
    ],
  };

  return {
    itinerary,
    hotels: known.hotels.map(hotel => ({ ...hotel, currency })),
    packingList,
    budgetBreakdown,
  };
}

export function enrichItineraryWithKnownPlaces(destination: string, data: any) {
  const known = findKnownDestination(destination);
  if (!known || !data?.itinerary) return data;
  
  
  const usedPlaces = new Set<string>();
  const placesByName = new Map(known.places.map(place => [place.name.toLowerCase(), place]));
  const restaurantsByName = new Map(known.restaurants.map(place => [place.name.toLowerCase(), place]));

  const patchActivity = (activity: Activity, fallbackIndex: number): Activity => {
    const exact = placesByName.get(activity.name?.toLowerCase?.() || '');
    let place = exact;

if (!place || usedPlaces.has(place.name.toLowerCase())) {
  place =
    known.places.find(
      p => !usedPlaces.has(p.name.toLowerCase())
    ) || known.places[fallbackIndex % known.places.length];
}

usedPlaces.add(place.name.toLowerCase());
    return {
      ...activity,
      name: exact ? place.name : activity.name || place.name,
      location: exact ? place.location : activity.location || place.location,
      lat: exact ? place.lat : activity.lat || place.lat,
      lng: exact ? place.lng : activity.lng || place.lng,
      type: activity.type || place.type,
      image: place.image || getImageForPlace(place.name) || activity.image || DEFAULT_IMAGE,
    };
  };
  const removeDuplicates = (activities: Activity[]) => {
  const unique: Activity[] = [];

  for (const activity of activities) {
    const exists = unique.some(
      a => a.name.toLowerCase() === activity.name.toLowerCase()
    );

    if (!exists) {
      unique.push(activity);
    }
  }

  return unique;
};

  let activityIndex = 0;
  data.itinerary = data.itinerary.map((day: DayItinerary) => ({
    ...day,
    morning: removeDuplicates(
  (day.morning || []).map(activity =>
    patchActivity(activity, activityIndex++)
  )
),

afternoon: removeDuplicates(
  (day.afternoon || []).map(activity =>
    patchActivity(activity, activityIndex++)
  )
),

evening: removeDuplicates(
  (day.evening || []).map(activity =>
    patchActivity(activity, activityIndex++)
  )
),
    restaurants: (day.restaurants || []).map((restaurant, index) => {
      const exact = restaurantsByName.get(restaurant.name?.toLowerCase?.() || '');
      const fallback = known.restaurants[index % known.restaurants.length];
      const place = exact || fallback;
      return {
        ...restaurant,
        name: exact ? place.name : restaurant.name || place.name,
        cuisine: restaurant.cuisine || place.cuisine,
        mustTry: restaurant.mustTry || place.mustTry,
        location: exact ? place.location : restaurant.location || place.location,
        lat: exact ? place.lat : restaurant.lat || place.lat,
        lng: exact ? place.lng : restaurant.lng || place.lng,
      };
    }),
  }));

  data.hotels = (data.hotels?.length ? data.hotels : known.hotels).map((hotel: Hotel, index: number) => ({
    ...known.hotels[index % known.hotels.length],
    ...hotel,
    lat: hotel.lat || known.hotels[index % known.hotels.length].lat,
    lng: hotel.lng || known.hotels[index % known.hotels.length].lng,
  }));

  return data;
}
