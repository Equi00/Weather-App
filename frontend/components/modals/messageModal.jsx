import { WarningIcon } from "@chakra-ui/icons";
import { Button, Icon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

export default function MessageModal({ isOpen, onClose, title, content, type }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent border={type === "error" ? "2px solid red" : undefined} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              
        {type === "error" ? (
            <ModalHeader color="red.500"><WarningIcon /> {title} <WarningIcon /></ModalHeader>
        ) : (
            <ModalHeader>{title}</ModalHeader>
        )}
              
        <ModalBody>
            {content}
        </ModalBody>
    
        <ModalFooter justifyContent="center">
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
        </ModalFooter>
    
        </ModalContent>
    </Modal>
  );
}