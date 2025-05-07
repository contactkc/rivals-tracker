import { useState, useEffect } from 'react';

function usePatches() {
  const [patches, setPatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://marvelrivalsapi.com/api/v1/patch-notes',
          {
            headers: {
              'x-api-key': import.meta.env.VITE_MARVEL_RIVALS_API_KEY || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch patches: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // process patch data from the 'formatted_patches' key
        const patchData = Array.isArray(data.formatted_patches)
          ? data.formatted_patches
          : [];
        const processedPatches = patchData.map((patch) => {
          const imageSource = patch.imagePath
            ? `https://marvelrivalsapi.com/rivals${patch.imagePath}`
            : 'https://via.placeholder.com/600x200?text=Default+Patch+Image';

          // format date
          const date = new Date(patch.date);
          const formattedDate = date
            .toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            .replace(/(\d+)(?:st|nd|rd|th)/, '$1th');

          // clean up fullContent to extract relevant patch notes
          const relevantContent = patch.fullContent
            .split('The second half of Season 1 is coming soon!')[0]
            .split('Stay tuned for even more thrilling content')[0]
            .split('We will continue to vigilantly monitor game bug issues')[0]
            .replace(/Greetings, Rivals!.*?\n\n\n/, '')
            .replace(/Greetings, Rivals!.*?\n\n/, '')
            .replace(/Dear Rivals:.*?\n\n/, '')
            .replace(/Hello, Rivals!.*?\n\n/, '')
            .replace(/Hey, Rivals!.*?\n\n/, '')
            .replace(/Here's a look at what's coming in this patch:.*?\n\n/, '')
            .replace(/Without further ado, here are the details!.*?\n\n/, '')
            .trim();

          return {
            id: patch.id,
            title: `Patch #${patch.id}`,
            source: imageSource,
            alt: `Marvel Rivals Version ${patch.id} Patch Notes`,
            date: formattedDate,
            fullContent: relevantContent,
          };
        });

        setPatches(processedPatches);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setPatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatches();
  }, []);

  return { patches, loading, error };
}

export default usePatches;
