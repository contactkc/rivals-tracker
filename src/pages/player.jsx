import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Box, Text, Spinner, Alert, AbsoluteCenter, 
  VStack, Image, Card, HStack, Avatar, Heading, SimpleGrid } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';

function Player() {
  const { username } = useParams();
  const { data, loading, error } = useApi(`player/${username}`);

  if (loading) return(
    <Box position="relative" height="100vh">
      <Navbar />
      <AbsoluteCenter>
        <VStack>
          <Spinner size="md" color="white" />
          <Text color="white">Loading player data...</Text>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
  
  if (error) return (
    <Box>
      <Navbar />
      <AbsoluteCenter>
        <VStack>
          <Alert status="error" mt={8} mx="auto" maxW="container.md">Error: {error}</Alert>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
  
  if (!loading && !error && (!data || data.length === 0)) return (
    <Box>
      <Navbar />
      <AbsoluteCenter>
        <VStack>
          <Text color="gray.400" mt={8} textAlign="center">No user data found.</Text>
        </VStack>
      </AbsoluteCenter>
    </Box>
    
  );

  const overallStats = data?.overall_stats;
  const heroMatchups = data?.hero_matchups;
  const teammates = data?.team_mates;

  // Calculate total KDA if overallStats and nested ranked/unranked exist
  const totalKills = (overallStats?.ranked?.total_kills ?? 0) + (overallStats?.unranked?.total_kills ?? 0);
  const totalDeaths = (overallStats?.ranked?.total_deaths ?? 0) + (overallStats?.unranked?.total_deaths ?? 0);
  const totalAssists = (overallStats?.ranked?.total_assists ?? 0) + (overallStats?.unranked?.total_assists ?? 0);

  // Access total matches and wins directly
  const totalMatchesPlayed = overallStats?.total_matches ?? 0;
  const totalWins = overallStats?.total_wins ?? 0;

  // Calculate overall win rate
  const overallWinRate = totalMatchesPlayed > 0 ? ((totalWins / totalMatchesPlayed) * 100).toFixed(2) : 'N/A';

  return (
    <Box color="white">
        <Navbar />
        {/* Basic Player Info Section */}
        <VStack spacing={8} mt={8} maxW="container.lg" mx="auto">
          <Card.Root mt={6} maxW="250px">
            <Card.Body>
                <VStack>
                    <Avatar.Root size="2xl">
                        <Avatar.Image src={`http://marvelrivalsapi.com/rivals${data.player.icon.player_icon}`} alt="Player Icon" />
                        <Avatar.Fallback name={data.player.name} />
                    </Avatar.Root>
                    <Text fontSize="2xl" fontWeight="bold">{data.player.name}</Text>
                    <Text fontSize="xs" fontStyle="italic" color="gray.400">UID: {data.player.uid}</Text>
                    <Text fontSize="lg" color="gray.400">Level: {data.player.level}</Text>
                </VStack>
            </Card.Body>
          </Card.Root>

          {/* Overall Stats Section */}
          {overallStats && 
          (
            <Box w="full" borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" borderColor="gray.700">
                <Heading size="md" mb={4}>Overall Stats</Heading>
                {/* Check if there are any stats to display before rendering the grid */}
                {totalMatchesPlayed > 0 || totalKills > 0 || totalDeaths > 0 || totalAssists > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {/* Display Total Matches */}
                        {totalMatchesPlayed > 0 && (
                            <Text>Total Matches: <Text as="span" fontWeight="bold">{totalMatchesPlayed}</Text></Text>
                        )}
                        {/* Display Total Wins */}
                        {totalWins > 0 && (
                            <Text>Total Wins: <Text as="span" fontWeight="bold">{totalWins}</Text></Text>
                        )}
                        {/* Display Overall Win Rate */}
                        {overallWinRate !== 'N/A' && (
                            <Text>Win Rate: <Text as="span" fontWeight="bold">{overallWinRate}%</Text></Text>
                        )}
                        {/* Display Total Kills */}
                        {totalKills > 0 && (
                              <Text>Total Kills: <Text as="span" fontWeight="bold">{totalKills}</Text></Text>
                        )}
                          {/* Display Total Deaths */}
                        {totalDeaths > 0 && (
                              <Text>Total Deaths: <Text as="span" fontWeight="bold">{totalDeaths}</Text></Text>
                        )}
                          {/* Display Total Assists */}
                        {totalAssists > 0 && (
                              <Text>Total Assists: <Text as="span" fontWeight="bold">{totalAssists}</Text></Text>
                        )}

                    </SimpleGrid>
                ) : (
                      <Text color="gray.500">No significant overall stats data available for this player.</Text>
                )}
            </Box>
          )}

          {/* Hero Matchups Section */}
          {heroMatchups && heroMatchups.length > 0 && 
          (
            <Box w="full" borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" borderColor="gray.700">
                <Heading size="md" mb={4}>Hero Matchups</Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {heroMatchups.map((hero, index) => 
                    (
                      <Box key={hero?.hero_id || index} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.700">
                            <HStack spacing={3} alignItems="center">
                                {/* Hero Thumbnail */}
                                {hero?.hero_thumbnail && (
                                    <Image src={`http://marvelrivalsapi.com/rivals${hero.hero_thumbnail}`} alt={hero.hero_name || 'Hero Icon'} boxSize="30px" borderRadius="full" />
                                )}
                                <VStack align="start" spacing={0}>
                                      {/* Hero Name */}
                                      <Text fontWeight="bold" fontSize="sm">{hero?.hero_name || 'Unknown Hero'}</Text>
                                      {/* Matches and Win Rate */}
                                      <Text fontSize="xs" color="gray.400">Matches: {hero?.matches ?? 0}</Text>
                                      {hero?.win_rate !== undefined && (
                                        <Text fontSize="xs" color="gray.400">Win Rate: {parseFloat(hero.win_rate).toFixed(2)}%</Text>
                                      )}
                                </VStack>
                            </HStack>
                      </Box>
                    ))}
                </SimpleGrid>
            </Box>
          )}

          {/* Teammates Section */}
          {teammates && teammates.length > 0 && 
          (
              <Box w="full" borderWidth="1px" borderRadius="lg" p={6} bg="gray.800" borderColor="gray.700">
                  <Heading size="md" mb={4}>Recent Teammates</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {teammates.map((teammate, index) => 
                      (
                        <Box key={teammate?.player_info?.player_uid || index} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.600" bg="gray.700">
                              <HStack spacing={3} alignItems="center">
                                  
                                  {teammate?.player_info?.player_icon && 
                                  (
                                      <Image src={`https://marvelrivalsapi.com${teammate.player_info.player_icon}`} alt={teammate?.player_info?.nick_name || 'Teammate Icon'} boxSize="30px" borderRadius="full" />
                                  )}
                                  <VStack align="start" spacing={0}>
                                        
                                        <Text fontWeight="bold" fontSize="sm">{teammate?.player_info?.nick_name || 'Unknown Teammate'}</Text>
                                        
                                        <Text fontSize="xs" color="gray.400">Matches: {teammate?.matches ?? 0}</Text>
                                        <Text fontSize="xs" color="gray.400">Wins: {teammate?.wins ?? 0}</Text>
                                        {teammate?.win_rate !== undefined && (
                                          <Text fontSize="xs" color="gray.400">Win Rate: {parseFloat(teammate.win_rate).toFixed(2)}%</Text>
                                        )}
                                  </VStack>
                              </HStack>
                        </Box>
                      ))}
                  </SimpleGrid>
              </Box>
          )}

        </VStack>
    </Box>
  );
}

export default Player;