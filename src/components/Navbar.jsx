import { useState } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Link,
} from '@chakra-ui/react';
import useApi from '../hooks/useApi';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResult, loading, error } = useApi(
    searchQuery ? `player/${searchQuery}` : null
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <Box as="nav">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* title */}
          <Flex>
            <Link textStyle="lg" fontWeight="bold" href="/" _hover={{ textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>Rivals Tracker</Link>
          </Flex>

        {/* nav links */}
        <Flex gap={12}>
          <Link href="/" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
            Home
          </Link>
          <Link href="/heroes" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
            Heroes
          </Link>
          <Link href="/maps" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
            Maps
          </Link>
          <Link href="/patches" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
            Patch Notes
          </Link>
        </Flex>

        {/* auth links */}
        <Flex align="center" gap={4}>
          <Link href="/login" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
            Login
          </Link>
          <Link
            href="/signup"
            bg="white"
            color="black"
            rounded="3xl"
            px={4}
            py={2}
            border="1px"
            fontSize="sm"
            borderColor="gray.500"
            boxShadow="0 0 16px rgba(226, 205, 205, 0.8)"
            _focus={{ outline: 'none', boxShadow: 'none' }}
          >
            Sign up
          </Link>
        </Flex>
      </Flex>

      {/* search result */}
      {loading && (
        <Box position="absolute" top={16} left={4} color="blue.400">
          Loading...
        </Box>
      )}
      {error && (
        <Box
          position="absolute"
          top={16}
          left={4}
          bg="gray.800"
          p={4}
          rounded="md"
          color="red.400"
        >
          Error: {error}
        </Box>
      )}
      {searchResult && !loading && !error && (
        <Box
          position="absolute"
          top={16}
          left={4}
          bg="gray.800"
          p={4}
          rounded="md"
        >
          <Text>
            Found: {searchResult.username} (Rank: {searchResult.rank || 'N/A'})
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default Navbar;