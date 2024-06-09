import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import homeright from './home-right.png';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null); // Reset local error before login attempt

    const success = await login(email, password); // Assume login returns a boolean indicating success or failure

    if (!success) {
      setLocalError('Email ou mot de passe incorrect.'); // Set custom error message
    }
  };

  if (user) {
    const role = user.role; // Récupérer le rôle de l'utilisateur
    if (role === 'admin') {
      return <Navigate to="/" />;
    } else if (role === 'aide') {
      return <Navigate to="/dash-Aide" />;
    } else if (role === 'médecin') {
      return <Navigate to="/dash-Medecin" />;
    }
  }

  return (
    <section className="dark:bg-gray-50 h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src={homeright}
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
            Se connecter
          </p>
        </div>
        <form className="login" onSubmit={handleSubmit}>
          <input
            className=" text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Adresse Email"
          />
         
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Mot de passe"
          />
          
          {localError && (
            <div className="text-red-500 text-sm mt-2">
              {localError}
            </div>
          )}

          <div className="text-center md:text-left">
            <button
              disabled={isLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Connecter
            </button>
          </div>
        </form>
       
      </div>
    </section>
  );
};

export default Login;
