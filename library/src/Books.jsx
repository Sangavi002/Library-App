import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Table, Tbody, Tr, Th, Td, Alert, AlertIcon } from '@chakra-ui/react';
import { UpdateBook } from './UpdateBook';

export const Books = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('success');
    const [selectedBook, setSelectedBook] = useState(null);

    const [creator, setCreator] = useState(false);


    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if (user?.userRole?.includes('CREATOR')) {
            setCreator(true);
        }
        fetchBooks();
    }, []);

    // useEffect(() => {
    //     filterBooks();
    // }, [filter]);

    const filterBooks = async () => {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let userId = user.userId;
        let url = `http://localhost:3000/books?user_id=${userId}`;
        if (filter === 'new') {
            url += '&new=1';
        } else if (filter === 'old') {
            url += '&old=1';
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            let user = JSON.parse(localStorage.getItem('currentUser'));
            let userId = user.userId;
            console.log('sundar here', userId);
            const response = await fetch(`http://localhost:3000/books?user_id=${userId}`);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/book/deleteBook/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.status === 200) {
                setAlertMessage('Book deleted successfully.');
                setAlertStatus('success');
                fetchBooks();
            } else {
                setAlertMessage('Failed to delete book.');
                setAlertStatus('error');
            }
        } catch (error) {
            setAlertMessage('Failed to delete book.');
            setAlertStatus('error');
        } finally {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleBookUpdated = () => {
        setSelectedBook(null);
        fetchBooks();
    };

    const showAlertMessage = (message, status) => {
        setAlertMessage(message);
        setAlertStatus(status);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <>
            <Box>
                <Heading>Student's Library</Heading>
                <Button onClick={() => navigate("/login")}>Logout</Button>
            </Box>
            
                <Box>
                    {creator && <Button onClick={() => navigate('/addBook')}>Add Books</Button>}
                    <Button onClick={() => setFilter('new')}>Books Created Within Last 10 Minutes</Button>
                    <Button onClick={() => setFilter('old')}>Books Created More Than 10 Minutes Ago</Button>
                </Box>
            <Box>
                {showAlert && (
                    <Alert status={alertStatus} variant='solid'>
                        <AlertIcon />
                        {alertMessage}
                    </Alert>
                )}
                <Table>
                    <thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Author</Th>
                            <Th>Genre</Th>
                            <Th>Price</Th>
                           {creator && <Th>Edit</Th>}
                            {creator && <Th>Delete</Th>}
                        </Tr>
                    </thead>
                    <Tbody>
                        {books.map((book) => (
                            <Tr key={book._id}>
                                <Td>{book.title}</Td>
                                <Td>{book.author}</Td>
                                <Td>{book.genre}</Td>
                                <Td>{book.price}</Td>
                                {creator && <Td>
                                    <Button onClick={() => setSelectedBook(book)}>Edit</Button>
                                </Td>}
                                {creator && <Td>
                                    <Button onClick={() => handleDelete(book._id)}>Delete</Button>
                                </Td>}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {selectedBook && (
                <UpdateBook
                    bookId={selectedBook._id}
                    initialData={selectedBook}
                    onBookUpdated={handleBookUpdated}
                    onShowAlert={showAlertMessage}
                />
            )}
        </>
    );
};
