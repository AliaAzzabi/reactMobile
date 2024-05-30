import { createContext, useReducer, useEffect } from 'react';
export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(authReducer, { 

    user: null,
    loading: true, // Indicateur de chargement initial
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user }); 
    }
    
    // Mettre à jour l'état de chargement initial après la récupération des informations d'authentification
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  console.log('AuthContext state:', state);
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { !state.loading && children } {/* Rendre les enfants uniquement lorsque le chargement initial est terminé */}
    </AuthContext.Provider>
  );
};
