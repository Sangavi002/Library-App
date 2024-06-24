import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, Select, Alert, AlertIcon } from '@chakra-ui/react';

export const AddBook = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        price: '',
    });

    const [showAlert, setShowAlert] = useState(false); // State for showing alert

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenreChange = (e) => {
        setFormData({ ...formData, genre: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        let requestData = formData;
        requestData['user_id'] = userData.userId;
        try {
            const response = await fetch('http://localhost:3000/book/addbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            console.log(data); 
            setShowAlert(true); 
            navigate('/book');
        } catch (error) {
            console.error('Add Book Error:', error); 
        }
    };

    return (
        <Box>
            <Heading size="md">Add Book</Heading>
            <form onSubmit={handleSubmit}>
                <Input type="text" name="title" placeholder="Book Name" value={formData.title} onChange={handleChange} required />
                <Input type="text" name="author" placeholder="Author Name" value={formData.author} onChange={handleChange} required />
                <Input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                <Select name="genre" placeholder='Select Genre' value={formData.genre} onChange={handleGenreChange} required>
                    <option value='Fiction'>Fiction</option>
                    <option value='Non-Fiction'>Non-Fiction</option>
                    <option value='Romance'>Romance</option>
                    <option value='Fantasy'>Fantasy</option>
                    <option value='Thriller'>Thriller</option>
                </Select>
                <Button type="submit">Add book</Button>
            </form>
            {showAlert && (
                <Alert status='success' variant='solid'>
                    <AlertIcon />
                    New Book is uploaded to the server. 
                </Alert>
            )}
        </Box>
    );
};
