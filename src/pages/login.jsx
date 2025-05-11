import { useState } from 'react';
import { Box, Link, Input, Button, Text, VStack, AbsoluteCenter } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: contextLogin } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        // store token instead of whole user object
        localStorage.setItem('token', userData.token);
        // store user data
        const userDataToStore = {
          id: userData.id,
          username: userData.username,
          marvelRivalsUsername: userData.marvelRivalsUsername
        };
        localStorage.setItem('user', JSON.stringify(userDataToStore));
        
        contextLogin(userDataToStore);
        toaster.create({
          title: 'Login successful',
          description: `Welcome back, ${userData.username}`,
          type: 'success',
        });
        navigate('/');
      } else {
        const errorText = await response.text();
        toaster.create({
          title: 'Login failed',
          description: errorText || 'Invalid username or password',
          type: 'error',
        });
      }
    } catch (err) {
      toaster.create({
          title: 'Login failed',
          description: errorText || 'Invalid username or password',
          type: 'error',
        });
    }
  };

  return (
    <Box color="white">
        <Navbar />
        <AbsoluteCenter>
            <VStack spacing={8} maxW="400px" mx="auto">
            <h1 className="text-4xl font-bold">Login in to Rivals Tracker</h1>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="gray.800"
                    width="20rem"
                    marginTop={2}
                    border="none"
                    rounded="2xl"
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.800"
                    width="20rem"
                    border="none"
                    rounded="2xl"
                />
                <Button
                    type="submit"
                    bg="white"
                    color="black"
                    marginTop={2}
                    rounded="2xl"
                    w="full"
                >
                    Sign in
                </Button>
                </VStack>
            </form>
            <Link
                  href="/signup"
                  color="gray.500"
                  rounded="md"
                  fontSize="sm"
                  borderWidth="20rem"
                  px={4}
                  py={2}
                  border="1px"
                  _focus={{ outline: 'none', boxShadow: 'none' }}
                >
                  Don't have an account? Sign up
                </Link>
            {error && <Text color="red.400">{error}</Text>}
            
            </VStack>
        </AbsoluteCenter>
    </Box>
  );
}

export default Login;