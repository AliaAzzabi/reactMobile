import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { getAllAide, deleteAide, updateAide } from '../liaisonfrontback/operation';
import { getMedecins } from '../liaisonfrontback/operation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

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

function ListeAssistant() {
  const [users, setUsers] = useState([]);
  const [filteredAssitants, setFilteredAssitants] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [aides, setAides] = useState([]);
  const [selectedAide, setSelectedAide] = useState(null);
  const [selectedMedecinId, setSelectedMedecinId] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const assistantsPerPage = 5;
  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
        toast.success(successMessage); 
        localStorage.removeItem('successMessage'); 
    }
}, []);

  useEffect(() => {
    const filtered = aides.filter(aide =>
      aide.user.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssitants(filtered);
  }, [searchTerm, aides]);

  useEffect(() => {
    getMedecins((res) => {
        if (res.data) {
            const filteredMedecins = res.data.filter(medecin => medecin.isSelected);
            setMedecins(filteredMedecins);
            //setMedecins(res.data);
        } else {
            console.error("Error fetching doctors:", res.error);
        }
    });
}, []);

  useEffect(() => {
    getAllAide((res) => {
      if (res.data) {
        setAides(res.data);
      } else {
        toast.error("Erreur lors de la récupération des aides :", res.error);
      }
    });
  }, [aides]);

  const DeleteAide = (id) => {
    Swal.fire({
      title: "Voulez-vous vraiment supprimer cet assistant!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAide(id, (res) => {
          if (res.data) {
            setAides(aides.filter(aide => aide._id !== id));
            Swal.fire({
              title: "Supprimé!",
              text: "Aide supprimé avec succès.",
              icon: "success"
            });
           // toast.success("Aide supprimé avec succès");
          } else {
            toast.error("Erreur lors de la suppression de l'assistant :", res.error);
          }
        });
      }
    });
  };
  

  

  if (!user || (user.role !== "admin")) {
    return <Navigate to="/login" />;
  }

  const openModal = (aide) => {
    setSelectedAide(aide);
    setSelectedMedecinId(aide.medecin ? aide.medecin._id : null);
    console.log("Médecin lié à l'aide sélectionnée :", aide.medecin);

    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAide(null);
    setSelectedMedecinId(null);
  };

  const UpdateAide = (e) => {
    e.preventDefault();
    if (selectedAide) {
        const formData = new FormData(e.target);
        const selectedMedecin = medecins.find(medecin => medecin._id === formData.get('medecin'));
        
        let updatedAide = {
            cin: formData.get('cin'),
            nomPrenom: formData.get('nomPrenom'),
            adresse: formData.get('adresse'),
            telephone: formData.get('telephone'),
            email: formData.get('email'),
            education: formData.get('education'),
            medecin: selectedMedecin,
            role: formData.get('role'),
            password: formData.get('password') !== '' ? formData.get('password') : undefined,
            image: formData.get('image'),
        };
       

        updateAide(selectedAide._id, updatedAide, (res) => {
            if (res.data) {
                const updatedAides = aides.map((aide) => (aide._id === res.data._id ? res.data : aide));
                setAides(updatedAides);
                closeModal();
                toast.success("Assistant modifié avec succès");
            } else {
                toast.error("Erreur lors de la modification de l'assistant :", res.error);
            }
        });
    }
};

  const AidePerPage = 5;


  const indexOfLastAide = currentPage * assistantsPerPage;
  const indexOfFirstAide = (currentPage - 1) * assistantsPerPage;
  const currentAssistants = filteredAssitants.slice(indexOfFirstAide, indexOfLastAide);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
            {/* Dashboard actions */}
            <WelcomeBanner />
            <Card className="h-full w-full dark:bg-gray-800">
              <CardHeader floated={false} shadow={false} className=" dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-none">
                <div className=" mb-8 ml-8 flex items-center mr-8 justify-between gap-8">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Liste des Assistants
                    </Typography>

                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row mt-2">
                    <Link to="/addAssistant" className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center">
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Ajouter un assistant</span>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 ml-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search-users"
                    className="block p-2 ps-10 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ml-8 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Chercher"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardBody className="overflow-x-auto px-0 dark:bg-gray-800 text-gray-500">
                <div className="overflow-y-auto max-h-[800px]">
                  <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >
                            Nom et prénom

                          </Typography>
                        </th>

                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >
                            Poste

                          </Typography>
                        </th>                                 
                           <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >
                            Téléphone

                          </Typography>
                        </th>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >

                            Email
                          </Typography>
                        </th>

                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >

                            Médecin lié
                          </Typography>
                        </th>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 dark:border-gray-700">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 dark:text-white"
                          >


                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {currentAssistants.map((aide) => (
                        <tr key={aide._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className='p-4 border-b border-blue-gray-50'>
                            <div className="flex items-center gap-3">
                              <Avatar src={`http://localhost:4000/${aide.user.image.filepath}`} size="sm" />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                  name="nomPrenom"
                                >
                                  {aide.user.nomPrenom}
                                </Typography>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70 dark:text-white"
                                  name="dateAdhesion"
                                >
                                  Ajouté le : {new Date(aide.user.dateAdhesion).toLocaleDateString()}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className='p-4 border-b border-blue-gray-50'>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70 dark:text-white"
                              name="role"
                            >
                              {aide.user.role}
                            </Typography>
                          </td>

                          <td className='p-4 border-b border-blue-gray-50'>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >  {aide.user.telephone}

                            </Typography>
                          </td>

                          <td className='p-4 border-b border-blue-gray-50'><Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {aide.user.email}
                          </Typography></td>
                          <td className='p-4 border-b border-blue-gray-50'><Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {aide.medecin?.user?.nomPrenom}

                          </Typography> </td>
                          <td className='p-4 border-b border-blue-gray-50'>
                            <div className="flex items-center">
                              <Tooltip content="Modifier" className="text-white bg-indigo-500 rounded-md">
                                <IconButton variant="text" className='text-indigo-700' onClick={() => openModal(aide)}>
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Supprimer" className="text-white bg-red-400 rounded-md">
                                <IconButton variant="text" className='text-red-800' onClick={() => DeleteAide(aide._id)}>
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
                  Page {currentPage} of {Math.ceil(filteredAssitants.length / AidePerPage)}
                </Typography>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outlined"
                    size="sm"
                    className='text-gray-500 dark:bg-gray-800'
                    onClick={handlePrevPage}
                    disabled={currentPage === 1} // Désactive le bouton s'il est sur la première page
                  >
                    <FaArrowLeft /> {/* Utilisez l'icône de flèche gauche */}
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    className='text-gray-500 dark:bg-gray-800'
                    onClick={handleNextPage}
                    disabled={indexOfLastAide >= filteredAssitants.length} // Désactive le bouton s'il est sur la dernière page
                  >
                    <FaArrowRight /> {/* Utilisez l'icône de flèche droite */}
                  </Button>
                </div>
              </CardFooter>

            </Card>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
              <div className="dark:bg-gray-900 dark:text-gray-50 text-gray-800 absolute inset-0 bg-black opacity-50"></div>
              <div className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 z-50 bg-white p-6 rounded-lg max-w">
                <div className='  dark:bg-gray-800 dark:text-gray-50 text-gray-800 overflow-hidden'>
                  <h1 className="mb-8  dark:bg-gray-800 dark:text-gray-50 leading-7 text-gray-800 ">Entrer les informations :</h1>
                </div>
                <form onSubmit={UpdateAide}>
                  <div className="flex mb-4">
                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">
                        Cin
                      </label>
                      <input
                        type="text"
                        id="cin"
                        name="cin"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez le nom et prénom"
                        defaultValue={selectedAide.user.cin}
                      />
                    </div>
                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">

                        Nom & Prénom
                      </label>
                      <input
                        type="text"
                        id="nomPrenom"
                        name="nomPrenom"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez votre nouveau nom é prénom"
                        defaultValue={selectedAide.user.nomPrenom}

                      />
                    </div>
                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">

                        Adresse
                      </label>
                      <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez votre nouveau Adresse"
                        defaultValue={selectedAide.user.adresse}

                      />
                    </div>
                  </div>

                  <div className="flex mb-4">


                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez le numéro de téléphone"
                        defaultValue={selectedAide.user.telephone}

                      />
                    </div>
                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">
                        email
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez Votre nouveau email"
                        defaultValue={selectedAide.user.email}

                      />
                    </div>

                    <div className="flex flex-col mr-4">
                      <label htmlFor="name" className="mb-1 text-sm font-medium text-blue-gray-900">

                        education
                      </label>
                      <input
                        type="text"
                        id="education"
                        name="education"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300  focus:outline-none focus:border-blue-500"
                        placeholder="Entrez une description a votre éducation"
                        defaultValue={selectedAide.education}

                      />
                    </div>
                  </div>


                  <div className="flex flex-col mb-4 sm:flex-row sm:justify-between">
                    <div className="flex flex-col mr-4 mb-4 sm:mb-0">
                      <label htmlFor="medecinlie" className="mb-1 text-sm font-medium text-blue-gray-900">
                        Médecin lié
                      </label>
                      <select
                        id="medecinlie"
                        name="medecin"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 mb-1 py-2 border border-blue-gray-300 focus:outline-none focus:border-blue-500"
                        value={selectedMedecinId}
                        onChange={(e) => {
                          const selectedMedecinId = e.target.value;
                          setSelectedMedecinId(selectedMedecinId);
                          setSelectedAide({
                            ...selectedAide,
                            medecinlie: selectedMedecinId
                          });
                        }}
                      >
                        <option value="" disabled>
                          Sélectionnez
                        </option>
                        {medecins.map((medecin) => (
                          <option
                            key={medecin._id}
                            value={medecin._id}
                          >
                            {medecin.user.nomPrenom}
                          </option>
                        ))}
                      </select>


                    </div>
                    <div className="flex flex-col mr-4">
                      <label htmlFor="role" className="mb-1 text-sm font-medium text-blue-gray-900">
                        Poste
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Entrez le nouveau rôle"
                        defaultValue={selectedAide.user.role}
                      />
                    </div>
                    <div className="flex flex-col mr-4">
                      <label htmlFor="role" className="mb-1 text-sm font-medium text-blue-gray-900">
                        Password
                      </label>
                      <input
                        type="password"
                        id="role"
                        name="password"
                        className="dark:bg-gray-800 dark:text-gray-50 text-gray-800 px-3 py-2 border border-blue-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Entrez le nouveau password"
                       // defaultValue={selectedAide.user.password}
                      />
                    </div>
                  </div>



                  <div className="flex justify-end mt-4">
                    <Button onClick={closeModal} size="sm" className=' text-gray-700 bg-gray-200 '>
                      Annuler
                    </Button>
                    <Button type="submit" size="sm" color="indigo" className="ml-2">
                      Modifier
                    </Button>
                  </div>
                </form>


              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ListeAssistant;