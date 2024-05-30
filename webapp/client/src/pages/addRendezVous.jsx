import React, { useState, useContext, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../context/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllRendezVous, addPatient, getPatient, deleteRendezVous, updateRendezVous, creerRendezVous } from '../liaisonfrontback/operation';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { useLocation } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { sendEmail } from '../liaisonfrontback/operation';
import { sendSMS } from '../liaisonfrontback/operation';
import 'react-toastify/dist/ReactToastify.css';

function AddRendezVousForm() {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const localizer = momentLocalizer(moment);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientNom, setPatientNom] = useState('');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation();

  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showForm1, setShowForm1] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const toggleForm1 = () => {
    setShowForm1(!showForm1);
    setShowForm2(false);
  };

  const toggleForm2 = () => {
    setShowForm2(!showForm2);
    setShowForm1(false);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  if (!user || (user.role !== "médecin" && user.role !== "aide")) {
    return <Navigate to="/login" />;
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const openFormModal = () => {
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setPatientNom(event.title.trim());
    setSelectedDate(event.start);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchRendezVousData = async () => {
    try {
      const data = await getAllRendezVous(user.token);
      setEvents(
        data.map((rendezvous) => ({
          id: rendezvous._id,
          start: new Date(rendezvous.date),
          end: new Date(rendezvous.date),
          title: rendezvous.patient ? ' ' + rendezvous.patient.nomPrenom : 'Rendez-vous',
          email: rendezvous.patient ? rendezvous.patient.email : '',
          notifier: rendezvous.patient ? rendezvous.patient.notifier : '',
          telephone:rendezvous.patient ? rendezvous.patient.telephone : '',

        }))
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous :", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {


      const updatedEventData = {
        patientNom,
        date: selectedDate,
        time: selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
  
      await updateRendezVous(user.token, selectedEvent.id, updatedEventData);
      toast.success('Rendez-vous mis à jour avec succès !');
      const formattedDate = selectedDate.toDateString();
  
      if (selectedEvent.notifier.includes('sms')) {
        // Envoyer un SMS au numéro de téléphone du patient
        const smsMessage = `Bonjour ${selectedEvent.title}, votre rendez-vous a été réorganisé au ${formattedDate} à ${updatedEventData.time}.`;
        const patientPhoneNumber = selectedEvent.telephone; // Récupérer le numéro de téléphone du patient
        //console.log(patientPhoneNumber);
        await sendSMS(patientPhoneNumber, smsMessage);      }
  
      if (selectedEvent.notifier.includes('email')) {
        // Envoyer un e-mail
        const emailSubject = 'Votre rendez-vous a été mis à jour :';
        const emailBody = `Bonjour ${selectedEvent.title},<br><br>Votre rendez-vous a été réorganisé au ${formattedDate} à ${updatedEventData.time}.`;
        await sendEmail({ to: selectedEvent.email, subject: emailSubject, text: emailBody });
      }

      setShowModal(false);
      fetchRendezVousData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rendez-vous : " + error.message);
    }
  };
  

  const handleCancelAppointment = async () => {
    setIsLoading(true); // Start loading
    try {
      // Supprimer le rendez-vous
      await deleteRendezVous(user.token, selectedEvent.id);
      toast.success('Rendez-vous annulé avec succès !');
      
      fetchRendezVousData();

       // Envoyer un SMS si le rendez-vous était notifié par SMS
       if (selectedEvent.notifier.includes('sms')) {
        const smsMessage = `Bonjour ${selectedEvent.title}, votre rendez-vous a été annulé.`;
        const patientPhoneNumber = selectedEvent.telephone;
        await sendSMS(patientPhoneNumber, smsMessage);
      }
  
      // Envoyer un e-mail
      if (selectedEvent.notifier.includes('email')) {
        const emailSubject = 'Annulation de votre rendez-vous :';
        const emailBody = `Bonjour ${selectedEvent.title},<br><br>Votre rendez-vous a été annulé.`;
        await sendEmail({ to: selectedEvent.email, subject: emailSubject, text: emailBody });
      }

      setShowModal(false);
    } catch (error) {
      toast.error("Erreur lors de l'annulation du rendez-vous : " + error.message);
    } finally {
      setIsLoading(false); // End loading
    }
  };
  
  const handleChange = (e) => {
    setPatientNom(e.target.value);
  };

  const maxARdvParJour = 18;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientNom || !selectedDate) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const rdvexiste = events.find(event => moment(event.start).isSame(selectedDate, 'minute'));
    if (rdvexiste) {
      toast.error('Un rendez-vous existe déjà à cette heure.');
      return;
    }
    const rdvExiste = events.find(event => event.title.trim() === patientNom && moment(event.start).isSame(selectedDate, 'day'));
    if (rdvExiste) {
      toast.error('Un rendez-vous existe déjà pour ce patient à cette date.');
      return;
    }
    // Trouver tous les rendez-vous pour le jour sélectionné
    const rdvJourSelectionne = events.filter(event =>
      moment(event.start).isSame(selectedDate, 'day')
    );
    if (rdvJourSelectionne.length < maxARdvParJour) {
     // Ajouter le nouveau rendez-vous normalement
    try {
      await creerRendezVous(user.token, selectedDate, patientNom);
      toast.success('Rendez-vous ajouté avec succès !');
      setSelectedDate(new Date());
      setPatientNom('');
      setEvents([...events, { start: selectedDate, end: selectedDate, title: patientNom }]);
      setShowFormModal(false);
      window.location.reload(); 
    } catch (error) {
      toast.error("Erreur lors de l'ajout du rendez-vous");
    }
  } else {
    // Afficher un message d'alerte si le nombre maximal est dépassé
    toast.error(`Le nombre maximal de rendez-vous (${maxARdvParJour}) pour cette journée est déjà atteint.`);
  }
};

  const fetchPatients = async () => {
    try {
      const patientsData = await getPatient();
      setPatients(patientsData);
      setAllPatients(patientsData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchRendezVousData();
    fetchPatients();
  }, [user.token]);

  const handleSubmitAjout = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPatient = Object.fromEntries(formData);
    newPatient.dateNaissance = dateNaissance;

    if (!newPatient.nomPrenom || !newPatient.cin || !newPatient.telephone || !newPatient.dateNaissance || !newPatient.sexe) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      addPatient(newPatient, (response) => {
        if (response.error) {
          toast.error(response.error);
          setSuccessMessage('');
        } else {
          setPatients([...patients, response]);
          toast.success('patient ajouté avec succès !');
          setErrorMessage('');

          setPatientNom(response.nomPrenom);
          setShowForm1(false);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Une erreur s\'est produite lors de l\'ajout du patient.');
      setSuccessMessage('');
    }
  };



  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />
            <div className="dark:bg-gray-50 shadow-md p-8 pb-8 h-screen rounded-lg py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 overflow-y-auto">
              <div className="flex flex-col gap-2 sm:flex-row  ">
                <button onClick={openFormModal} className="btn bg-indigo-500 m-8 hover:bg-indigo-600 text-white flex items-center">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Ajouter un Rendez-Vous</span>
                </button>
              </div>
              {showFormModal && (
                <div className=" overflow-y-auto h-full w-full p-8 fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="overflow-y-auto  dark:bg-gray-900 h-full w-full  overflow-x-hidden relative bg-white rounded-lg max-w-xl ">
                    <button onClick={closeFormModal} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                    <div className="p-6 ">
                      <button className="btn bg-indigo-500  hover:bg-indigo-600 text-white flex items-center" onClick={toggleForm1}>
                        <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="hidden xs:block ml-2">Nouveau patient</span></button>
                      {showForm1 && (
                        <div className="dark:bg-gray-800 mt-4 p-4 border border-gray-300 rounded">
                          <h2 className="text-lg font-bold mb-2 dark:text-gray-300">Ajouter un patient</h2>
                          <form onSubmit={handleSubmitAjout}>
                            <div className=" grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label htmlFor="nomPrenom" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">Nom & Prénom *</label>
                                <div className="mt-2">
                                  <input type="text" name="nomPrenom" id="nomPrenom" autoComplete="nomPrenom" className="dark:bg-gray-800 mb-2 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                              </div>
                              <div className="sm:col-span-3">
                                <label htmlFor="cin" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">CIN *</label>
                                <div className="mt-2">
                                  <input type="text" name="cin" id="cin" autoComplete="cin" className="mb-2 dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                              </div>
                            </div>
                            <div className=" grid grid-cols-1 gap-x-6  sm:grid-cols-6">

                              <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">Email</label>
                                <div className="mt-2">
                                  <input id="email" name="email" type="email" autoComplete="email" className="mb-2 dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                              </div>
                              <div className=" sm:col-span-3">
                                <label htmlFor="telephone" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">Numéro de téléphone *</label>
                                <div className="mt-2">
                                  <input type="tel" placeholder=" +216 25 222 555" maxLength="12" name="telephone" id="telephone" autoComplete="telephone" className="mb-2 dark:bg-gray-800 text-gray-900 block w-full rounded-md border-0 py-1.5 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="dateNaissance" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">Date de naissance *</label>
                              <div className="mt-2">
                                <DatePicker
                                  selected={dateNaissance}
                                  onChange={date => setDateNaissance(date)}

                                  dateFormat="dd/MM/yyyy"
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={60}
                                  
                                  className="mb-2 dark:bg-gray-800 dark:text-gray-300 text-gray-600 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3 border-b border-gray-900/10 pb-5 dark:border-gray-500">
                              <legend className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300">Sexe *</legend>
                              <div className="mt-4 flex gap-x-4">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="homme"
                                    name="sexe"
                                    value="homme"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                  />
                                  <label htmlFor="homme" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">Homme</label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    id="femme"
                                    name="sexe"
                                    value="femme"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                  />
                                  <label htmlFor="femme" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">Femme</label>
                                </div>
                              </div>
                            </div>
                            <div className=" mt-2 border-b border-gray-900/10 pb-5 dark:border-gray-500">
                              <fieldset>
                                <legend className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-50 ">Notifications</legend>

                                <div className="mt-6 space-y-6 ">
                                  <div className="relative flex gap-x-3 ">
                                    <input id="email" name="notifier" type="checkbox" value="email" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">Par Email</label>
                                  </div>
                                  <div className="relative flex gap-x-3">
                                    <input id="sms" name="notifier" type="checkbox" value="sms" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                    <label htmlFor="sms" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">Par SMS</label>
                                  </div>
                                  <div className="relative flex gap-x-3">
                                    <input id="appel" name="notifier" type="checkbox" value="appel" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 " />
                                    <label htmlFor="appel" className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">Appel téléphonique</label>
                                  </div>
                                </div>
                              </fieldset>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-x-6">

                              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >Ajouter</button>


                            </div>



                          </form>

                        </div>

                      )}

                      <div className=" dark:bg-gray-800  mt-4 p-4 border border-gray-300 rounded">
                        <h2 className="text-lg font-bold mb-2 dark:text-gray-300 ">Ajouter un rendez-vous</h2>
                        <form onSubmit={handleSubmit}>
                          <div className="mb-4">
                            <label className="  block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300" htmlFor="patientNom">
                              Nom du patient
                            </label>
                            <select
                              id="patientNom"
                              name="patientNom"
                              value={patientNom}
                              onChange={handleChange}
                              className=" dark:text-gray-300 w-full bg-gray-100 rounded-md border-transparent dark:bg-gray-700 focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                            >
                              <option value="">Sélectionnez un patient</option>
                              {patients.map((patient) => (
                                <option key={patient._id} value={patient.nomPrenom}>
                                  {patient.nomPrenom}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-300" htmlFor="nouvelleDate">
                              Nouvelle date du rendez-vous
                            </label>
                            <DatePicker
                              selected={selectedDate}
                              onChange={handleDateChange}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={30}
                              timeCaption="Heure"
                              dateFormat="yyyy-MM-dd HH:mm"
                              minTime={new Date().setHours(8, 0, 0)} // Heure minimale (8:00)
                              maxTime={new Date().setHours(17, 0, 0)} // Heure maximale (17:00)
                             
                              className=" dark:text-gray-300 dark:bg-gray-700 w-full bg-gray-100 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                            />
                          </div>
                          <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">
                              Ajouter
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                  </div>
                </div>

              )}

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultDate={new Date()}
                defaultView="day"
                onSelectSlot={(slotInfo) => handleDateChange(slotInfo.start)}
                onSelectEvent={(event) => handleEventClick(event)}
                selectable
                formats={{
                  eventTimeRangeFormat: ({ start }) => moment(start).format('HH:mm'),
                }}
                messages={{
                  next: "Suivant",
                  previous: "Précédent",
                  today: "Aujourd'hui",
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour",
                }}
                min={new Date(new Date().setHours(8, 0, 0))}
                max={new Date(new Date().setHours(17, 0, 0))}
                step={30}
                timeslots={1}
                className='dark:bg-gray-50 pt-6 rounded-lg pb-6 p-9'
              />

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="relative bg-white rounded-lg max-w-md w-full">
                    <button onClick={closeModal} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-2">Modifier le Rendez-vous</h2>
                      <form onSubmit={handleUpdate} >
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientNom">
                            Nom du patient
                          </label>
                          <input
                            id="patientNom"
                            type="text"
                            name="patientNom"
                            value={patientNom}
                            onChange={handleChange}
                            className="w-full bg-gray-100 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nouvelleDate">
                            Nouvelle date du rendez-vous
                          </label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                           
                            timeCaption="Heure"
                            dateFormat="yyyy-MM-dd HH:mm"
                            minTime={new Date().setHours(8, 0, 0)} // Heure minimale (8:00)
                            maxTime={new Date().setHours(17, 0, 0)} // Heure maximale (17:00)
                            timeIntervals={30}
                            className="w-full bg-gray-100 rounded-md border-transparent focus:border-gray-500 focus:bg-gray-50 focus:ring-0"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Modifier
                          </button>
                          <button type="button" className="btn bg-red-500 hover:bg-red-600 text-white" onClick={handleCancelAppointment} disabled={isLoading}>
                            {isLoading ? 'Annulation...' : 'Annuler le rendez-vous'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddRendezVousForm;