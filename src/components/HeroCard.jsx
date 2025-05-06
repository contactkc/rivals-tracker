import { Box, Card, Image, HStack, Badge, Text } from '@chakra-ui/react';

function HeroCard({ hero }) {
    return(
        <Card.Root flexDirection="row" variant="outline" key="outline" overflow="hidden" maxW="5xl">
                <Image
                    objectFit="cover"
                    maxW="200px"
                    src={hero.imageUrl}
                    alt={hero.alt}
                />
                <Box>
                    <Card.Body>
                        <Card.Title>{hero.name}</Card.Title>
                        <Text color="gray.300" textStyle="sm" mb="2" fontStyle="italic">
                            {hero.real_name}
                        </Text>
                        <Card.Description>
                            {hero.bio}
                        </Card.Description>
                        <HStack mt="2">
                            <Badge>Difficulty: {hero.difficulty}</Badge>
                            <Badge>Role: {hero.role}</Badge>
                        </HStack>
                    </Card.Body>
                </Box>
        </Card.Root>
    );
}

export default HeroCard;