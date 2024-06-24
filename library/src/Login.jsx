import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Input, Button } from '@chakra-ui/react';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '', 
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            if (data.accessToken) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                navigate('/book');
            }
        } catch (error) {
            console.error('Registration Error:', error); 
        }
    };

    return(
        <Box>
            <Heading size="md">Login</Heading>
            <Button onClick={() => navigate("/")}>Register</Button>
            <form onSubmit={handleSubmit}>
                <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <Button type="submit">Log in</Button>
            </form>
        </Box>
    )
}