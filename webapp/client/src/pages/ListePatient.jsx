import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { Link } from 'react-router-dom';
import { PencilIcon, CalendarIcon, TrashIcon } from '@heroicons/react/outline';
import { getPatient, deletePatient, updatePatient } from '../liaisonfrontback/operation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

function ListePatient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [formData, setFormData] = useState({
    cin: '',
    nomPrenom: '',
    telephone: '',
    dateNaissance: '',
    email: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getPatient();
        setPatients(patientsData);
        setAllPatients(patientsData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPatients();
  }, []);
  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    if (successMessage) {
        toast.success(successMessage); 
        localStorage.removeItem('successMessage'); 
    }
}, []);

  if (!user || (user.role !== "médecin" && user.role !== "aide")) {
    return <Navigate to="/login" />;
  }

  const handleDeletePatient = (id) => {
    Swal.fire({
      title: "Voulez-vous vraiment supprimer ce patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        deletePatient(id, (res) => {
          if (res.data) {
            setPatients(patients.filter(patient => patient._id !== id));
            Swal.fire({
              title: "Supprimé!",
              text: "Patient supprimé avec succès.",
              icon: "success"
            });
          } else {
            Swal.fire({
              title: "Erreur!",
              text: "Erreur lors de la suppression du patient :" + res.error,
              icon: "error"
            });
          }
        });
      }
    });
  };
  

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      cin: patient.cin,
      nomPrenom: patient.nomPrenom,
      telephone: patient.telephone,
      email: patient.email,
      dateNaissance: patient.dateNaissance ? new Date(patient.dateNaissance) : null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dateNaissance: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      nomPrenom: formData.nomPrenom,
      telephone: formData.telephone,
      dateNaissance: formData.dateNaissance,
      email: formData.email,
      cin: formData.cin,
    };
    updatePatient(selectedPatient._id, updatedData, (message) => {
      console.log(message);
      setPatients(patients.map(patient =>
        patient._id === selectedPatient._id ? { ...patient, ...updatedData } : patient
      ));
    });
    closeModal();
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredPatients = allPatients.filter(patient =>
      patient.nomPrenom.toLowerCase().includes(searchTerm)
    );
    setPatients(filteredPatients);
  };



  const totalPages = Math.ceil(patients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />
            <Card className="h-full w-full dark:bg-gray-800">
              <CardHeader floated={false} shadow={false} className=" dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-none">
                <div className=" mb-5 ml-10 flex items-center mr-8 justify-between gap-8">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Liste des Patients
                    </Typography>
                  </div>
                </div>
                <div className="  flex items-center mr-8 justify-between gap-8">


                  <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 ml-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="text" placeholder="Chercher" onChange={handleSearch} id="table-search-users" className="block p-2 ps-10 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ml-8 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row ">
                    <Link to="/addPatient" className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center">
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Ajouter un Patient</span>
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
                            CIN
                          </Typography>
                        </th>
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
                            Date de naissance
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

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPatients
                        .filter(patient =>
                          patient.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((patient) => (
                          <tr key={patient._id}>
                            <td className='p-4 border-b border-blue-gray-50'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {patient.cin}
                              </Typography>
                            </td>
                            <td className='p-4 border-b border-blue-gray-50'>
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {patient.nomPrenom}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70 dark:text-white"
                                  >
                                    Ajouté le : {new Date(patient.createdAt).toLocaleDateString()}
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
                                {new Date(patient.dateNaissance).toLocaleDateString()}
                              </Typography>
                            </td>
                            <td className='p-4 border-b border-blue-gray-50'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {patient.telephone}
                              </Typography>
                            </td>

                            <td className='p-4 border-b border-blue-gray-50'>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {patient.email}
                              </Typography>
                            </td>

                            <td className='p-4 border-b border-blue-gray-50'>
                              <div className="flex items-center">
                                <Tooltip content="Modifier" className="text-white bg-indigo-500 rounded-md">
                                  <IconButton variant="text" className='text-indigo-700' onClick={() => openModal(patient)}>
                                    <PencilIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="Supprimer" className="text-white bg-red-400 rounded-md">
                                  <IconButton variant="text" className='text-red-800' onClick={() => handleDeletePatient(patient._id)}>
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Link to={`/patients/${patient._id}/rendezvous`}>
                                  <Tooltip content="Rendez-vous" className="text-white bg-green-400 rounded-md">
                                    <IconButton variant="text" className='text-green-800'>
                                      <CalendarIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                </Link>

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
          {isModalOpen && (

            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
              <div onClick={closeModal} className="dark:bg-gray-900 overflow-y-auto dark:text-gray-50 text-gray-800 absolute inset-0 bg-black opacity-50"></div>
              <div className="dark:bg-gray-800 overflow-y-autodark:text-gray-50 text-gray-800 z-50 bg-white p-6 rounded-lg max-w">
                <div className="flex justify-end">
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className='  dark:bg-gray-800 overflow-y-auto dark:text-gray-50 text-gray-800 overflow-hidden'>

                  <h1 className="mb-8  dark:bg-gray-800 overflow-y-autodark:text-gray-50 leading-7 text-gray-800 ">Entrer les informations :</h1>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6 mt-4">
                    <div className="space-y-1">
                      <label htmlFor="cin" className="text-gray-500 dark:text-gray-300">
                        CIN
                      </label>
                      <input
                        id="cin"
                        type="text"
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="nomPrenom" className="text-gray-500 dark:text-gray-300">
                        Nom & Prénom
                      </label>
                      <input
                        id="nomPrenom"
                        type="text"
                        name="nomPrenom"
                        value={formData.nomPrenom}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="telephone" className="text-gray-500 dark:text-gray-300">
                        Téléphone
                      </label>
                      <input
                        id="telephone"
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-gray-500 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="dateNaissance" className="text-gray-500 dark:text-gray-300">
                        Date de naissance
                      </label> <br></br>
                      <DatePicker
                        id="dateNaissance"
                        selected={formData.dateNaissance}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full bg-gray-100 dark:bg-gray-700 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-2">

                      <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-6 rounded-md hover:bg-indigo-600 transition-colors"
                      >
                        Sauvegarder
                      </button>
                    </div>
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

export default ListePatient;
