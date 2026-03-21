import { Container, Heading, VStack, Icon, Input, Button, Text, useDisclosure, Modal, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalHeader, IconButton, ModalCloseButton } from '@chakra-ui/react'
import { useState } from 'react'
import WeatherDataCardList from '../components/weatherDataCardList';
import weatherService from '../api/weatherApi';
import CountrySelect from '../components/selects/countrySelect';
import MessageModal from '../components/modals/messageModal';
import { MoonIcon, SpinnerIcon, SunIcon } from '@chakra-ui/icons';
import CreateModal from '../components/modals/createModal';
import DataModal from '../components/modals/dataModal';


function App() {
  const [weatherData, setWeatherData] = useState([]);
  const {isOpen: isOpenEmpty, onOpen: onOpenEmpty, onClose: onCloseEmpty} = useDisclosure();
  const {isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError} = useDisclosure();
  const {isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate} = useDisclosure();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");

      const data = await weatherService.get_weather_request_by_city(city, country);
      console.log(data)
      setWeatherData(data);

      if (data.length === 0) {
        onOpenEmpty();
      }

    } catch (err) {
      setError(err.message);
      setWeatherData([]);
      onOpenError();
    };
  }

  const handleCreateDateRange = async (city, country, start_date, end_date) => {
      try {
        setError("");
        
        const data = await weatherService.get_city_weather_by_date_range(city, country, start_date, end_date);
        
        onCloseCreate();

        setWeatherData([data]);
            
      }catch (err) {
        setError(err.message);
        onOpenError();
      }
  }

  const handleCreateForecast = async (city, country) => {
      try {
        setError("");
        
        const data = await weatherService.get_city_weather_forecast(city, country);
        
        onCloseCreate();

        setWeatherData([data]);

      }catch (err) {
        setError(err.message);
        onOpenError();
      }
  }

  return (
    <Container display={"flex"}>
      <VStack width={'100vw'} height={"100vh"}>

        <Heading display={"flex"} alignItems={"center"} gap={"1rem"} marginBottom={"5rem"} marginTop={"2rem"}>
          <MoonIcon color={"blue.600"}/> Weather App <SunIcon color={"goldenrod"}/>
        </Heading>
        <Text fontSize={"lg"}>Search for weather data by city and country</Text>

        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <CountrySelect value={country} setValue={setCountry}></CountrySelect>

        <Button onClick={handleSearch}>
          Search
        </Button>

        <Button colorScheme="green" onClick={onOpenCreate}>
          Create
        </Button>

        <WeatherDataCardList weathers={weatherData} />

      </VStack>

      <MessageModal 
      isOpen={isOpenEmpty} 
      onClose={onCloseEmpty} 
      title="Data Not Found" 
      content="No weather data found for the specified city and country. Please try a different search." />

      <CreateModal
      isOpen={isOpenCreate} 
      onClose={onCloseCreate}
      createFunctionRanged={handleCreateDateRange}
      createFunctionForecast={handleCreateForecast} 
      />

      <MessageModal 
      isOpen={isOpenError} 
      onClose={onCloseError} 
      title="ERROR" 
      content={error} 
      type="error"
      />

    </Container>
  );

}

export default App
