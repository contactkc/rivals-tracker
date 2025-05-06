import { Box, VStack, Center, Text, AbsoluteCenter, Spinner } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import HeroCard from '@/components/HeroCard';
import useHeroes from '@/hooks/useHeroes';

function Heroes() {
    const { heroes, loading, error } = useHeroes();

    return (
        <Box color="white" minH="100vh">
            <Navbar />
            <Text fontSize="4rem" fontWeight="800">Heroes</Text>
            <Center>
                <VStack spacing={8} mx="auto" mt="8" w="full" maxW="5xl">
                    <AbsoluteCenter>
                        <VStack>
                            <Spinner size="md" />
                            {loading && <Text color="white">Loading heroes...</Text>}
                        </VStack>
                    </AbsoluteCenter>
                    {error && <Text color="red.400">Error: {error}</Text>}
                    {!loading && !error && heroes.length === 0 && (
                        <Text color="gray.400">No heroes found.</Text>
                    )}
                    {!loading && !error && (
                            heroes.map(hero => <HeroCard key={hero.name} hero={hero} />)
                        )}
                </VStack>
            </Center>
        </Box>
    );
}

export default Heroes;