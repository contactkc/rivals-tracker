import { Box, VStack, Center, Text, AbsoluteCenter, Spinner, Timeline } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import PatchConnect from '@/components/PatchConnect';
import usePatches from '@/hooks/usePatches';

function Patches() {
  const { patches, loading, error } = usePatches();

  return (
    <Box color="white">
      <Navbar />
      <Text fontSize="2rem" fontWeight="800" textAlign="center">Patch Notes</Text>
      <Center>
        <VStack spacing={8} mx="auto" mt="8" w="full" maxW="5xl">
          {loading && (
            <AbsoluteCenter>
              <VStack>
                <Spinner size="md" />
                <Text color="white">Loading patch notes...</Text>
              </VStack>
            </AbsoluteCenter>
          )}
          {error && <Text color="red.400">Error: {error}</Text>}
          {!loading && !error && patches.length === 0 && (
            <Text color="gray.400">No patch notes found.</Text>
          )}
          {!loading && !error && (
            <Timeline.Root maxW="4xl">
              {patches.map(patch => (
                <PatchConnect key={patch.id} patch={patch} />
              ))}
            </Timeline.Root>
          )}
        </VStack>
      </Center>
    </Box>
  );
}

export default Patches;