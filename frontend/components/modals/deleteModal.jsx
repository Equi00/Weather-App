import { WarningIcon } from "@chakra-ui/icons";
import { Button, Icon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

export default function DeleteModal({ isOpen, onClose, deleteFunction, weatherId }) {
  
    const handleDelete = async () => {
        await deleteFunction(weatherId)
        onClose()
    }
  
    return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
              
        <ModalHeader>Are you sure you want to delete the selected request?</ModalHeader>
    
        <ModalFooter justifyContent="center">
            <Button colorScheme="green" mr={3} onClick={() => handleDelete()}>
                Yes
            </Button>
            <Button colorScheme='gray' mr={3} onClick={onClose}>
                No
            </Button>
        </ModalFooter>
    
        </ModalContent>
    </Modal>
  );
}