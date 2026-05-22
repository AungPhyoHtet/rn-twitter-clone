import { createContext, ReactNode, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axiosConfig from '../helpers/axiosConfig';
import { User } from '../types';

type ApiErrors = Record<string, string[]>;

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, onError?: () => void) => void;
  logout: () => void;
  isLoading: boolean;
  errors: ApiErrors;
  errorMessage: string;
  clearErrors: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ApiErrors>({});
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        errors,
        errorMessage,
        clearErrors: () => {
          setErrors({});
          setErrorMessage('');
        },
        login: (email: string, password: string, onError?: () => void) => {
          setIsLoading(true);
          setErrors({});
          setErrorMessage('');
          axiosConfig
            .post('/login', {
              email,
              password,
              device_name: 'mobile',
            })
            .then((response) => {
              const { user: loggedInUser, token }: { user: User; token: string } = response.data;
              axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              setUser(loggedInUser);
              SecureStore.setItemAsync('user', JSON.stringify(loggedInUser));
              SecureStore.setItemAsync('token', token);
              setIsLoading(false);
            })
            .catch((error) => {
              setErrors(error.response?.data.errors ?? {});
              setErrorMessage(error.response?.data.message ?? 'Something went wrong.');
              setIsLoading(false);
              onError?.();
            });
        },
        logout: () => {
          axiosConfig
            .post('/logout')
            .then(() => {
              axiosConfig.defaults.headers.common['Authorization'] = '';
              setUser(null);
              SecureStore.deleteItemAsync('user');
              SecureStore.deleteItemAsync('token');
            })
            .catch((error) => {
              console.log(error.response?.data);
              setIsLoading(false);
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
