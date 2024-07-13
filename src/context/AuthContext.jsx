import {createContext, useState, useEffect, useCallback} from 'react';
import axios from "axios";
import {API_ENDPOINT} from "../main.jsx";

const AuthContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const getUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINT + '/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setIsAuthenticated(true);
            setUser(response.data);
        } catch (e) {
            if (e.response.code === 401) {
                setIsAuthenticated(false);
                logout();
                return;
            }

            console.error(e.response.status);
            console.error(e.response.data);
        }
    }, []);

    useEffect(() => {
        getUser().then();
    }, [getUser]);

    useEffect(() => {
        if (isAuthenticated) {
            getUser().then();
        } else {
            setUser(null);
        }
    }, [getUser, isAuthenticated]);

    function login(token, userID) {
        localStorage.setItem('token', token);
        localStorage.setItem('userID', userID);

        setIsAuthenticated(true);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');

        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            { children }
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };
