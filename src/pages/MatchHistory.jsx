import { useUser } from '../context/UserContext';
import useApi from '../hooks/useApi';
import useMaps from '../hooks/useMaps';
import {
    Box,
    Text,
    Spinner,
    Alert,
    AbsoluteCenter,
    VStack,
    Image,
    Card,
    HStack,
    Avatar,
    Heading,
    CardBody,
    SimpleGrid,
} from '@chakra-ui/react';
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

import Navbar from '../components/Navbar';

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

function MatchHistory() {
    const { user } = useUser();
    const marvelUsername = user?.marvelRivalsUsername;

    const { data: matchHistoryData, loading, error } = useApi(
        marvelUsername ? `player/${marvelUsername}/match-history` : null
    );
    const { maps: AllMaps } = useMaps();

    const matchHistory = matchHistoryData?.match_history;
    
    const recentMatches = matchHistory? [...matchHistory].reverse() : [];
    const kdaChartData = recentMatches.map((match, index) => {
        const perf = match.player_performance;
        return {
            match: `Match ${index + 1}`,
            Kills: perf?.kills || 0,
            Deaths: perf?.deaths || 0,
            Assists: perf?.assists || 0,
            hero: formatHeroName(perf?.hero_name || 'Unknown')
        };
    });
    
    const kdaChart = useChart({
        data: kdaChartData,
        colors: {
            "Kills": "white",
            "Deaths": "white", 
            "Assists": "white"
        }
    });

    const getMapImageUrl = (map_id) => {
        const found = AllMaps.find((m) => Number(m.map_id) === Number(map_id));
        if (found?.images && found.images[2]) {
            return `https://marvelrivalsapi.com${found.images[2]}`;
        }
        if (found?.imageUrl) {
            return found.imageUrl;
        }
        const match = matchHistory?.find(m => m.map_id === map_id);
        if (match?.map_thumbnail) {
            if (match.map_thumbnail.startsWith('/rivals/maps/map_')) {
                return `https://marvelrivalsapi.com${match.map_thumbnail.replace('/maps/map_', '/maps/large/map_')}`;
            }
            return `https://marvelrivalsapi.com${match.map_thumbnail}`;
        }
        return 'https://marvelrivalsapi.com/rivals/maps/large/map_1032.png';
    };

    if (!loading && !error && (!user || !marvelUsername)) {
        return (
            <Box textAlign="center">
                <Navbar />
                <AbsoluteCenter>
                <Text fontSize="xl" fontWeight="600">Marvel Rivals Username Required</Text>
                <Text color="gray.500">
                    Please save your Marvel Rivals username on your profile page to view match history.
                </Text>
                </AbsoluteCenter>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box position="relative" height="100vh" textAlign="center">
                <Navbar />
                <AbsoluteCenter>
                    <VStack spacing={4}>
                        <Spinner size="md" />
                        <Text color="white">Loading match history for {marvelUsername}...</Text>
                    </VStack>
                </AbsoluteCenter>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center">
                <Navbar />
                <AbsoluteCenter>
                    <Alert status="error" variant="solid" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                        <Text fontSize="xl" fontWeight="600">Error Loding Match History</Text>
                        <Text>{error}</Text>
                    </Alert>
                </AbsoluteCenter>
            </Box>
        );
    }

    if (!loading && !error && (!matchHistoryData || !matchHistory || matchHistory.length === 0)) {
         return (
            <Box textAlign="center">
                <Navbar />
                <AbsoluteCenter>
                    <VStack spacing={4}>
                        <Text fontSize="xl" fontWeight="600">No Match History Found</Text>
                        <Text color="gray.500">No match history available for "{marvelUsername}".</Text>
                    </VStack>
                </AbsoluteCenter>
            </Box>
        );
    }


    // --- Render the detailed match history list ---
    // This block runs if user is logged in, username saved, data fetched, and matchHistory is not empty

    return (
        <Box>
            <Navbar />

            <VStack spacing={8} mt={8} maxW="container.lg" mx="auto">

                <Text fontSize="xl" fontWeight="600">Match History for {marvelUsername}</Text>
                
                {kdaChartData.length > 0 && (
                    <Card.Root maxW="5xl" w="full" p={4} rounded="3xl">
                        <Text fontSize="md" fontWeight="bold" mb={4}>Recent Match Performance Trend</Text>
                        <Chart.Root h="300px" chart={kdaChart}>
                            <AreaChart data={kdaChart.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke={kdaChart.color("gray.800")} />
                                <XAxis 
                                    dataKey={kdaChart.key("match")} 
                                    axisLine={{ stroke: kdaChart.color("gray.800") }}
                                    tick={{ fill: kdaChart.color("gray.800") }}
                                />
                                <YAxis 
                                    axisLine={{ stroke: kdaChart.color("gray.800") }}
                                    tick={{ fill: kdaChart.color("gray.800") }}
                                />
                                <Tooltip 
                                    cursor={{ fill: kdaChart.color("gray.900") }}
                                    contentStyle={{ backgroundColor: "black", borderColor: "bg.muted", color: "white" }}
                                    labelStyle={{ fontWeight: "bold" }}
                                    formatter={(value, name, props) => [`${value}`, `${name} (${props.payload.hero})`]}
                                />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey={kdaChart.key("Kills")} 
                                    stroke={kdaChart.color("gray.300")} 
                                    fill={kdaChart.color("gray.300")} 
                                    fillOpacity={0.3}
                                    stackId="1"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey={kdaChart.key("Deaths")} 
                                    stroke={kdaChart.color("gray.400")} 
                                    fill={kdaChart.color("gray.400")} 
                                    fillOpacity={0.3}
                                    stackId="2"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey={kdaChart.key("Assists")} 
                                    stroke={kdaChart.color("gray.500")} 
                                    fill={kdaChart.color("gray.500")} 
                                    fillOpacity={0.3}
                                    stackId="3"
                                />
                            </AreaChart>
                        </Chart.Root>
                    </Card.Root>
                )}

                <Box w="full">

                    {matchHistory && matchHistory.length > 0 ? (

                        <VStack spacing={4} mx="auto">
                            {matchHistory.map((match, index) => {
                              const perf = match.player_performance;
                              return (
                                <Card.Root key={match.match_uid || index} w="full" flexDirection="row" variant="outline" overflow="hidden" maxW="5xl" rounded="3xl">
                                    <Image
                                        objectFit="cover"
                                        maxW="300px"
                                        src={getMapImageUrl(match.map_id)}
                                        alt="Map Thumbnail"
                                    />
                                  <CardBody>
                                    <VStack align="start" spacing={3}>
                                      <HStack spacing={4} justifyContent="space-between" w="full">
                                        <Text fontWeight="bold" color={perf?.is_win?.is_win ? 'green' : 'red'}>
                                          Result: {perf?.is_win?.is_win ? 'Win' : 'Loss'}
                                        </Text>
                                        <Text fontSize="sm">Map ID: {match.map_id ?? 'N/A'}</Text>
                                      </HStack>
                                      <Box h="1px" bg="gray.700" w="full" my={2} />
                                      <HStack spacing={4} w="full" alignItems="center">
                                        <VStack align="start" spacing={0}>
                                            <Avatar.Root size="2xl">
                                                <Avatar.Image src={`http://marvelrivalsapi.com/rivals${perf.hero_type}`} alt={`${perf?.hero_name}'s picture`} />
                                            </Avatar.Root>
                                          <Text fontWeight="bold">{formatHeroName(perf?.hero_name)}</Text>
                                          <HStack spacing={2}>
                                            <Text>K:{perf?.kills ?? 0}</Text>
                                            <Text>D:{perf?.deaths ?? 0}</Text>
                                            <Text>A:{perf?.assists ?? 0}</Text>
                                          </HStack>
                                        </VStack>
                                      </HStack>
                                      {match.duration && (
                                        <Text fontSize="sm" color="gray.500">
                                          Duration: {Math.floor(match.duration / 60)}m {Math.floor(match.duration % 60)}s
                                        </Text>
                                      )}
                                      {match.match_time_stamp && (
                                        <Text fontSize="sm" color="gray.500">
                                          Date: {new Date(match.match_time_stamp * 1000).toLocaleString()}
                                        </Text>
                                      )}
                                    </VStack>
                                  </CardBody>
                                </Card.Root>
                              );
                            })}
                        </VStack>

                    ) : (
                        // This block renders if matchHistory is null, undefined, or an empty array.
                        <Box mt={8} textAlign="center">
                            <Text color="gray.500">No match history available for "{marvelUsername}".</Text>
                        </Box>
                    )}

                </Box>

            </VStack>
        </Box>
    );
}

export default MatchHistory;