import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://mylaravelecommerce-x59pn02e.b4a.run/api/user', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const login = () => {
        setIsAuthenticated(true);
        fetchUserData();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
