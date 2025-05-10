import { useState } from 'react';
import { useUser } from '../context/UserContext';
import Navbar from '@/components/Navbar';
import { Box, VStack, Center, Text, AbsoluteCenter, Spinner, Timeline } from '@chakra-ui/react';

function Profile() {
  const { user, login } = useUser();
  const [marvelUsername, setMarvelUsername] = useState(user?.marvelRivalsUsername || '');
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/marvel-username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marvelRivalsUsername: marvelUsername }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        login(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };
    return (
        <Box color="white">
          <Navbar />
          <Text fontSize="2rem" fontWeight="800" textAlign="center">Profile Settings</Text>
          <Center>
            <VStack spacing={8} mx="auto" mt="8" w="full" maxW="5xl">
              
            </VStack>
          </Center>
        </Box>
    );
}

export default Profile;