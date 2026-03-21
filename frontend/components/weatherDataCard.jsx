import {
  Box,
  Heading,
  Text,
  HStack,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import DataModal from "./modals/dataModal";

export default function WeatherDataCard({ weather }) {
  const {isOpen: isOpenData, onOpen: onOpenData, onClose: onCloseData} = useDisclosure();

  return (
    <Box
      p={"2ram"}
      border="2px solid"
      borderColor="black"
      borderRadius="md"
      bg="white"
      color="black"
      display={"grid"}
      padding={"1rem"}
    >
      <VStack m={1} width={"100%"} onClick={onOpenData}>
        <Heading size="sm">
          City: {weather.city}
        </Heading>
        <Heading size="sm">
          Country: {weather.country}
        </Heading>
        <Spacer />
        <Text width={"100%"}>Start Date: {weather.start_date}</Text>
        <Text width={"100%"}>End Date: {weather.end_date}</Text>
      </VStack>
      <HStack display={"flex"} width={"100%"} justifyContent={"space-around"}>
          <EditIcon color={"teal"} onClick={() => console.log("apretado")}></EditIcon>
          <DeleteIcon color={"red"} onClick={() => console.log("apretado")}></DeleteIcon>
      </HStack>

      <DataModal
            isOpen={isOpenData}
            onClose={onCloseData}
            data={weather}/>
    </Box>

    
  );
}