import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Button,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Paper,
    Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AuthContext from '../context/AuthContext';
import Layout from '../components/layout/Layout';

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, error, clearError } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        // If already authenticated, redirect to dashboard
        if (isAuthenticated) {
            navigate('/dashboard');
        }

        // Clear any previous errors
        clearError();
        // eslint-disable-next-line
    }, [isAuthenticated, navigate]);

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
        setLocalError('');
    };

    const onSubmit = async(e) => {
        e.preventDefault();

        // Validate form
        if (!name || !email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register({
            name,
            email,
            password
        });

        setLoading(false);

        if (!result.success) {
            setLocalError(result.message);
        }
    };

    return ( <
        Layout >
        <
        Container component = "main"
        maxWidth = "xs" >
        <
        Paper elevation = { 3 }
        sx = {
            { p: 4, mt: 8 }
        } >
        <
        Box sx = {
            {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }
        } >
        <
        Avatar sx = {
            { m: 1, bgcolor: 'primary.main' }
        } >
        <
        LockOutlinedIcon / >
        <
        /Avatar> <
        Typography component = "h1"
        variant = "h5" >
        Sign up <
        /Typography>

        {
            (localError || error) && ( <
                Alert severity = "error"
                sx = {
                    { width: '100%', mt: 2 }
                } > { localError || error } <
                /Alert>
            )
        }

        <
        Box component = "form"
        onSubmit = { onSubmit }
        noValidate sx = {
            { mt: 3 }
        } >
        <
        Grid container spacing = { 2 } >
        <
        Grid item xs = { 12 } >
        <
        TextField autoComplete = "name"
        name = "name"
        required fullWidth id = "name"
        label = "Full Name"
        autoFocus value = { name }
        onChange = { onChange }
        /> < /
        Grid > <
        Grid item xs = { 12 } >
        <
        TextField required fullWidth id = "email"
        label = "Email Address"
        name = "email"
        autoComplete = "email"
        value = { email }
        onChange = { onChange }
        />
         < /Grid > <
        Grid item xs = { 12 } >
        <
        TextField required fullWidth name = "password"
        label = "Password"
        type = "password"
        id = "password"
        autoComplete = "new-password"
        value = { password }
        onChange = { onChange }
        /> < /
        Grid > <
        Grid item xs = { 12 } >
        <
        TextField required fullWidth name = "confirmPassword"
        label = "Confirm Password"
        type = "password"
        id = "confirmPassword"
        value = { confirmPassword }
        onChange = { onChange }
        /> < /
        Grid > <
        /Grid> <
        Button type = "submit"
        fullWidth variant = "contained"
        sx = {
            { mt: 3, mb: 2 }
        }
        disabled = { loading } > { loading ? 'Signing up...' : 'Sign Up' } <
        /Button> <
        Grid container justifyContent = "flex-end" >
        <
        Grid item >
        <
        Link component = { RouterLink }
        to = "/login"
        variant = "body2" >
        Already have an account ? Sign in
        <
        /Link> < /
        Grid > <
        /Grid> < /
        Box > <
        /Box> < /
        Paper > <
        /Container> < /
        Layout >
    );
};

export default Register;