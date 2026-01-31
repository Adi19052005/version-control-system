import React, { createContext, useState, useEffect, use } from 'react';

const AuthContext = createContext();

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUser({ id: userId });
        }
    }, []);

    const value = {
        currentUser,
        setCurrentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}