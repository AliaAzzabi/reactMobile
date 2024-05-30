import React, { useState, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

import { addPatient } from '../liaisonfrontback/operation';

function AddPatient() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [dateNaissance, setDateNaissance] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPatient = Object.fromEntries(formData);
        newPatient.dateNaissance = dateNaissance;

        // Vérification des champs obligatoires
        if (!newPatient.nomPrenom || !newPatient.cin || !newPatient.telephone || !newPatient.dateNaissance || !newPatient.sexe) {
            setErrorMessage('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Traitement des notifications sélectionnées
        const notifications = Array.from(formData.getAll("notifier"));

        try {
            addPatient({ ...newPatient, notifier: notifications }, (response) => {
                console.log(response);
                if (response.error) {
                    setErrorMessage(response.error);
                    setSuccessMessage('');
                } else {
                    setSuccessMessage('Patient ajouté avec succès.');
                    setErrorMessage('');
                }
            });
        } catch (error) {
            console.error(error);
            setErrorMessage('Une erreur s\'est produite lors de l\'ajout du patient.');
            setSuccessMessage('');
        }
    };

    if (!user || (user.role !== "médecin" && user.role !== "aide")) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <WelcomeBanner />
                        <div className=" sm:col-span-2   rounded-lg py-3 h  dark:bg-gray-800 text-gray-500">
                            <Card className="pt-8 pl-8 pb-7 pr-8 rounded-lg dark:bg-gray-800 text-gray-500">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-12 ">
                                        <div className='  overflow-hidden'>
                                            <h1 className=" text-xl   text-center leading-7 text-gray-600  ">Ajouter un patient</h1>
                                        </div>
                                        <div className="border-b border-gray-500/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 dark:text-gray-50 text-gray-800">Information personnelle</h2>
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="nomPrenom" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nom & Prénom *</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="nomPrenom" id="nomPrenom" autoComplete="nomPrenom" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">CIN *</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="cin" id="cin" autoComplete="cin" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Email</label>
                                                    <div className="mt-2">
                                                        <input id="email" name="email" type="email" autoComplete="email" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className=" sm:col-span-3">
                                                    <label htmlFor="telephone" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Numéro de téléphone *</label>
                                                    <div className="mt-2">
                                                        <input type="tel" placeholder=" +216 25 222 555" maxLength="8" name="telephone" id="telephone" autoComplete="telephone" className=" dark:bg-gray-800 text-gray-900 block w-full rounded-md border-0 py-1.5 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="dateNaissance" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Date de naissance *</label>
                                                    <div className="mt-2">
                                                        <DatePicker
                                                            selected={dateNaissance}
                                                            onChange={date => setDateNaissance(date)}
                                                            dateFormat="dd/MM/yyyy"
                                                            showYearDropdown
                                                            scrollableYearDropdown
                                                            yearDropdownItemNumber={60}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <legend className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Sexe *</legend>
                                                    <div className="mt-4 flex gap-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="homme"
                                                                name="sexe"
                                                                value="homme"
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                            />
                                                            <label htmlFor="homme" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Homme</label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="femme"
                                                                name="sexe"
                                                                value="femme"
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                            />
                                                            <label htmlFor="femme" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Femme</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-b border-gray-900/10 pb-12">
                                            <fieldset>
                                                <legend className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-50">Notifications</legend>
                                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Vous pouvez choisir la méthode par laquelle vous préférez être notifié des changements de rendez-vous.</p>
                                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Nous vous informerons toujours des changements importants.</p>

                                                <div className="mt-6 space-y-6">
                                                    <div className="relative flex gap-x-3 items-center">
                                                        <input id="email" name="notifier" type="checkbox" value="email" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Par Email</label>
                                                    </div>
                                                    <div className="relative flex gap-x-3 items-center">
                                                        <input id="sms" name="notifier" type="checkbox" value="sms" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                                        <label htmlFor="sms" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Par SMS</label>
                                                    </div>
                                                    <div className="relative flex gap-x-3 items-center">
                                                        <input id="appel" name="notifier" type="checkbox" value="appel" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                                        <label htmlFor="appel" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Appel téléphonique</label>
                                                    </div>
                                                </div>
                                            </fieldset>

                                        </div>
                                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                                        {successMessage && <p className="text-green-500">{successMessage}</p>}

                                    </div>
                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" className="text-sm font-semibold leading-6 dark:text-gray-50 text-gray-900">Annuler</button>
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

export default AddPatient;
