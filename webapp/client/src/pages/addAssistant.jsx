import React, { useState, useContext } from 'react';
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { TrashIcon } from '@heroicons/react/outline';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { deleteHistorique, getAllHistoriques, createHistorique, getAidesByUserId } from '../liaisonfrontback/operation';

function Historique() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [historiques, setHistoriques] = useState([]);
  const [allHistoriques, setAllHistoriques] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [historiquesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [description, setDescription] = useState('');
  const aideId = user.user_id;

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

  const fetchAidesByUserId = async (aideId) => {
    try {
      const aidesData = await getAidesByUserId(aideId);
      return aidesData;
    } catch (error) {
      console.error('Erreur lors de la récupération des aides:', error);
      return null;
    }
  };

  const handleDeleteHistorique = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet historique?");
    if (confirmDelete) {
      deleteHistorique(id, (res) => {
        if (res.data) {
          setHistoriques((prevHistoriques) => prevHistoriques.filter((historique) => historique._id !== id));
          toast.success("Historique supprimé avec succès");
        } else {
          toast.error("Erreur lors de la suppression de l'historique :", res.error);
        }
      });
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const aidesData = await fetchAidesByUserId(aideId);
      const data = {
        nomPrenom: patientName,
        aideId: aidesData[0],
        description: description,
      };

      createHistorique(data, async (response) => {
        if (response.status === 201) {
          const newHistorique = response.data;
          setHistoriques((prevHistoriques) => [...prevHistoriques, newHistorique]);
          setAllHistoriques((prevAllHistoriques) => [...prevAllHistoriques, newHistorique]);

          closeModal();
          setPatientName('');
          setDescription('');
          toast.success("Historique ajouté avec succès");

          // Fetch the updated historiques data
          const updatedHistoriquesData = await getAllHistoriques();
          setHistoriques(updatedHistoriquesData);
          setAllHistoriques(updatedHistoriquesData);
        } else if (response.status === 404) {
          toast.error("Erreur: " + response.data.error); // Patient not found
        } else {
          toast.error("Erreur lors de la création de l'historique: " + (response.data?.error || response.message));
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'historique :', error);
      toast.error("Erreur lors de la création de l'historique: " + error.message);
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

  const totalPages = Math.ceil(historiques.length / historiquesPerPage);

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
                    <Link to="#" className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center" onClick={openModal}>
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Ajouter</span>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="overflow-auto px-0">
                <div className="overflow-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Nom du patient</th>
                        <th className="px-6 py-3">Nom de l'aide</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {historiques
                        .slice((currentPage - 1) * historiquesPerPage, currentPage * historiquesPerPage)
                        .map((historique) => (
                          <tr key={historique._id}>
                            <td className="px-6 py-2">
                              <Typography variant="small" color="blue-gray" className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                {historique.patient.nomPrenom}
                              </Typography>
                            </td>
                            <td className="px-6 py-2">
                              <Typography variant="small" color="blue-gray" className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                {historique.aide.nomPrenom}
                              </Typography>
                            </td>
                            <td className="px-6 py-2">
                              <Typography variant="small" color="blue-gray" className="text-md text-gray-800 dark:text-gray-100">
                                {historique.description}
                              </Typography>
                            </td>
                            <td className="px-6 py-2">
                              <Tooltip content="Supprimer">
                                <IconButton
                                  className="bg-red-500"
                                  onClick={() => handleDeleteHistorique(historique._id)}
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </IconButton>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <button
                      className={`btn ${currentPage === 1 ? 'btn-disabled' : 'btn-outline'} mr-2`}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    <button
                      className={`btn ${currentPage === totalPages ? 'btn-disabled' : 'btn-outline'}`}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                  <div>
                    Page {currentPage} sur {totalPages}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Historique;
