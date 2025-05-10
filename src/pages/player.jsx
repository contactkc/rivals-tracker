import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Box, Text, Spinner, Alert, AbsoluteCenter, VStack, Image, Card, HStack, Avatar } from '@chakra-ui/react';
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

  return (
    <Box color="white">
        <Navbar />
        <Card.Root>
            <Card.Body>
                <VStack mb="6" gap="3">
                    <Avatar.Root size="2xl">
                        <Avatar.Image src={`http://marvelrivalsapi.com/rivals${data.player.icon.player_icon}`} alt="Player Icon" />
                        <Avatar.Fallback name={data.player.name} />
                    </Avatar.Root>
                    <Text fontSize="2xl" fontWeight="bold">{data.player.name}</Text>
                    <Text fontSize="lg" color="gray.400">Level: {data.player.level}</Text>
                </VStack>
            </Card.Body>
        </Card.Root>
    </Box>
  );
}

export default Player;