import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Icon, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function DataModal({isOpen, onClose, data}){

    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                      
            <ModalHeader>
                City: {data.city}
                <Spacer/>
                Country: {data.country}
                <Spacer/>
                Date Range: {data.start_date} / {data.end_date}
                <Spacer/>
                <Link href={data.map_url} color={"teal"} display={"flex"} alignItems={"center"} isExternal>
                    Map <ExternalLinkIcon/>
                </Link>
                <Link href={data.youtube_url} color={"teal"} display={"flex"} alignItems={"center"} isExternal>
                    Youtube <ExternalLinkIcon/>
                </Link>
            </ModalHeader>
             
            <ModalBody>
                <Table size="sm">
                    <Thead>
                        <Tr>
                        <Th>Date</Th>
                        <Th>Temp. Max</Th>
                        <Th>Temp. Min</Th>
                        <Th isNumeric>Precipitations</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {(data.weather_data || []).map((item) => (
                        <Tr key={item.date}>
                            <Td width={"100%"}>{item.date}</Td>
                            <Td>{item.temperature_max}°C</Td>
                            <Td>{item.temperature_min}°C</Td>
                            <Td display="grid" isNumeric>
                                {item.precipitation_sum === 0
                                    ? "0 mm ☀️"
                                    : item.precipitation_sum < 5
                                    ? `${item.precipitation_sum} mm 🌤️`
                                    : `${item.precipitation_sum} mm 🌧️`}
                            </Td>                        
                        </Tr>
                        ))}
                    </Tbody>
                    </Table>
            </ModalBody>
            
            <ModalFooter justifyContent="center">
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
            
            </ModalContent>
        </Modal>
    )
}