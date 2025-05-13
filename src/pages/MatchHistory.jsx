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

import Navbar from '../components/Navbar';

function MatchHistory() {
    const { user } = useUser();
    const marvelUsername = user?.marvelRivalsUsername;

    const { data: matchHistoryData, loading, error } = useApi(
        marvelUsername ? `player/${marvelUsername}/match-history` : null
    );
    const { maps: AllMaps } = useMaps();

    const matchHistory = matchHistoryData?.match_history;

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
                                          <Text fontWeight="bold">{perf?.hero_name || 'Unknown Hero'}</Text>
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