import {
  Box,
  Heading,
  Text,
  HStack,
  Spacer,
  VStack,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import DataModal from "./modals/dataModal";
import DeleteModal from "./modals/deleteModal";
import CreateModal from "./modals/createModal";

export default function WeatherDataCard({ weather, deleteFunction, updateFunction, exportFunction }) {
  const {isOpen: isOpenData, onOpen: onOpenData, onClose: onCloseData} = useDisclosure();
  const {isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete} = useDisclosure();
  const {isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate} = useDisclosure();

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
          <Button variant="outline">
            <EditIcon color={"teal"} onClick={() => onOpenUpdate()}></EditIcon>
          </Button>
          <Button variant="outline">
            <DeleteIcon color={"red"} onClick={() => onOpenDelete()}></DeleteIcon>
          </Button>
          <Button variant="outline">
              <DownloadIcon onClick={() => exportFunction(weather.id)}/> 
          </Button>
          
      </HStack>

      <DeleteModal
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            deleteFunction={deleteFunction}
            weatherId={weather.id}/>

      <CreateModal
            isOpen={isOpenUpdate}
            onClose={onCloseUpdate}
            updateFunction={updateFunction}
            weatherData={weather}
            />

      <DataModal
            isOpen={isOpenData}
            onClose={onCloseData}
            data={weather}/>
    </Box>

    
  );
}