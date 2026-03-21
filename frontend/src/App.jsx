import { Container, Heading, VStack, Icon, Input, Button, Text, useDisclosure, Modal, ModalBody, ModalOverlay, ModalContent, ModalFooter, ModalHeader, IconButton, ModalCloseButton, Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import WeatherDataCardList from '../components/weatherDataCardList';
import weatherService from '../api/weatherApi';
import CountrySelect from '../components/selects/countrySelect';
import MessageModal from '../components/modals/messageModal';
import { MoonIcon, SpinnerIcon, SunIcon } from '@chakra-ui/icons';
import CreateModal from '../components/modals/createModal';


function App() {
  const [weatherData, setWeatherData] = useState([]);
  const {isOpen: isOpenEmpty, onOpen: onOpenEmpty, onClose: onCloseEmpty} = useDisclosure();
  const {isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError} = useDisclosure();
  const {isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate} = useDisclosure();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    try {
      setError("");

      setLoading(true)
      const data = await weatherService.get_weather_request_by_city(city, country);
      setLoading(false)
      setWeatherData(data);

      if (data.length === 0) {
        onOpenEmpty();
      }

    } catch (err) {
      setError(err.message);
      setLoading(false)
      setWeatherData([]);
      onOpenError();
    };
  }

  const handleCreateDateRange = async (city, country, start_date, end_date) => {
      try {
        setError("");
        setLoading(true)
        const data = await weatherService.get_city_weather_by_date_range(city, country, start_date, end_date);
        setLoading(false)
        onCloseCreate();

        setWeatherData([data]);
            
      }catch (err) {
        setError(err.message);
        setLoading(false)
        onOpenError();
      }
  }

  const handleCreateForecast = async (city, country) => {
      try {
        setError("");
        setLoading(true)
        const data = await weatherService.get_city_weather_forecast(city, country);
        setLoading(false)
        onCloseCreate();

        setWeatherData([data]);

      }catch (err) {
        setError(err.message);
        setLoading(false)
        onOpenError();
      }
  }

  const handleUpdateRequest = async (id, city, country, start_date, end_date) => {
    try{
      setError("")
      setLoading(true)
      const data = await weatherService.update_weather_request_by_id(id, city, country, start_date, end_date)
      setLoading(false)

      setWeatherData([data])

    }catch (err) {
      setError(err.message);
      setLoading(false)
      onOpenError();
    }
  }

  const handleExportCSV = async (id) => {
    try{
      setError("")

      await weatherService.exportCSV(id)

    }catch (err) {
      setError(err.message);
      onOpenError();
    }
  }

  const handleDeleteRequest = async (id) => {
    try{
      setError("")
      setLoading(true)
      await weatherService.delete_weather_request_by_id(id)
      setLoading(false)

      if (weatherData.length === 1) {
        setWeatherData([])
      }else{
        handleSearch()
      }

    }catch (err) {
      setError(err.message);
      setLoading(false)
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

        <WeatherDataCardList weathers={weatherData} deleteFunction={handleDeleteRequest} updateFunction={handleUpdateRequest} exportFunction={handleExportCSV}/>

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

      <Modal isOpen={loading} onClose={() => {}} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <VStack colorPalette="teal">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
    </Container>
  );

}

export default App
