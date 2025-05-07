import { useState, useEffect } from 'react';

function useMaps() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaps = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://marvelrivalsapi.com/api/v1/maps',
          {
            headers: {
              'x-api-key': import.meta.env.VITE_MARVEL_RIVALS_API_KEY || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch maps: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // process map data
        const processedMaps = data.maps.map((map) => {
          const largeImage = map.images?.[2];
          const imageUrl = largeImage
            ? `https://marvelrivalsapi.com${largeImage}`
            : 'https://marvelrivalsapi.com/rivals/maps/large/map_1032.png';

          return {
            name: map.name,
            location: map.location,
            description: map.description || 'No description provided...',
            gameMode: map.game_mode,
            video: map.video,
            imageUrl,
            alt: map.name,
          };
        });

        setMaps(processedMaps);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setMaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  return { maps, loading, error };
}

export default useMaps;
