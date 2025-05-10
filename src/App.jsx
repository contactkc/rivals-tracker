import { useState, useEffect } from 'react';
import { Box, Flex, VStack, AbsoluteCenter, Input, Button, Text, Alert } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import useApi from './hooks/useApi';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiQuery, setApiQuery] = useState(''); // new state for triggering API call
  const { data: searchResult, loading, error } = useApi(
    apiQuery ? `player/${apiQuery}` : null // use apiQuery for API call
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResult && !loading && !error) {
      navigate(`/player/${searchResult.username}`);
    }
  }, [searchResult, loading, error, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setApiQuery(searchQuery); // trigger API call by setting apiQuery
  };

  return (
    <Box color="white" className="flex flex-col">
      <Navbar />
      <AbsoluteCenter>
        <VStack>
          {/* main section */}
          <Box className="flex flex-col md:flex-row p-8 max-w-7xl mx-auto">
            {/* title & search */}
            <Box className="md:w-1/2 flex flex-col items-center md:items-start">
              <h1 className="login__title">Marvel Rivals Tracker</h1>
              <form onSubmit={handleSearch}>
                <Flex maxW="md" w="full">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search player here"
                    bg="gray.800"
                    border="none"
                    rounded="2xl"
                    _focus={{ boxShadow: 'none', bg: 'gray.800' }}
                    w="20rem"
                  />
                  <Button
                    type="submit"
                    bg="white.600"
                    color="black"
                    rounded="2xl"
                    ml={2}
                    _hover={{ bg: 'white.700' }}
                  >
                    Search
                  </Button>
                </Flex>
              </form>
              {loading && (
                <Text mt={4} color="blue.400">
                  Loading...
                </Text>
              )}
              {error && (
                <Alert.Root status="error" mt="4" rounded="2xl">
                  <Alert.Indicator />
                  <Alert.Title>Error! {error}</Alert.Title>
                </Alert.Root>
              )}
              {searchResult && !loading && !error && (
                <Box mt={4} p={4} bg="gray.800" rounded="md">
                  <Text>
                    Found: {searchResult.username} (Rank: {searchResult.rank || 'N/A'})
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
}

export default App;