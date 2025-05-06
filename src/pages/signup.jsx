import { useState } from 'react';
import { Box, Link, Heading, Input, Button, Text, VStack, AbsoluteCenter } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
          credentials: 'include',
        });
        if (response.ok) {
          navigate('/login');
        } else {
          const errorText = await response.text();
          setError(errorText || 'Signup failed');
        }
      } catch (err) {
        setError('Signup failed: ' + err.message);
      }
    };

    return (
    <Box color="white">
        <Navbar />
        <AbsoluteCenter>
            <VStack spacing={8} maxW="400px" mx="auto">
            <h1 className="text-4xl font-bold">Create your account</h1>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="gray.800"
                    width="20rem"
                    border="none"
                    marginTop={2}
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
                    Create account
                </Button>
                </VStack>
            </form>
            <Link
                href="/login"
                color="gray.500"
                rounded="md"
                borderWidth="20rem"
                fontSize="sm"
                px={4}
                py={2}
                border="1px"
                _focus={{ outline: 'none', boxShadow: 'none' }}
            >
                Already have an account? Sign in
            </Link>
            {error && <Text color="red.400">{error}</Text>}
            </VStack>
        </AbsoluteCenter>
    </Box>
    );
}

export default Signup;