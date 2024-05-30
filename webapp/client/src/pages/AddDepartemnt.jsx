import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { addDepartement } from '../liaisonfrontback/operation';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import { Link } from 'react-router-dom';
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
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';



function AddDepartement() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const Navigation = useNavigate();
    if (!user) {
        return <Navigate to="/login" />;
    }

    const [departement, setDepartement] = useState({
        nom: '',
        localisation: '',
        responsable: '',
        dateCreation: '',
        nombreEmployes: '',
        description: '',

    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartement({ ...departement, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();



        addDepartement({ ...departement, id: Date.now() }, (response) => {
            if (response && !response.error) {
                alert('Le departement a été ajouté avec succès');
                setDepartement({
                    nom: '',
                    localisation: '',
                    responsable: '',
                    dateCreation: '',
                    nombreEmployes: '',
                    description: '',

                });

                Navigation('/listeDepartement');


            } else {
                console.error("Erreur lors de l'ajout du departement :", response && response.error);
                alert('Une erreur s\'est produite lors de l\'ajout du departement');
            }
        });
    };

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

                        <WelcomeBanner />

                        <div className=" sm:col-span-2   rounded-lg py-3 h  dark:bg-gray-800 text-gray-500">
                            <Card className="pt-8 pl-8 pb-7 pr-8 rounded-lg dark:bg-gray-800 text-gray-500">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-12">
                                        <div className='overflow-hidden'>
                                            <h1 className="text-xl text-center leading-7 text-gray-600">Ajouter un département</h1>
                                        </div>

                                        <div className="border-b border-gray-500/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 dark:text-gray-50 text-gray-800">Informations sur le département</h2>

                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="nom" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nom *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            id="nom"
                                                            name="nom"
                                                            value={departement.nom}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="localisation" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Localisation *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            id="localisation"
                                                            name="localisation"
                                                            value={departement.localisation}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="responsable" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Responsable *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            id="responsable"
                                                            name="responsable"
                                                            value={departement.responsable}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="nombreEmployes" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nombre Employés *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="number"
                                                            id="nombreEmployes"
                                                            name="nombreEmployes"
                                                            value={departement.nombreEmployes}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="dateCreation" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Date de création *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="date"
                                                            id="dateCreation"
                                                            name="dateCreation"
                                                            value={departement.dateCreation}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Description *</label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            id="description"
                                                            name="description"
                                                            value={departement.description}
                                                            onChange={handleChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            rows="4"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" onClick={() => Navigation('/listeSpecialite')} className="text-sm font-semibold leading-6 dark:text-gray-50 text-gray-900">Annuler</button>
                                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ajouter</button>
                                    </div>
                                </form>

                            </Card>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}

export default AddDepartement;