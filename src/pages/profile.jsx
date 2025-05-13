import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '@/components/Navbar';
import { Center, Box, Text, VStack, Card, Avatar, Spinner, Separator, Spacer, Flex, Button, Dialog, Portal } from '@chakra-ui/react';
import { format } from 'date-fns';
import EditField from '@/components/EditField';
import useApi from '../hooks/useApi';
import { LuCat } from "react-icons/lu";

function Profile() {
  const { userId } = useParams();
  const { user, login } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [marvelUsername, setMarvelUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state and refs for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = useRef();
  
  // create a state to track to fetch the player data
  const [shouldFetchPlayer, setShouldFetchPlayer] = useState(false);
  
  // useApi hook to fetch Marvel Rivals player data when marvelUsername is available
  const { 
    data: playerData, 
    loading: playerLoading,
    error: playerError 
  } = useApi(shouldFetchPlayer && marvelUsername ? `player/${marvelUsername}` : null);
  
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
        
        // set marvel username from fetched data
        const fetchedMarvelUsername = data.marvelRivalsUsername || '';
        setMarvelUsername(fetchedMarvelUsername);
        
        // if Marvel username exists, set flag to fetch player data
        if (fetchedMarvelUsername) {
          setShouldFetchPlayer(true);
        }
        
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
    
    try {
      // empty string = remove username
      if (newMarvelUsername === '') {
        newMarvelUsername = null; // set to null to remove it from database
      }
      
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
      setMarvelUsername(newMarvelUsername || '');
      
      // if username was removed, stop fetching player data
      if (!newMarvelUsername) {
        setShouldFetchPlayer(false);
      } else {
        // force a new fetch of player data immediately
        setShouldFetchPlayer(false); // reset first
        setTimeout(() => {
          setShouldFetchPlayer(true); // set to true on next tick
        }, 0);
      }
      
      // update user in context/localStorage
      const updatedUser = { ...user, marvelRivalsUsername: newMarvelUsername || '' };
      login(updatedUser);
      
    } catch (error) {
      throw error;
    }
  };

  // get avatar URL from player data when available
  const getAvatarUrl = () => {
    if (playerData && playerData.player && playerData.player.icon && playerData.player.icon.player_icon) {
      return `http://marvelrivalsapi.com/rivals${playerData.player.icon.player_icon}`;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  // handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      // log the user out and redirect to home/login after
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Box color="white">
      <Navbar />
      <Text fontSize="2rem" fontWeight="800" ml={8} mt={4}>Profile Settings</Text>
      <Center mt={4}>
        <Card.Root variant="outline" key="profileCard" width="2xl" p={6} rounded="3xl">
          <Center mb={6}>
            <Avatar.Root size="2xl">
              {playerLoading ? (
                <Spinner size="xl" />
              ) : avatarUrl ? (
                <Avatar.Image src={avatarUrl} alt={`${marvelUsername}'s profile`} />
              ) : (
                <Avatar.Fallback>
                  <LuCat size={36} />
                </Avatar.Fallback>
              )}
            </Avatar.Root>
          </Center>
          
          {playerData && playerData.player && (
            <VStack mb={2} spacing={1}>
              <Text fontSize="md" fontWeight="bold">{playerData.player.name}</Text>
              {playerData.player.level && (
                <Text fontSize="sm" color="gray.400">Level {playerData.player.level}</Text>
              )}
            </VStack>
          )}
          
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
              value={marvelUsername || ''}
              placeholderValue={marvelUsername || ''}
              onSave={handleMarvelUsernameUpdate}
              allowEmpty={true}
            />
            
            <Separator my={2} borderColor="gray.600" />
            <Flex alignItems="center">
              <Text fontSize="xs" color="gray.400" fontStyle="italic" textAlign="left">
                Last login: {formatLastLogin(user?.lastLogin)}
              </Text>
              <Spacer />
              <Button 
                variant="outline" 
                size="sm"
                rounded="3xl"
                _hover={{ 
                  bg: "red.900", 
                  borderColor: "red.700",
                  color: "white"
                }}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </Flex>
          </VStack>
        </Card.Root>
      </Center>
      
      <Portal>
          <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content color="white">
                <Dialog.Header>
                  <Dialog.Title fontSize="lg" fontWeight="bold">Delete Account</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Dialog.Body>
                <Dialog.Footer>
                  <Button 
                    ref={cancelRef} 
                    onClick={() => setIsDeleteDialogOpen(false)}
                    variant="outline"
                    rounded="3xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    colorScheme="red" 
                    onClick={handleDeleteAccount} 
                    ml={3}
                    variant="outline"
                    rounded="3xl"
                    _hover={{ 
                      bg: "red.900", 
                      borderColor: "red.700",
                      color: "white"
                    }}
                  >
                    Delete
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
      </Portal>
      
    </Box>
  );
}

export default Profile;