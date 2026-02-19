import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthStatus = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  
  const { currentUser, loading, isAuthenticated, isPremium } = context; // ← isPremium ADDED only
  
  return { user: currentUser, loading, isAuthenticated, isPremium }; // ← isPremium ADDED only
};