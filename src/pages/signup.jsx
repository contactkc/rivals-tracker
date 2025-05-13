import { useState } from 'react';
import { Box, Link, Input, Button, Text, VStack, AbsoluteCenter, Field } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster"
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
  
    const validateForm = () => {
        let isValid = true;
        const newErrors = { username: '', password: '' };
        
        //  alphanumeric, 4-16 characters username
        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            newErrors.username = 'Username must contain only letters and numbers';
            isValid = false;
        } else if (username.length < 4 || username.length > 16) {
            newErrors.username = 'Username must be between 4 and 16 characters';
            isValid = false;
        }
        
        // password validation 4-32 characters
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 4 || password.length > 32) {
            newErrors.password = 'Password must be between 4 and 32 characters';
            isValid = false;
        }
        
        setFormErrors(newErrors);
        return isValid;
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            return;
        }
      
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
            
            if (response.ok) {
                toaster.create({
                    title: 'Signup successful',
                    description: `Please sign in to continue`,
                });
                navigate('/login');
            } else {
                const errorText = await response.text();
                toaster.create({
                    title: 'Signup failed',
                    description: errorText || 'Failed to create account',
                });
            }
        } catch (err) {
            toaster.create({
                title: 'Signup failed',
                description: err.message,
            });
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
                            <Field.Root invalid={!!formErrors.username}>
                                <Input
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    bg="gray.800"
                                    width="20rem"
                                    border="none"
                                    rounded="2xl"
                                />
                                {formErrors.username = <Field.ErrorText>{formErrors.username}</Field.ErrorText> }
                            </Field.Root>
                            
                            <Field.Root invalid={!!formErrors.password}>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    bg="gray.800"
                                    width="20rem"
                                    border="none"
                                    rounded="2xl"
                                    css={{ "--focus-color:": "white" }}
                                />
                                {formErrors.password = <Field.ErrorText>{formErrors.password}</Field.ErrorText>}
                            </Field.Root>
                            
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