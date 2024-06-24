import { useState, useEffect, useRef } from 'react';
import { useDisclosure, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Alert, AlertIcon } from '@chakra-ui/react';

export const UpdateBook = ({ bookId, initialData, onBookUpdated, onShowAlert }) => {
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const initialRef = useRef(null);
    const finalRef = useRef(null);

    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenreChange = (e) => {
        setFormData({ ...formData, genre: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/book/updateBook/${bookId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.status === 200) {
                onShowAlert('Book updated successfully.', 'success');
                onBookUpdated();
                onClose();
            } else {
                onShowAlert(data.msg || 'Failed to update book.', 'error');
            }
        } catch (error) {
            console.error('Update Book Error:', error);
            onShowAlert('Failed to update book.', 'error');
        }
    };

    if (!initialData) {
        return null;
    }

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Book</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input ref={initialRef} name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Author</FormLabel>
                            <Input name="author" placeholder="Author Name" value={formData.author} onChange={handleChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Price</FormLabel>
                            <Input name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Genre</FormLabel>
                            <Select name="genre" placeholder='Select Genre' value={formData.genre} onChange={handleGenreChange}>
                                <option value='Fiction'>Fiction</option>
                                <option value='Non-Fiction'>Non-Fiction</option>
                                <option value='Romance'>Romance</option>
                                <option value='Fantasy'>Fantasy</option>
                                <option value='Thriller'>Thriller</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
