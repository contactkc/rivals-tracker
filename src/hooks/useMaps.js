import { useState, useEffect } from 'react';

function useMaps() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllMaps = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_MARVEL_RIVALS_API_KEY || '';
        let allMaps = [];
        let page = 1;
        let totalPages = 1;

        do {
          const response = await fetch(
            `https://marvelrivalsapi.com/api/v1/maps?page=${page}`,
            {
              headers: {
                'x-api-key': apiKey,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch maps: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();
          allMaps = allMaps.concat(data.maps);

          // calculate total pages from total_maps and maps per page
          if (page === 1 && data.total_maps && data.maps) {
            totalPages = Math.ceil(data.total_maps / data.maps.length);
          }

          page++;
        } while (page <= totalPages);

        // process map data
        const processedMaps = allMaps.map((map) => {
          const largeImage = map.images?.[2];
          const imageUrl = largeImage
            ? `https://marvelrivalsapi.com${largeImage}`
            : 'https://marvelrivalsapi.com/rivals/maps/large/map_1032.png';

          return {
            map_id: map.id,
            name: map.name,
            location: map.location,
            description: map.description || 'No description provided...',
            gameMode: map.game_mode
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
            video: map.video,
            imageUrl,
            alt: map.name,
            images: map.images,
          };
        });

        const uniqueMaps = [];
        const seenNames = new Set();
        for (const map of processedMaps) {
          const lowerName = map.name.toLowerCase();
          if (!seenNames.has(lowerName)) {
            seenNames.add(lowerName);
            uniqueMaps.push(map);
          }
        }

        setMaps(uniqueMaps);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setMaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMaps();
  }, []);

  return { maps, loading, error };
}

export default useMaps;
