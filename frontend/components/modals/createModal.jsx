import { Button, HStack, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import CountrySelect from "../selects/countrySelect";


export default function CreateModal({ isOpen, onClose, createFunctionRanged, createFunctionForecast }) {

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isForecast, setIsForecast] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent borderRadius="xl">
        <ModalHeader>Create Weather Request</ModalHeader>

        <ModalBody>
          <Input placeholder="City" onChange={(e) => setCity(e.target.value)} />
          <Spacer p={1}/>
          <CountrySelect value={country} setValue={setCountry}></CountrySelect>
          <HStack display={"flex"} justifyContent={"space-evenly"} p={"1rem"}>
            <Button colorScheme={isForecast ? "green" : undefined} onClick={() => setIsForecast(true)}>
                Forecast
            </Button>
            <Button colorScheme={!isForecast ? "green" : undefined} onClick={() => setIsForecast(false)}>
                Date Range
            </Button>
          </HStack>
          <Input disabled={isForecast} type="date" onChange={(e) => setStartDate(e.target.value)} />
          <Spacer p={1}/>
          <Input disabled={isForecast} type="date" onChange={(e) => setEndDate(e.target.value)} />
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={() => {isForecast ? createFunctionForecast(city, country) : createFunctionRanged(city, country, startDate, endDate)}}
          >
            Create
          </Button>

          <Button ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}