import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Link,
  Image,
} from '@chakra-ui/react';
import { useUser } from '../context/UserContext';
import { FaCaretDown } from "react-icons/fa";
import { LuDoorOpen } from "react-icons/lu";

function Navbar() {
  const { user, logout } = useUser();

  return (
    <Box as="nav">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* title */}
          <Flex>
            <Link textStyle="lg" fontWeight="bold" href="/" _hover={{ textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}><Image src="/rivals-logo.svg" height="60px"/>Rivals Tracker</Link>
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
          {/* New: Match History Link (only show if logged in) */}
          {user && user.marvelRivalsUsername && (
               <Link href="/my-match-history" color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
                 Match History
               </Link>
           )}
          {user && user.marvelRivalsUsername && (
               <Link href={`/player/${user.marvelRivalsUsername}`} color="gray.400" fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
                 My Stats
               </Link>
           )}
        </Flex>

        {/* auth links */}
        <Flex align="center" gap={4}>
          {user ? (
            <>
              <Text fontSize="sm" color="white">
                Welcome, <Link href={`/profile/${user.id}`} _focus={{ outline: 'none', boxShadow: 'none' }}>{user.username} <FaCaretDown /></Link>
              </Text>
              <Button onClick={logout} size="sm" variant="outline" rounded="3xl" >
                <LuDoorOpen />
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;