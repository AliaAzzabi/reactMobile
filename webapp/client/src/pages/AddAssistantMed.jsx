import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import { Link } from 'react-router-dom';
import { addaides } from '../liaisonfrontback/operation';
import { getMedecins } from '../liaisonfrontback/operation';

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

function AddAssistantMed() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const Navigation = useNavigate();
    const { medecinId } = useParams();


   
  
    const [aide, setaide] = useState({
        cin: '',
        nomPrenom: '',
        email: '',
        dateNaissance: '',
        role: '',
        telephone: '',
        password: '',
        sexe: '',
        dateAdhesion: '',
        education: '',
        image: null,
        adresse: '',
        medecin: medecinId,
    });

    const { user } = useContext(AuthContext);
    const handleImageChange = (e) => {
        setaide({
            ...aide,
            image: e.target.files[0],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setaide({
            ...aide,
            [name]: value
        });
    };
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append('image', aide.image);
            formData.append('cin', aide.cin);
            formData.append('nomPrenom', aide.nomPrenom);
            formData.append('telephone', aide.telephone);
            formData.append('email', aide.email);
            formData.append('password', aide.password);
            formData.append('sexe', aide.sexe);
            formData.append('dateAdhesion', aide.dateAdhesion);
            formData.append('dateNaissance', aide.dateNaissance);
            formData.append('role', aide.role);
            formData.append('adresse', aide.adresse);
            formData.append('medecin', medecinId);
            formData.append('education', aide.education);
    
            const callback = (response) => {
                if (response && response.status >= 200 && response.status < 300) {
                    localStorage.setItem('successMessage', 'Assistant ajouté avec succès')
                    Navigation('/listeAideParMed');
                } else {
                    setError('email existe déja.');
                    alert('Cet email est déjà utilisé.');
                }
            };
    
            const response = await addaides(formData, callback);
        } catch (error) {
            setError(error.message);
        }
    };



    if (!user || (user.role !== "médecin")) {
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
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto ">
                        <WelcomeBanner />

                        {/* Form */}
                        <div className="sm:col-span-2 rounded-lg py-3 h dark:bg-gray-800 text-gray-500">
                            <Card className="pt-8 pl-8 pb-7 pr-8 rounded-lg dark:bg-gray-800 text-gray-500">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-12">
                                        <div className="overflow-hidden">
                                            <h1 className="text-xl text-center leading-7 text-gray-600">Ajouter un assistant</h1>
                                        </div>

                                        {/* Form inputs */}
                                        <div className="border-b border-gray-500/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 dark:text-gray-50 text-gray-800">Information personnelle</h2>
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">CIN *</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="cin" id="cin" value={aide.cin} onChange={handleInputChange} autoComplete="given-name" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                                                    </div>
                                                </div>
                                                {/* First Name */}
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Nom & Prénom *</label>
                                                    <div className="mt-2">
                                                        <input type="text" name="nomPrenom" id="nomPrenom" value={aide.nomPrenom} onChange={handleInputChange} autoComplete="given-name" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                                                    </div>
                                                </div>
                                                {/* Email */}
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Email *</label>
                                                    <div className="mt-2">
                                                        <input id="email" name="email" type="email" value={aide.email} onChange={handleInputChange} autoComplete="email" className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                                                    </div>
                                                </div>
                                                {/* Numéro de téléphone */}
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Numéro de téléphone *</label>
                                                    <div className="mt-2">
                                                        <input type="tel" placeholder="+216 25 222 555" maxLength="8" name="telephone" id="telephone" value={aide.telephone} onChange={handleInputChange} autoComplete="tel" className="dark:bg-gray-800 text-gray-900 block w-full rounded-md border-0 py-1.5 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
                                                    </div>
                                                </div>
                                                {/* Date de naissance */}
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="dateNaissance" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Mot de Passe *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            value={aide.password}
                                                            onChange={handleInputChange}
                                                            autoComplete="current-password"
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="adress" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Adresse *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="adresse"
                                                            name="adresse"
                                                            type="text"
                                                            value={aide.adresse}
                                                            placeholder='Adresse ...'
                                                            onChange={handleInputChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                {/* Poste */}
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="poste" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Poste de travaille *</label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="role"
                                                            name="role"
                                                            type="text"
                                                            value={aide.role}
                                                            onChange={handleInputChange}
                                                            className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                {/* Sexe */}
                                                <div className="sm:col-span-3">
                                                    <legend className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Sexe *</legend>
                                                    <div className="mt-4 flex gap-x-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="male"
                                                                name="sexe"
                                                                value="male"
                                                                checked={aide.sexe === 'male'}
                                                                onChange={handleInputChange}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                                required
                                                            />
                                                            <label htmlFor="male" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Homme</label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                id="femme"
                                                                name="sexe"
                                                                value="femme"
                                                                checked={aide.sexe === 'femme'}
                                                                onChange={handleInputChange}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                                required
                                                            />
                                                            <label htmlFor="femme" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-50">Femme</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-3 grid grid-cols-2 gap-x-6">
                                                    {/* Mot de passe */}
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Date de naissance *</label>
                                                        <div className="mt-2">

                                                            <input
                                                                id="date-of-birth"
                                                                name="dateNaissance"
                                                                type="date"
                                                                value={aide.dateNaissance}
                                                                onChange={handleInputChange}
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Date d'adhésion */}
                                                    <div>
                                                        <label htmlFor="dateAdhesion" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Date d'adhésion *</label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="dateAdhesion"
                                                                name="dateAdhesion"
                                                                type="date"
                                                                value={aide.dateAdhesion}
                                                                onChange={handleInputChange}
                                                                className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label htmlFor="poste" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Education *</label>
                                            <div className="mt-2">
                                                <textarea
                                                    id="education"
                                                    name="education"

                                                    value={aide.education}
                                                    onChange={handleInputChange}
                                                    className="dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    required
                                                />
                                            </div>
                                        </div>


                                        {/* Upload Photo */}
                                        <div className="border-b border-gray-500/10 pb-12">
                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="col-span-full">
                                                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">Choisir une photo de profil</label>
                                                    <div className="mt-2 flex justify-center rounded-lg dark:bg-gray-700 border border-dashed border-gray-500/25 px-6 py-10">
                                                        <input
                                                            id="file"
                                                            name="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange} // Gérez le changement de l'image
                                                            className="sr-only"
                                                            required
                                                        />
                                                        <label htmlFor="file" className="cursor-pointer">
                                                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="mt-4 flex text-sm leading-6 text-gray-500">
                                                                <span className="font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">Choisissez un fichier</span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                {/* Afficher un indicateur visuel si une image est sélectionnée */}
                                                {aide.image && (
                                                    <div className="col-span-full mt-4 flex justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="ml-2 text-green-500">Image sélectionnée</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>




                                    </div>

                                    {/* Form Actions */}
                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                       
                                    <button type="button" onClick={() => Navigation('/listeAssistant')} className="text-gray-500 dark:bg-gray-800">Annuler</button>
                                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ajouter</button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
}

export default AddAssistantMed;