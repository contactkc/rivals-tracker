import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '@/components/Navbar';
import { Center, Box, Text, VStack, Card, Separator } from '@chakra-ui/react';
import { format } from 'date-fns';
import EditField from '@/components/EditField';
import { toaster } from "@/components/ui/toaster";

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

  const formatLastLogin = (lastLoginDate) => {
    if (!lastLoginDate) return 'Never';
    
    try {
      return format(new Date(lastLoginDate), 'PPpp');
    } catch (err) {
      return 'Invalid date';
    }
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

  // handler for updating username
  const handleUsernameUpdate = async (newUsername) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/users/${userId}/username`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: newUsername }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update username');
    }
    
    // update user in context/localStorage
    const updatedUser = { ...user, username: newUsername };
    login(updatedUser);
  };

  // handler for updating password
  const handlePasswordUpdate = async (newPassword) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password: newPassword }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update password');
    }
  };

  // handler for updating Marvel Rivals username
  const handleMarvelUsernameUpdate = async (newMarvelUsername) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/users/${userId}/marvel-username`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ marvelRivalsUsername: newMarvelUsername }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update Marvel Rivals username');
    }
    
    // update state
    setMarvelUsername(newMarvelUsername);
    
    // update user in context/localStorage
    const updatedUser = { ...user, marvelRivalsUsername: newMarvelUsername };
    login(updatedUser);
  };

  return (
    <Box color="white">
      <Navbar />
      <Text fontSize="2rem" fontWeight="800" ml={8} mt={4}>Profile Settings</Text>
      <Center mt={4}>
        <Card.Root variant="outline" key="profileCard" width="2xl" p={6}>
          <VStack spacing={6} align="stretch" width="100%">
            <EditField
              label="Username"
              value={user?.username}
              onSave={handleUsernameUpdate}
            />
            
            <EditField
              label="Password"
              fieldType="password"
              requireConfirmation
              onSave={handlePasswordUpdate}
            />
            
            <EditField
              label="Marvel Rivals Username"
              value={marvelUsername || 'Not set'}
              placeholderValue={marvelUsername || 'Not set'}
              onSave={handleMarvelUsernameUpdate}
            />
            
            <Separator my={2} borderColor="gray.600" />
            <Text fontSize="xs" color="gray.400" fontStyle="italic" textAlign="left">
              Last login: {formatLastLogin(user?.lastLogin)}
            </Text>
          </VStack>
        </Card.Root>
      </Center>
    </Box>
  );
}

export default Profile;