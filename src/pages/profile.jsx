import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '@/components/Navbar';
import { Center, Box, Text, VStack, Card, HStack, Button, Flex, Spacer } from '@chakra-ui/react';
import { FaRegEdit } from "react-icons/fa";


function Profile() {
  const { userId } = useParams();
  const { user, login } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [marvelUsername, setMarvelUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // redirect if not the current user
  if (user && userId !== user.id) {
    return <Navigate to={`/profile/${user.id}`} replace />;
  }
  
  useEffect(() => {
    // fetch profile data
    const fetchProfileData = async () => {
      try {
        // grab token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setProfileData(data);
        setMarvelUsername(data.marvelRivalsUsername || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  return (
    <Box color="white">
      <Navbar />
      <Text fontSize="2rem" fontWeight="800">Profile Settings</Text>
      <Center>
        <Card.Root variant="outline" key="profileCard" flexDirection="row" overflow="hidden" width="2xl" className="space-between" padding={4} mt={4}>
          <VStack spacing={4} className="space-y-4">
            <Flex width="100%">
              <Text fontSize="md" fontWeight="600">Username: {user.username}</Text>
              <Spacer />
              <Button variant="outline">Edit <FaRegEdit /></Button>
            </Flex>
            <Flex width="100%">
              <Text fontSize="md" fontWeight="600">Password: ●●●●●●●●●</Text>
              <Spacer />
              <Button variant="outline">Edit <FaRegEdit /></Button>
            </Flex>
            <Flex width="100%">
              <Text fontSize="md" fontWeight="600">Marvel Rivals User: placeholder</Text>
              <Spacer />
              <Button variant="outline">Edit <FaRegEdit /></Button>
            </Flex>
          </VStack>
        </Card.Root>  
      </Center>
    </Box>
  );
}

export default Profile;