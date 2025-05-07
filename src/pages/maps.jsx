import { Box, VStack, Center, Text, SimpleGrid, AbsoluteCenter, Spinner } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import MapCard from '@/components/MapCard';
import useMaps from '@/hooks/useMaps';

function Maps() {
  const { maps, loading, error } = useMaps();

  return (
    <Box color="white">
      <Navbar />
      <Text fontSize="4rem" fontWeight="800" textAlign="center">Maps</Text>
      <Center>
        <VStack spacing={8} mx="auto" mt="8" w="full" maxW="5xl">
          <AbsoluteCenter>
            <VStack>
              <Spinner size="md" />
              {loading && <Text color="white">Loading maps...</Text>}
            </VStack>
          </AbsoluteCenter>
          {error && <Text color="red.400">Error: {error}</Text>}
          {!loading && !error && maps.length === 0 && (
            <Text color="gray.400">No maps found.</Text>
          )}
          {!loading && !error && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} gap="4" w="full">
              {maps.map(map => <MapCard key={map.name} map={map} />)}
            </SimpleGrid>
          )}
        </VStack>
      </Center>
    </Box>
  );
}

export default Maps;