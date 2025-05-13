import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import useMaps from '../hooks/useMaps';
import { Box, Text, Spinner, Alert, AbsoluteCenter, 
  VStack, Image, Card, HStack, Avatar, Heading, SimpleGrid, Badge, Tag } from '@chakra-ui/react';
import { Chart, useChart, BarSegment } from "@chakra-ui/charts";
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import Navbar from '@/components/Navbar';

function Player() {
  const { username } = useParams();
  const { data, loading, error } = useApi(`player/${username}`);
  const { data: matchHistoryData } = useApi(username ? `player/${username}/match-history` : null);
  const { maps: mapsData, loading: mapsLoading } = useMaps();
  const [chartMode, setChartMode] = useState('winRate');
  const [mapsChartData, setMapsChartData] = useState([]);
  
  useEffect(() => {
    if (!loading && data?.maps && Array.isArray(data.maps) && mapsData && Array.isArray(mapsData)) {
      const processedMapData = data.maps
        .filter(mapData => mapData && mapData.map_id !== undefined && mapData.matches !== undefined)
        .map(mapData => {
          const mapRef = mapsData.find(m => Number(m.map_id) === Number(mapData.map_id));
          return {
            ...mapData,
            mapRef: mapRef,
            name: mapRef?.name
          };
        })
        .filter(mapData => mapData.name)
        .sort((a, b) => b.matches - a.matches)
        .map((mapData, index) => {
          const colorIndex = index % 5;
          const colorMap = [
            "gray.100",
            "gray.200",
            "gray.300",
            "gray.400",
            "gray.500",
          ];
          
          return {
            name: mapData.name,
            value: mapData.matches,
            color: colorMap[colorIndex]
          };
        });
      
      console.log("Processed map data:", processedMapData);
      setMapsChartData(processedMapData);
    }
  }, [data, mapsData, loading]);
  
  // helper function to format hero names
  function formatHeroName(name) {
    if (!name) return 'Unknown Hero';
    return name
      .split(' ')
      .map(word =>
        word
          .split(/([&-])/g)
          .map(part =>
            part.match(/[a-zA-Z]/)
              ? part.charAt(0).toUpperCase() + part.slice(1)
              : part
          )
          .join('')
      )
      .join(' ');
  }

  function getCombinedHeroData() {
    if (!data || !data.heroes_ranked || !data.heroes_unranked) return [];
    
    // map to combine heroes from ranked and unranked modes
    const heroesMap = new Map();
    
    // process the ranked heroes
    data.heroes_ranked.forEach(hero => {
      if (hero.hero_id && hero.hero_name !== "Unknown") {
        heroesMap.set(hero.hero_id, {
          name: formatHeroName(hero.hero_name),
          matches: hero.matches || 0,
          wins: hero.wins || 0
        });
      }
    });
    
    // add or update with unranked heroes
    data.heroes_unranked.forEach(hero => {
      if (hero.hero_id && hero.hero_name !== "Unknown") {
        const existing = heroesMap.get(hero.hero_id);
        if (existing) {
          heroesMap.set(hero.hero_id, {
            ...existing,
            matches: existing.matches + (hero.matches || 0),
            wins: existing.wins + (hero.wins || 0)
          });
        } else {
          heroesMap.set(hero.hero_id, {
            name: formatHeroName(hero.hero_name),
            matches: hero.matches || 0,
            wins: hero.wins || 0
          });
        }
      }
    });
    
    // win rate calculation
    return Array.from(heroesMap.values())
      .filter(hero => hero.matches > 0)
      .map(hero => ({
        name: hero.name,
        matches: hero.matches,
        winRate: hero.matches > 0 ? (hero.wins / hero.matches * 100) : 0
      }));
  }
  
  const combinedHeroes = !loading ? getCombinedHeroData() : [];

  const heroWinRateData = combinedHeroes
    .filter(hero => hero.matches >= 3)
    .sort((a, b) => b.winRate - a.winRate)
    .map(hero => ({
      name: hero.name,
      "Win Rate": parseFloat(hero.winRate.toFixed(2))
    }));

  const heroMatchesData = combinedHeroes
    .sort((a, b) => b.matches - a.matches)
    .map(hero => ({
      name: hero.name,
      Matches: hero.matches
    }));
  
  const kdaAreaData = !loading && matchHistoryData?.match_history ? 
    matchHistoryData.match_history.reverse().map((match, index) => {
      const perf = match?.player_performance || {};
      const kda = perf.deaths > 0 ? 
        ((perf.kills || 0) + (perf.assists || 0)) / (perf.deaths || 1) : 
        (perf.kills || 0) + (perf.assists || 0);
      
      return {
        match: `Match ${index + 1}`,
        KDA: parseFloat(kda.toFixed(2)),
        hero: formatHeroName(perf?.hero_name || 'Unknown')
      };
    })
    : [];
  
  // chart hooks
  const heroWinRateChart = useChart({
    data: heroWinRateData,
    colors: {
      "Win Rate": "gray.400" 
    }
  });
  
  const heroMatchesChart = useChart({
    data: heroMatchesData,
    colors: {
      "Matches": "gray.400"
    }
  });
  
  const kdaAreaChart = useChart({
    data: kdaAreaData,
    colors: {
      "KDA": "gray.400"
    }
  });

  const mapsChart = useChart({
    sort: { by: "value", direction: "desc" },
    data: mapsChartData
  });

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
  const matchHistory = matchHistoryData?.match_history || [];

  // calculate total KDA if overallStats and nested ranked/unranked exist
  const totalKills = (overallStats?.ranked?.total_kills ?? 0) + (overallStats?.unranked?.total_kills ?? 0);
  const totalDeaths = (overallStats?.ranked?.total_deaths ?? 0) + (overallStats?.unranked?.total_deaths ?? 0);
  const totalAssists = (overallStats?.ranked?.total_assists ?? 0) + (overallStats?.unranked?.total_assists ?? 0);

  // access total matches and wins
  const totalMatchesPlayed = overallStats?.total_matches ?? 0;
  const totalWins = overallStats?.total_wins ?? 0;

  // calculate overall win rate
  const overallWinRate = totalMatchesPlayed > 0 ? ((totalWins / totalMatchesPlayed) * 100).toFixed(2) : 'N/A';

  return (
    <Box color="white">
        <Navbar />

        <Text fontSize="xl" fontWeight="600">Player Statistics</Text>
        <VStack spacing={8} maxW="container.lg" mx="auto">
          <HStack maxW="full" w="100%">
            <Card.Root mt={6} maxW="250px" rounded="3xl" w="250px">
              <Card.Body>
                  <VStack>
                      <Avatar.Root size="2xl">
                          <Avatar.Image src={`http://marvelrivalsapi.com/rivals${data.player.icon.player_icon}`} alt="Player Icon" />
                          <Avatar.Fallback name={data.player.name} />
                      </Avatar.Root>
                      <HStack spacing={2} alignItems="center">
                        <Text fontSize="2xl" fontWeight="bold">{data.player.name}</Text>
                        {data.player?.rank?.image && (<Image src={`http://marvelrivalsapi.com/rivals${data.player.rank.image}`} alt={`${data.player.rank.rank} Rank Icon`} height="30px" />)}
                      </HStack>
                      <Text fontSize="xs" fontStyle="italic" color="gray.400">UID: {data.player.uid}</Text>
                      <Text fontSize="lg" color="gray.400">Level: {data.player.level}</Text>
                      <Tag.Root>
                        <Tag.Label>Rank: {data.player?.rank?.rank === "Invalid level" ? 'Unranked' : data.player?.rank?.rank}</Tag.Label>
                      </Tag.Root>
                  </VStack>
              </Card.Body>
            </Card.Root>

            {/* Overall Stats Section */}
            <VStack maxW="full" w="100%">
              {overallStats && 
              (
                <Card.Root w="full" borderWidth="1px" borderRadius="lg" p={6} rounded="3xl" h="100%">
                    <Text fontSize="md" mb={4} fontWeight="bold">Overall Stats</Text>
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
                </Card.Root>
              )}
              <Text fontSize="xs" color="gray.400"fontStyle="italic">Data Last Updated: {data?.updates?.last_update_request}</Text>
            </VStack>
          </HStack>

          <HStack maxW="full" w="100%" maxH="full" h="100%">
            {(heroWinRateData.length > 0 || heroMatchesData.length > 0) && (
              <Card.Root w="full" p={4} rounded="3xl" maxH="full" h="375px">
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="md" fontWeight="bold">
                    {chartMode === 'winRate' ? 'Top Heroes by Win Rate' : 'Most Played Heroes'}
                  </Text>
                  
                  <HStack 
                    spacing={1} 
                    bg="gray.900" 
                    rounded="full" 
                    p={1} 
                    borderWidth="1px" 
                    borderColor="gray.800"
                  >
                    <Box
                      px={3}
                      py={1}
                      cursor="pointer"
                      rounded="full"
                      fontSize="sm"
                      bg={chartMode === 'winRate' ? 'gray.700' : 'transparent'}
                      color={chartMode === 'winRate' ? 'white' : 'gray.400'}
                      onClick={() => setChartMode('winRate')}
                      transition="all 0.2s"
                    >
                      Win Rate
                    </Box>
                    <Box
                      px={3}
                      py={1}
                      cursor="pointer"
                      rounded="full"
                      fontSize="sm"
                      bg={chartMode === 'matches' ? 'gray.700' : 'transparent'}
                      color={chartMode === 'matches' ? 'white' : 'gray.400'}
                      onClick={() => setChartMode('matches')}
                      transition="all 0.2s"
                    >
                      Matches
                    </Box>
                  </HStack>
                </HStack>
                
                {chartMode === 'winRate' && heroWinRateData.length > 0 ? (
                  <Chart.Root h="300px" chart={heroWinRateChart}>
                    <RadarChart data={heroWinRateChart.data} outerRadius="70%">
                      <PolarGrid stroke={heroWinRateChart.color("gray.800")} />
                      <PolarAngleAxis 
                        dataKey={heroWinRateChart.key("name")} 
                        tick={{ fill: heroWinRateChart.color("gray.300") }}
                      />
                      <PolarRadiusAxis 
                        angle={0} 
                        domain={[0, 100]} 
                        tick={{ fill: heroWinRateChart.color("gray.300") }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Radar 
                        dataKey={heroWinRateChart.key("Win Rate")} 
                        stroke={heroWinRateChart.color("gray.300")} 
                        fill={heroWinRateChart.color("gray.300")} 
                        fillOpacity={0.3} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "black", borderColor: "bg.muted", color: "white" }}
                        formatter={(value) => [`${value.toFixed(2)}%`, "Win Rate"]}
                      />
                    </RadarChart>
                  </Chart.Root>
                ) : heroMatchesData.length > 0 ? (
                  <Chart.Root h="300px" chart={heroMatchesChart}>
                    <RadarChart data={heroMatchesChart.data} outerRadius="70%">
                      <PolarGrid stroke={heroMatchesChart.color("gray.800")} />
                      <PolarAngleAxis 
                        dataKey={heroMatchesChart.key("name")} 
                        tick={{ fill: heroMatchesChart.color("gray.300") }}
                      />
                      <PolarRadiusAxis 
                        angle={0} 
                        domain={[0, Math.max(...heroMatchesData.map(d => d.Matches)) + 5]} 
                        tick={{ fill: heroMatchesChart.color("gray.300") }}
                      />
                      <Radar 
                        dataKey={heroMatchesChart.key("Matches")} 
                        stroke={heroMatchesChart.color("gray.300")} 
                        fill={heroMatchesChart.color("gray.300")} 
                        fillOpacity={0.3} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "black", borderColor: "bg.muted", color: "white" }}
                        formatter={(value) => [value, "Matches"]}
                      />
                    </RadarChart>
                  </Chart.Root>
                ) : (
                  <Text color="gray.500" textAlign="center" mt={8}>No hero data available</Text>
                )}
              </Card.Root>
            )}
            
            {kdaAreaData.length > 0 && (
              <Card.Root w="full" p={4} rounded="3xl" maxH="full" h="375px">
                <Text fontSize="md" fontWeight="bold" mb={4}>Recent Performance Trend</Text>
                <Chart.Root h="300px" chart={kdaAreaChart}>
                  <AreaChart data={kdaAreaChart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={kdaAreaChart.color("gray.800")} />
                    <XAxis 
                      dataKey={kdaAreaChart.key("match")} 
                      axisLine={{ stroke: kdaAreaChart.color("gray.800") }}
                      tick={{ fill: kdaAreaChart.color("gray.800") }}
                    />
                    <YAxis 
                      axisLine={{ stroke: kdaAreaChart.color("gray.800") }}
                      tick={{ fill: kdaAreaChart.color("gray.800") }}
                    />
                    <Tooltip 
                      cursor={{ fill: kdaAreaChart.color("gray.900") }}
                      contentStyle={{ backgroundColor: "black", borderColor: "bg.muted", color: "white" }}
                      labelStyle={{ fontWeight: "bold" }}
                      formatter={(value, name, props) => [`${value}`, `${name} (${props.payload.hero})`]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey={kdaAreaChart.key("KDA")} 
                      stroke={kdaAreaChart.color("gray.300")} 
                      fill={kdaAreaChart.color("gray.300")} 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </Chart.Root>
              </Card.Root>
            )}
          </HStack>

          {mapsChartData.length > 0 && (
            <Card.Root w="full" p={4} rounded="3xl">
              <Text fontSize="md" fontWeight="bold" mb={4}>Most Played Maps</Text>
              <Box w="full">
                <BarSegment.Root chart={mapsChart} height="100%">
                  <BarSegment.Content>
                    <BarSegment.Bar tooltip />
                    <BarSegment.Value />
                  </BarSegment.Content>
                  <BarSegment.Legend showValue />
                </BarSegment.Root>
              </Box>
            </Card.Root>
          )}

          {/* Hero Matchups Section */}
          {heroMatchups && heroMatchups.length > 0 && (
            <Card.Root w="full" borderWidth="1px" borderRadius="lg" p={6} rounded="3xl">
              <Text fontSize="md" mb={4} fontWeight="bold">Hero Matchups</Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="2">
                {heroMatchups
                  .filter(hero => hero.hero_id && hero.hero_name !== "Unknown")
                  .map((hero, index) => (
                    <Card.Root key={hero.hero_id || index} p={3} rounded="3xl" bg="black">
                      <HStack spacing={3} alignItems="center">
                        {hero.hero_thumbnail && (
                          <Image
                            src={`http://marvelrivalsapi.com/rivals${hero.hero_thumbnail}`}
                            alt={hero.hero_name || 'Hero Icon'}
                            boxSize="40px"
                            borderRadius="full"
                          />
                        )}
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="sm">{formatHeroName(hero.hero_name) || 'Unknown Hero'}</Text>
                          <Text fontSize="xs" color="gray.400">Matches: {hero.matches ?? 0}</Text>
                          <Text fontSize="xs" color="gray.400">
                            Win Rate: {hero.win_rate !== undefined ? parseFloat(hero.win_rate).toFixed(2) : 'N/A'}%
                          </Text>
                        </VStack>
                      </HStack>
                    </Card.Root>
                ))}
              </SimpleGrid>
            </Card.Root>
          )}

          {/* Teammates Section */}
          {teammates && teammates.length > 0 && 
          (
              <Card.Root w="full" borderWidth="1px" borderRadius="lg" p={6} rounded="3xl">
                  <Text fontSize="md" mb={4} fontWeight="bold">Recent Teammates</Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="2">
                      {teammates.map((teammate, index) => 
                      (
                        <Card.Root key={teammate?.player_info?.player_uid || index} p={3} rounded="3xl" bg="black">
                              <HStack spacing={3} alignItems="center">
                                  
                                  {teammate?.player_info?.player_icon && 
                                  (
                                      <Image src={`https://marvelrivalsapi.com${teammate.player_info.player_icon}`} alt={teammate?.player_info?.nick_name || 'Teammate Icon'} boxSize="40px" borderRadius="full" />
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
                        </Card.Root>
                      ))}
                  </SimpleGrid>
              </Card.Root>
          )}

        </VStack>
    </Box>
  );
}

export default Player;