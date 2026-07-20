const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search'


export async function searchCollege(collegeName, country = 'India') {
  if (!collegeName) {
    console.error('searchCollege was called without a college name!');
    return null;
  }

  const url = new URL(NOMINATIM_BASE_URL);

  url.searchParams.append('amenity', collegeName);
  url.searchParams.append('country', country);
  url.searchParams.append('format', 'jsonv2');
  url.searchParams.append('addressdetails', '1');
  url.searchParams.append('limit', '3');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CampusCompass-StudentProject/1.0 (dinku@local.dev)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log(`No location found for '${collegeName}'`);
      return null;
    }

    return data;

  } catch (error) {
    console.error('Geocoding failed: ', error);
    return null;
  }
}