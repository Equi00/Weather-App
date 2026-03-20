import {
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export default function WeatherDataCard({ weather }) {

  return (
    <Box
      p={4}
      border="2px solid"
      borderColor="black"
      borderRadius="md"
      bg="white"
      color="black"
      minH="100%"
      display="flex"
      flexDirection="column"
    >
      <HStack mb={2}>
        <Heading size="sm">
          City: {weather.city} - Country: {weather.country}
        </Heading>
        <Spacer />
        <Text>Start Date: {weather.start_date} - End Date: {weather.end_date}</Text>
      </HStack>

        
    </Box>
  );
}