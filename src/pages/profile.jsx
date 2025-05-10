import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '@/components/Navbar';
import { Box, Text } from '@chakra-ui/react';

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
      <Text fontSize="2rem" fontWeight="800" textAlign="center">Profile Settings</Text>
    </Box>
  );
}

export default Profile;