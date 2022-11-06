import { useContext } from 'react';
import { AuthContext, AuthContextDataProps } from '../context/AuthContext';

export function useAuth(): AuthContextDataProps {
    return useContext(AuthContext);
}