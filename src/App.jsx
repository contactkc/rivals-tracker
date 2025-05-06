import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Input, Button, Text } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import useApi from './hooks/useApi';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResult, loading, error } = useApi(
    searchQuery ? `player/${searchQuery}` : null
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Box color="white" className="flex flex-col">
      <Navbar />

      {/* main section */}
      <Box className="flex flex-col md:flex-row p-8 max-w-7xl mx-auto">
        {/* title & search */}
        <Box className="md:w-1/2 flex flex-col items-center md:items-start">
          <Heading as="h1" size="6xl" mb={4} padding={5}>
            Marvel Rivals Tracker
          </Heading>
          <form onSubmit={handleSearch}>
            <Flex maxW="md" w="full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player..."
                bg="gray.800"
                border="none"
                rounded="md"
                _focus={{ boxShadow: 'none', bg: 'gray.800' }}
                w="full"
              />
              <Button
                type="submit"
                bg="white.600"
                color="black"
                rounded="md"
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
            <Box mt={4} p={4} bg="gray.800" rounded="md" color="red.400">
              Error: {error}
            </Box>
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
    </Box>
  );
}

export default App;