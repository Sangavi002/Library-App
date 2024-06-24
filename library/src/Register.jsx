import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Heading, Input, Button, Select, Stack, Checkbox } from '@chakra-ui/react';

export const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [selectedValues, setSelectedValues] = useState(['VIEWER']); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedValues((prevSelectedValues) => {
          if (checked) {
            return [...prevSelectedValues, value];
          } else {
            return prevSelectedValues.filter((v) => v !== value);
          }
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let requestData = formData;
        requestData['role'] = selectedValues;
        try {
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            navigate("/login")
        } catch (error) {
            console.error('Registration Error:', error); 
        }
    };

    return (
        <Box>
            <Heading size="md">Register</Heading>
            <form onSubmit={handleSubmit}>
                <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                {/* <Select onChange={(e) => setRole(e.target.value)} placeholder='By default Creator role is added, select further roles'> */}
                    {/* <option value='Creator'>Creator</option> */}
                    {/* <option value='VIEWER'>Viewer</option> */}
                    {/* <option value='VIEW_ALL'>View_All</option> */}
                {/* </Select> */}
                <Heading as='h6' size='xs'>
                    Select user roles
                </Heading>
                <Stack spacing={5} direction="row">
                    <Checkbox
                    value="CREATOR"
                    size="lg"
                    colorScheme="red"
                    isChecked={selectedValues.includes('CREATOR')}
                    onChange={handleCheckboxChange}
                    >
                    Creator
                    </Checkbox>
                    <Checkbox
                    value="VIEWER"
                    size="lg"
                    colorScheme="green"
                    isChecked={selectedValues.includes('VIEWER')}
                    onChange={handleCheckboxChange}
                    >
                    Viewer
                    </Checkbox>
                    <Checkbox
                    value="VIEW_ALL"
                    size="lg"
                    colorScheme="orange"
                    isChecked={selectedValues.includes('VIEW_ALL')}
                    onChange={handleCheckboxChange}
                    >
                    View all
                    </Checkbox>
                </Stack>
                <Button type="submit" >Register</Button>
            </form>
        </Box>
    );
};
