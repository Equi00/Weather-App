import { Container, Heading, VStack, Icon, Input, Button, Text, useDisclosure, Modal, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalHeader, IconButton, ModalCloseButton } from '@chakra-ui/react'
import { useState } from 'react'
import WeatherDataCardList from '../components/weatherDataCardList';
import weatherService from '../api/weatherApi';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';


function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      setHasSearched(true);
      
      const data = await weatherService.get_weather_request_by_city(city, country);
      
      setWeatherData(data);

      if (data.length === 0) {
        onOpen();
      }

    } catch (err) {
      setError(err.message);
      setWeatherData([]);
    }
  };

  return (
    <Container display={"flex"}>
      <VStack width={'100vw'} height={"100vh"}>

        <Heading>Weather App</Heading>

        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

        <Button onClick={handleSearch}>Search</Button>

        {error && <Text color="red.500">{error}</Text>}

        <WeatherDataCardList weathers={weatherData} />

      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent bg="white" borderRadius={10} p={4}>
          
          <ModalHeader>Data Not Found</ModalHeader>
          
          <ModalBody>
            No weather data found for the specified city and country. Please try a different search.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </Container>
  );

}

export default App
