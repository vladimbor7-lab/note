import axios from 'axios';

const TRAVELPAYOUTS_API_URL = 'https://engine.hotellook.com/api/v2';
const AUTOCOMPLETE_URL = 'https://autocomplete.travelpayouts.com/places2';

interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  priceAvg: number;
  rating: number;
  photoUrl: string;
  amenities: string[];
  distance: string;
}

export const searchHotels = async (
  query: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  token: string
): Promise<Hotel[]> => {
  try {
    // 1. Get location ID (IATA/City ID)
    const locationResponse = await axios.get(AUTOCOMPLETE_URL, {
      params: {
        term: query,
        locale: 'ru',
        types: 'city',
      },
    });

    if (!locationResponse.data || locationResponse.data.length === 0) {
      throw new Error('Location not found');
    }

    const location = locationResponse.data[0];
    const locationId = location.code; // IATA code or City ID

    // 2. Search for hotels (using the Price API or similar)
    // Note: The Price API usually requires a signature or token.
    // For this demo, we'll try to use the public search endpoint if available,
    // or simulate the structure if CORS blocks us.
    
    // Using a public endpoint for demonstration purposes (often CORS restricted)
    // In a real production app, this should be proxied through a backend.
    
    // Mocking the response structure as if it came from the API to avoid CORS issues in this preview environment
    // but demonstrating the logic flow.
    
    console.log(`Searching for hotels in ${location.name} (${locationId}) from ${checkIn} to ${checkOut}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data based on the location found
    return [
      {
        id: `hotel_${locationId}_1`,
        name: `${location.name} Grand Hotel`,
        location: `${location.name}, Center`,
        stars: 5,
        priceAvg: 15000 + Math.random() * 5000,
        rating: 4.8,
        photoUrl: `https://picsum.photos/seed/${locationId}1/800/600`,
        amenities: ['wifi', 'pool', 'spa', 'breakfast'],
        distance: '0.5 km from center',
      },
      {
        id: `hotel_${locationId}_2`,
        name: `${location.name} City Center`,
        location: `${location.name}, Downtown`,
        stars: 4,
        priceAvg: 8000 + Math.random() * 3000,
        rating: 4.5,
        photoUrl: `https://picsum.photos/seed/${locationId}2/800/600`,
        amenities: ['wifi', 'gym', 'parking'],
        distance: '1.2 km from center',
      },
      {
        id: `hotel_${locationId}_3`,
        name: `Budget Stay ${location.name}`,
        location: `${location.name}, Suburbs`,
        stars: 3,
        priceAvg: 4000 + Math.random() * 1000,
        rating: 4.2,
        photoUrl: `https://picsum.photos/seed/${locationId}3/800/600`,
        amenities: ['wifi', 'parking'],
        distance: '5.0 km from center',
      },
    ];

  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};
