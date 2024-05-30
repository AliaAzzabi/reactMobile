import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { addspecialite } from '../liaisonfrontback/operation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import {
    Card,
    Button,
} from "@material-tailwind/react";

function AddSpecialte() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    if (!user || (user.role !== "admin")) {
        return <Navigate to="/login" />;
    }

    const [specialite, setspecialite] = useState({
        nom: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setspecialite({ ...specialite, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addspecialite({ ...specialite, id: Date.now() }, (response) => {
            if (response && response.status === 201) {
                localStorage.setItem('successMessage', 'La spécialité a été ajoutée avec succès');
                setspecialite({
                    nom: '',
                    description: ''
                });
                navigate('/listeSpecialite');
            } else if (response && response.status === 400) {
                setErrorMessage(response.data.error || "Cette spécialité existe déjà.");
                toast.error(response.data.error || "Cette spécialité existe déjà.");
            } else {
                console.error("Erreur lors de l'ajout de la spécialité :", response && response.data.error);
                toast.error('Une erreur s\'est produite lors de l\'ajout de la spécialité');
            }
        });
    };
    

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <WelcomeBanner />
                        <div className="sm:col-span-2 rounded-lg py-3 h dark:bg-gray-800 text-gray-500">
                            <Card className="pt-8 pl-8 pb-7 pr-8 rounded-lg dark:bg-gray-800 text-gray-500">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-12">
                                        <div className='overflow-hidden'>
                                            <h1 className="text-xl text-center leading-7 text-gray-600">Ajouter une spécialité</h1>
                                        </div>
                                        <div className="border-b border-gray-500/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 dark:text-gray-50 text-gray-800">Insérer vos données</h2>
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="nom" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nom *</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="nom" id="first-name" autoComplete="given-name" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={specialite.nom} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Description *</label>
                                                    <div className="mt-2">
                                                        <textarea name="description" id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description..." value={specialite.description} onChange={handleChange} required></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" onClick={() => navigate('/listeSpecialite')} className="text-gray-500 dark:bg-gray-800">Annuler</button>
                                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ajouter</button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />

        </div>
    );
}

export default AddSpecialte;
