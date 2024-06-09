import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { getRendezVousByPatientId } from '../liaisonfrontback/operation';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';


function ArchiveRDV() {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    PatientNomPrenom: ''
  });
  const [showInput, setShowInput] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/gePatientById/${patientId}`);
        setPatient(response.data);
        setFormData({
          PatientNomPrenom: response.data.nomPrenom,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des patients :', error.response.data.message);
      }
    };

    fetchPatient();
  }, [patientId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await getRendezVousByPatientId(patientId);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const toggleInput = (id) => {
    setShowInput((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
    if (id === "note") { // Assuming "note" is the ID for the note input field
      setNoteText(value);
    }
  };

  const handleSaveNote = async (rendezVousId) => {
    try {
      const noteData = {
        text: inputValues[rendezVousId] || '',
      };

      console.log("Note data being sent:", noteData);

      const response = await axios.post(
        `http://localhost:4000/rendezvous/${rendezVousId}/note`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      console.log("Note saved successfully:", response.data);

      // Optionally, update the local state to reflect the new note
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === rendezVousId
            ? { ...appointment, notes: [...appointment.notes, response.data.note] }
            : appointment
        )
      );

      // Hide the input field after saving the note
      setShowInput((prev) => ({ ...prev, [rendezVousId]: false }));
    } catch (error) {
      console.error("Error saving note:", error);
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
          <div className="w-full overflow-x-scroll grid grid-cols-12 gap-6 my-8 items-start">
       
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              data-aos-offset="200"
              className="dark:text-gray-200 dark:bg-gray-800 ml-5 col-span-12 lg:col-span-4 bg-white shadow-xl rounded-xl border border-border p-6"
            >
       
              <div className="gap-2 flex-colo">
                <h2 className="mb-4 text-lg font-semibold text-center"> Patient</h2>
                <p className="mb-4 text-xs font-semibold"> Nom & Prénom : {formData.PatientNomPrenom} </p>
                <p className="mb-4 text-xs font-semibold">Email : {patient ? patient.email : 'Chargement...'} </p>
                <p className="mb-4 text-xs font-semibold"> Téléphone : {patient ? patient.telephone : 'Chargement...'} </p>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="100"
              data-aos-offset="200"
              className="dark:text-gray-200 shadow-xl dark:bg-gray-800 mr-5 col-span-12 lg:col-span-8 bg-white rounded-xl border border-border p-6"
            >
              <div className="flex flex-col gap-6">
                <div className="flex-btn gap-4">
                  <h1 className="text-lg sm:block hidden mb-5 font-semibold">Archive des rendez-vous</h1>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              {appointments.map((appointment) => (
                <div key={appointment._id} className="mb-4 dark:bg-gray-700 bg-gray-50 items-start grid grid-cols-12 gap-4 rounded-xl border border-border p-6">
                  <div className="col-span-12 md:col-span-3">
                    <p className="text-xs text-textGray font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                    <button
                      onClick={() => toggleInput(appointment._id)}
                      className="text-xs font-medium mt-12 ml-7 flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white">
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="col-span-12 md:col-span-9 flex flex-col gap-2">
                    <p className="text-xs text-main font-light">
                      <span className="font-medium">Médecin: </span> {appointment.medecin ? appointment.medecin.user.nomPrenom : 'Non spécifié'}
                    </p>
                    <p className="text-xs text-main font-light">
                      <span className="font-medium">Heure: </span> {appointment.time}
                    </p>
                    <p className="text-xs text-main font-light">
                      <span className="font-medium">Statut: </span> {appointment.status}
                    </p>
                    <hr/>
                    <p className="text-xs text-main font-light text-center">
                      <span className="font-medium ">Les commentaires</span>
                    </p>
                    {appointment.notes && appointment.notes.length > 0 ? (
                      appointment.notes.map((note) => (
                        <div key={note._id} className="text-xs text-main font-light">
                          <span className="font-medium">Note: </span> {note.text} <br/>
                          <span className="font-medium">Ajouter Le: </span>{new Date(note.addedAt).toLocaleDateString()}<br/>
                          <span className="font-medium">Ajouté par: </span>{note.addedBy.nomPrenom}
                        </div>
                      ))
                    ) : (
                      <p key="no-notes" className="text-xs text-main font-light">Aucune note disponible</p>
                    )}
                    {showInput[appointment._id] && (
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Ajouter une note"
                          className="border border-border rounded-l p-2 flex-grow mr-2"
                          value={inputValues[appointment._id] || ''}
                          onChange={(e) => handleInputChange(appointment._id, e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveNote(appointment._id)}
                          className="p-2 bg-green-500 text-white rounded-r"
                        >
                          Enregistrer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ArchiveRDV;