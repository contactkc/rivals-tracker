import { useState, useEffect } from 'react';

function useHeroes() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://marvelrivalsapi.com/api/v1/heroes',
          {
            headers: {
              'x-api-key': import.meta.env.VITE_MARVEL_RIVALS_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch heroes: ${response.statusText}`);
        }

        const data = await response.json();

        // process hero data
        const processedHeroes = data.map((hero) => {
          const normalizedHeroName = hero.name
            .replace(/&/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

          const normalizedRealName = hero.real_name
            ? hero.real_name
                .replace(/&/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase()
            : '';

          const matchingCostume = hero.costumes?.find((costume) => {
            const normalizedCostumeName = costume.name.toLowerCase();
            return (
              normalizedCostumeName === normalizedHeroName ||
              normalizedCostumeName === normalizedRealName
            );
          });

          const iconPath = matchingCostume?.icon?.replace(/^\/+/, '');
          const imageUrl = matchingCostume?.icon
            ? `https://marvelrivalsapi.com/rivals/${iconPath}`
            : `https://marvelrivalsapi.com/rivals/costumes/phantom-purple-ps1048503.png`;

          const processedRealName = hero.real_name
            ? hero.real_name.replace(
                /"([^"]+)"/g,
                (match, middleName) =>
                  `"${middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase()}"`
              )
            : hero.real_name;

          return {
            name: hero.name
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '), // "hulk" = "Hulk", "emma frost" = "Emma Frost"
            real_name: processedRealName,
            bio: hero.bio,
            imageUrl,
            alt: hero.name,
            difficulty: mapDifficulty(hero.difficulty),
            role: hero.role,
          };
        });

        setHeroes(processedHeroes);
        setError(null);
      } catch (err) {
        setError(err.message);
        setHeroes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  return { heroes, loading, error };
}

// map the difficulty 1–5 to labels
function mapDifficulty(difficulty) {
  switch (parseInt(difficulty)) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    case 4:
      return 'Very Hard';
    case 5:
      return 'Extremely Hard';
    default:
      return 'Unknown';
  }
}

export default useHeroes;
