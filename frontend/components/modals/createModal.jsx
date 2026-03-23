import { Button, HStack, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CountrySelect from "../selects/countrySelect";


export default function CreateModal({ isOpen, onClose, createFunctionRanged, createFunctionForecast, updateFunction, weatherData }) {
  const isEdit = !!weatherData;
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isForecast, setIsForecast] = useState(true);

  const handleSubmit = async () => {
    if (isEdit) {
      await updateFunction(
        weatherData.id,
        city,
        country,
        isForecast ? "" : startDate,
        isForecast ? "" : endDate
      )
      onClose()
    }else{
      isForecast ? createFunctionForecast(city, country)
      : createFunctionRanged(city, country, startDate, endDate)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (weatherData) {
        setCity(weatherData.city)
        setCountry(weatherData.country)
        setStartDate(weatherData.start_date)
        setEndDate(weatherData.end_date)
        setIsForecast(true)
      } else {
        setCity("")
        setCountry("")
        setStartDate("")
        setEndDate("")
        setIsForecast(true)
      }
    }
  }, [isOpen, weatherData])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent borderRadius="xl">
        <ModalHeader>
          {isEdit ? "Update Weather Request" : "Create Weather Request"}
        </ModalHeader>

        <ModalBody>
          <Input value={city} placeholder="City" onChange={(e) => setCity(e.target.value)} />
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
          <Input value={startDate} disabled={isForecast} type="date" onChange={(e) => setStartDate(e.target.value)} />
          <Spacer p={1}/>
          <Input value={endDate} disabled={isForecast} type="date" onChange={(e) => setEndDate(e.target.value)} />
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
          >
            {isEdit ? "Update" : "Create"}
          </Button>

          <Button ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}