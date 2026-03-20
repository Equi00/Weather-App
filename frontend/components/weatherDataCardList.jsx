import { SimpleGrid, Text } from "@chakra-ui/react";
import WeatherDataCard from "./weatherDataCard";

export default function WeatherDataCardList({ weathers }) {
  if (weathers.length === 0) {
    return <Text>Weather data list empty.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
      {weathers.map((weather) => (
        <WeatherDataCard
          key={weather.id}
          weather={weather}
        />
      ))}
    </SimpleGrid>
  );
}