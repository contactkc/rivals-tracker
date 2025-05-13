import { useUser } from '../context/UserContext';
import useApi from '../hooks/useApi';

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

    console.log('Match history data:', matchHistoryData);
    
    const matchHistory = matchHistoryData?.match_history;
    console.log('Match history array:', matchHistory);

    if (!loading && !error && (!user || !marvelUsername)) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <Navbar />
                <Text fontSize="xl" fontWeight="600">Marvel Rivals Username Required</Text>
                <Text color="gray.500">
                    Please save your Marvel Rivals username on your profile page to view match history.
                </Text>
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
            <Box textAlign="center" py={10} px={6}>
                <Navbar />
                <Alert status="error" variant="solid" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                    <Text fontSize="xl" fontWeight="600">Error Loding Match History</Text>
                    <Text>{error}</Text>
                </Alert>
            </Box>
        );
    }

    if (!loading && !error && (!matchHistoryData || !matchHistory || matchHistory.length === 0)) {
         return (
            <Box textAlign="center" py={10} px={6}>
                <Navbar />
                <Text fontSize="xl" fontWeight="600">No Match History Found</Text>
                <Text color="gray.500">No match history available for "{marvelUsername}".</Text>
            </Box>
        );
    }


    // --- Render the detailed match history list ---
    // This block runs if user is logged in, username saved, data fetched, and matchHistory is not empty

    return (
        <Box p={6}>
            <Navbar />

            <VStack spacing={8} mt={8} maxW="container.lg" mx="auto">

                <Text fontSize="xl" fontWeight="600">Match History for {marvelUsername}</Text>

                <Box w="full">

                    {matchHistory && matchHistory.length > 0 ? (

                        <VStack spacing={4} maxW="lg" mx="auto">
                            {matchHistory.map((match, index) => (
                                <Card key={match?.match_uid || match?.match_id || index} w="full">
                                    <CardBody>
                                        <VStack align="start" spacing={3}>

                                            <HStack spacing={4} justifyContent="space-between" w="full">
                                                <Text fontWeight="bold" color={match?.match_player?.is_win === true ? 'green.400' : 'red.400'}>
                                                    Result: {match?.match_player?.is_win === true ? 'Win' : 'Loss'}
                                                </Text>
                                                <Text fontSize="sm">Game Mode ID: {match?.game_mode_id || 'N/A'}</Text>
                                                <Text fontSize="sm">Map ID: {match?.match_map_id || 'N/A'}</Text>
                                            </HStack>

                                            <Box h="1px" bg="gray.700" w="full" my={2} />


                                            <HStack spacing={4} w="full" alignItems="center">
                                                {match?.match_player?.player_hero?.hero_thumbnail && (
                                                    <Image src={`https://marvelrivalsapi.com/rivals${match.match_player.player_hero.hero_thumbnail}`} alt={match.match_player.player_hero.hero_name || 'Hero Icon'} boxSize="40px" />
                                                )}
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="bold">{match?.match_player?.player_hero?.hero_name || 'Unknown Hero'}</Text>
                                                    <HStack spacing={2}>
                                                        <Text>K: {match?.match_player?.player_hero?.kills ?? match?.match_player?.kills ?? 0}</Text>
                                                        <Text>D: {match?.match_player?.player_hero?.deaths ?? match?.match_player?.deaths ?? 0}</Text>
                                                        <Text>A: {match?.match_player?.player_hero?.assists ?? match?.match_player?.assists ?? 0}</Text>
                                                    </HStack>
                                                </VStack>
                                            </HStack>

                                            {match?.match_play_duration && (
                                                <Text fontSize="sm" color="gray.500">Duration: {match.match_play_duration}</Text>
                                            )}
                                            {match?.match_time_stamp && (
                                                <Text fontSize="sm" color="gray.500">Date: {new Date(match.match_time_stamp * 1000).toLocaleString()}</Text>
                                            )}

                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
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