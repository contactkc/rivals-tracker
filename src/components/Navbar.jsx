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
    <Box bg="whiteAlpha.50" color="white" p={4} as="nav" rounded="xl" borderColor="border.disabled">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* search bar */}
        <form onSubmit={handleSearch}>
          <Flex>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player..."
              bg="gray.800"
              border="none"
              rounded="md"
              _focus={{ boxShadow: 'none', bg: 'gray.800'}}
              w="200px"
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

        {/* nav links */}
        <Flex gap={6}>
          <Link href="/" color="white" fontSize="lg" _hover={{ color: 'blue.400' }}>
            Home
          </Link>
          <Link href="/heroes" color="white" fontSize="lg" _hover={{ color: 'blue.400' }}>
            Heroes
          </Link>
        </Flex>

        {/* auth links */}
        <Flex align="center" gap={4}>
          <Link href="../pages/login" color="white" fontSize="lg" _hover={{ color: 'blue.400' }}>
            Login
          </Link>
          <Link
            href="/signup"
            as={Button}
            bg="white.600"
            color="black"
            rounded="md"
            px={4}
            py={2}
            border="1px"
            borderColor="white.500"
            boxShadow="0 0 8px rgba(226, 205, 205, 0.6)"
            _hover={{ bg: 'white.700' }}
          >
            Signup
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