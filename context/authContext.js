import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  
  const handleAuthSuccess = useCallback(async (token, userObject) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    
    const finalUser = userObject || (await axios.get(`${API_URL}/users/auth`)).data;

    setUser(finalUser);
    setIsAuthenticated(true);
    
    router.push('/chat');
  }, [router]);

  
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await axios.get(`${API_URL}/users/auth`);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid token found, logging out.', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [logout]);

  const refetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/auth`);
      setUser(res.data);
    } catch (error) {
      console.error('Failed to refetch user', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };
  
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      await handleAuthSuccess(res.data.token, res.data.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {

      const res = await axios.post(`${API_URL}/users/register`, { name, email, password });

      await handleAuthSuccess(res.data.token);
    } catch (error) {
      throw error;
    }
  };

  const loginWithToken = async (token) => {
    await handleAuthSuccess(token);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, refetchUser, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);