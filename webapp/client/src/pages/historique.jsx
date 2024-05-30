import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/outline';
import { deleteHistorique, getAllHistoriques } from '../liaisonfrontback/operation';


import {
  Card,
  CardHeader,
  Button,
  Typography,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Historique() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [historiques, setHistoriques] = useState([]);
    const [allHistoriques, setAllHistoriques] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [historiquesPerPage] = useState(10); // Nombre d'historiques à afficher par page
  
    useEffect(() => {
      const fetchHistoriques = async () => {
        try {
          const historiquesData = await getAllHistoriques();
          setHistoriques(historiquesData);
          setAllHistoriques(historiquesData); 
        } catch (error) {
          console.error('Error fetching historiques:', error);
        }
      };
  
      fetchHistoriques();
    }, []);
  
    if (!user || (user.role !== "médecin" && user.role !== "aide")) {
      return <Navigate to="/login" />;
    }
  
    const handleDeleteHistorique = (id) => {
      const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet historique ?");
      if (confirmDelete) {
        deleteHistorique(id, (res) => {
          if (res.data) {
            setHistoriques(historiques.filter(historique => historique._id !== id));
            console.log("Historique supprimé avec succès");
          } else {
            console.error("Erreur lors de la suppression de l'historique :", res.error);
          }
        });
      }
    };
  
    const handleSearch = (event) => {
      const searchTerm = event.target.value.toLowerCase();
      setSearchTerm(searchTerm);
  
      const filteredHistoriques = allHistoriques.filter(historique =>
        historique.patient.nomPrenom.toLowerCase().includes(searchTerm)
      );
      setHistoriques(filteredHistoriques);
    };
  
    // Calculer le nombre total de pages
    const totalPages = Math.ceil(historiques.length / historiquesPerPage);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />
            <Card className="h-full w-full dark:bg-gray-800">
              <CardHeader floated={false} shadow={false} className="dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-none">
                <div className="mb-5 ml-10 flex items-center mr-8 justify-between gap-8">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Historique d'appel téléphonique
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center mr-8 justify-between gap-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 ml-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="text" placeholder="Chercher" onChange={handleSearch} id="table-search-users" className="block p-2 ps-10 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ml-8 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row ">
                    <Link to="" className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center">
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Ajouter</span>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="overflow-x-auto px-0 dark:bg-gray-800 text-gray-500">
                <div className="overflow-y-auto max-h-[800px]">
                  <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >
                            Nom & Prénom
                          </Typography>
                        </th>
                      
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >
                            Description
                          </Typography>
                        </th>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historiques.map((historique) => (
                        <tr key={historique._id}>
                          
                          <td className='p-4 border-b border-blue-gray-50'>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {historique.patient.nomPrenom}
                                </Typography>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70 dark:text-white"
                                >
                                  Ajouté le : {new Date(historique.createdAt).toLocaleDateString()}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          
                          <td className='p-4 border-b border-blue-gray-50'>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {historique.description}
                            </Typography>
                          </td>
                          <td className='p-4 border-b border-blue-gray-50'>
                            <div className="flex items-center">
                              <Tooltip content="Supprimer" className="text-white bg-red-400 rounded-md">
                                <IconButton variant="text" className='text-red-800' onClick={() => handleDeleteHistorique(historique._id)}>
                                  <TrashIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
              <CardFooter className="text-gray-500 flex items-center justify-between  border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className=" font-normal ">
                  Page {currentPage} sur {totalPages}
                </Typography>
                <div className="flex gap-2 ">
                  <Button
                    variant="outlined"
                    size="sm"
                    className='text-gray-500 dark:bg-gray-800'
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    className='text-gray-500 dark:bg-gray-800'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Historique;
