import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { updateUserProfile, getUserProfile } from '../liaisonfrontback/operation'; 
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Fonction utilitaire pour formater la date au format yyyy-MM-dd
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nomPrenom: '',
        email: '',
        telephone: '',
        adresse: '',
        dateNaissance: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Récupérer le profil utilisateur lors du chargement du composant
        if (user) {
            getUserData();
        }
    }, [user]);

    const getUserData = async () => {
        try {
            const userProfile = await getUserProfile(user.token);
            setFormData({
                ...formData,
                nomPrenom: userProfile.nomPrenom,
                email: userProfile.email,
                telephone: userProfile.telephone,
                adresse: userProfile.adresse,
                dateNaissance: formatDate(userProfile.dateNaissance)
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur :', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            const updatedUser = await updateUserProfile({
                nomPrenom: formData.nomPrenom,
                email: formData.email,
                telephone: formData.telephone,
                adresse: formData.adresse,
                dateNaissance: formData.dateNaissance,
                password: formData.password
            }, user.token);
            toast.success('Profil utilisateur mis à jour avec succès ', updatedUser);
            // Mettre à jour l'état local du profil utilisateur
            setFormData({
                ...formData,
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
            // Gérer les erreurs côté client, par exemple, afficher un message d'erreur à l'utilisateur.
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Profile */}
                        <div className="grid grid-cols-3">
                            {/* Profile Section */}
                            <div className=" dark:bg-gray-800 sm:col-span-1 bg-white shadow-xl rounded-lg py-3 h-96 mr-8">
                                {/* Profile details */}
                                <div className="photo-wrapper p-2">
                                    <img className="w-32 h-32 rounded-full mx-auto" src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg"  alt="John Doe" />
                                </div>
                                <div className="p-2">
                                    <h3 className="text-center text-xl text-gray-800 font-medium leading-8">{formData.nomPrenom}</h3>
                                    <div className="text-center text-gray-400 text-xs font-semibold">
                                        <p>Radiologue</p>
                                    </div>
                                    {/* Table with profile details */}
                                    <table className=" text-xs my-3">
                                        <tbody>
                                            <tr>
                                                <td className="px-2 py-2 font-semibold">Adresse</td>
                                                <td className="px-2 py-2">{formData.adresse}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-2 font-semibold">Téléphone</td>
                                                <td className="px-2 py-2">{formData.telephone}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-2 font-semibold">Email</td>
                                                <td className="px-2 py-2">{formData.email}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Formulaire de mise à jour du profil */}
                            <div className=" dark:bg-gray-800 sm:col-span-2 bg-white shadow-xl rounded-lg py-3 h-96 mr-8">
                                <Card className=" dark:bg-gray-800 pt-8 pl-8 pb-8 pr-8 rounded-lg">
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-12">
                                            <div className="border-b border-gray-500/10 pb-12">
                                                <h2 className="text-base font-semibold leading-7 dark:text-gray-50 text-gray-800">Information personnelle</h2>
                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="nomPrenom" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nom & Prénom</label>
                                                        <div className="mt-2">
                                                            <input 
                                                                type="text"
                                                                name="nomPrenom"
                                                                value={formData.nomPrenom}
                                                                onChange={handleChange}
                                                                placeholder="Nom et prénom" 
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Email</label>
                                                        <div className="mt-2">
                                                            <input   
                                                                type="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                placeholder="Email"  
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="dateNaissance" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Date de naissance</label>
                                                        <div className="mt-2">
                                                            <input
                                                               type="date"
                                                               name="dateNaissance"
                                                               value={formData.dateNaissance}
                                                               onChange={handleChange}
                                                               placeholder="Date de naissance"
                                                               className="dark:bg-gray-800 text-gray-900 block w-full rounded-md border-0 py-1.5 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />                                                        
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="telephone" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Numéro de téléphone</label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="tel"
                                                                name="telephone"
                                                                value={formData.telephone}
                                                                onChange={handleChange}
                                                                placeholder="Téléphone"  
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />                                                        
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="adresse" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Adresse</label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="adresse"
                                                                value={formData.adresse}
                                                                onChange={handleChange}
                                                                placeholder="Adresse"  
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />                                                        
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nouveau mot de passe</label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                placeholder="Nouveau mot de passe"  
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />                                                        
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Confirmer le mot de passe</label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                                placeholder="Confirmer le mot de passe"  
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-b border-gray-500/10 pb-12">
                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                                                    <div className="col-span-full">
                                                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">photo</label>
                                                        <div className="mt-2 flex justify-center rounded-lg dark:bg-gray-700 border border-dashed border-gray-500/25 px-6 py-10">
                                                            <div className="text-center">
                                                                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <div className="mt-4 flex text-sm leading-6 text-gray-500">
                                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                                        <span>Upload a file</span>
                                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                                    </label>
                                                                    <p className="pl-1">or drag and drop</p>
                                                                </div>
                                                                <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <div className="mt-6 flex items-center justify-end gap-x-6">
                                            <button
                                                type="submit"
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Sauvegarder
                                            </button>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Profile;
