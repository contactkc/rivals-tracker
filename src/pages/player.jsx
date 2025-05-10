import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Box, Text, Spinner, Alert } from '@chakra-ui/react';

function Player() {
  const { username } = useParams();
  const { data, loading, error } = useApi(`player/${username}`);

  if (loading) return <Spinner color="blue.400" />;
  if (error) return <Alert status="error">{error}</Alert>;
  if (!data) return null;

  return (
    <Box color="white" p={8}>
      <Text fontSize="2xl" fontWeight="bold">{data.username}</Text>
      <Text>Rank: {data.rank || 'N/A'}</Text>
    </Box>
  );
}

export default Player;