import { useState, useEffect } from 'react';
import { Box, Flex, VStack, AbsoluteCenter, Input, Button, Text, Alert } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import useApi from './hooks/useApi';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { LuSearch } from "react-icons/lu";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiQuery, setApiQuery] = useState(''); // new state for triggering API call
  const { data: searchResult, loading, error } = useApi(
    apiQuery ? `player/${apiQuery}` : null // use apiQuery for API call
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResult && !loading && !error) {
      navigate(`/player/${searchResult.name || searchResult.player?.name}`);
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
              <h1 className="login__title animate-fade-down">Marvel Rivals Tracker</h1>
              <form onSubmit={handleSearch}>
                <Flex maxW="md" w="full" className="animate-fade-down">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search player or UID here"
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
                    <LuSearch />
                  </Button>
                </Flex>
              </form>
              {loading && (
                <Text mt={4} color="white">
                  Searching for player...
                </Text>
              )}
              {error && (
                <Alert.Root status="error" mt="4" rounded="2xl">
                  <Alert.Indicator />
                  <Alert.Title>Error! {error}</Alert.Title>
                </Alert.Root>
              )}
            </Box>
          </Box>
        </VStack>
      </AbsoluteCenter>
    </Box>
  );
}

export default App;