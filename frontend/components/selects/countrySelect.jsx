import { Select } from "@chakra-ui/react";
import country_code from "../../external_data/country_code.json";


export default function CountrySelect({ value, setValue }) {
  return (
    <Select
      placeholder="Select Country"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      width="100%"
    >
      {country_code.map((country) => (
        <option key={country["alpha-2"]} value={country["alpha-2"]}>
          {country["name"]}
        </option>
      ))}
    </Select>
  );
}