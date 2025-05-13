import { Box, Card, Image, HStack, Badge, Text } from '@chakra-ui/react';

function MapCard({ map }) {
    return(
        <Card.Root variant="outline" key={map.name} overflow="hidden" maxW="sm" rounded="3xl">
                <Image
                    objectFit="cover"
                    src={map.imageUrl}
                    alt={map.alt}
                />
                <Box>
                    <Card.Body>
                        <Card.Title>{map.name}</Card.Title>
                        <Text color="gray.300" textStyle="sm" mb="2" fontStyle="italic">
                            {map.location}
                        </Text>
                        <Card.Description>
                            {map.description}
                        </Card.Description>
                        <HStack mt="2">
                            <Badge>Game-Mode: {map.gameMode}</Badge>
                        </HStack>
                        <Text as="a" href={map.video} color="gray.300" fontStyle="italic" textStyle="xs" mt="4" target="_blank" rel="noopener noreferrer" textDecoration="underline">Map Preview</Text>
                    </Card.Body>
                </Box>
        </Card.Root>
    );
}

export default MapCard;