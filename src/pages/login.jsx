import { useState } from 'react';
import { Box, Link, Heading, Input, Button, Text, VStack, AbsoluteCenter } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
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
                    boxShadow="0 0 12px rgba(226, 205, 205, 0.8)"
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