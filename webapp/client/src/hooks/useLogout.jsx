import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    try {
      // Clear user data from local storage
      localStorage.removeItem('user');

      // Dispatch logout action to update auth context
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return { logout };
};