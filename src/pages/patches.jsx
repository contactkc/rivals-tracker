import { Box, VStack, Center, Text, AbsoluteCenter, Spinner } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';

function Patches() {
    return (
        <Box color="white" minH="100vh">
            <Navbar />
            <Text fontSize="4rem" fontWeight="800">Patch Notes</Text>
            <Center>
                <VStack spacing={8} mx="auto" mt="8" w="full" maxW="5xl">
                </VStack>
            </Center>
        </Box>
    );
}

export default Patches;