import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { getRendezVousByPatientId } from '../liaisonfrontback/operation';

function ArchiveRDV() {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null); // Modifier pour initialiser à null
  const [formData, setFormData] = useState({
    PatientNomPrenom: '' // Supprimer l'initialisation ici
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/gePatientById/${patientId}`); // Assurez-vous que votre endpoint est correct
        setPatient(response.data);
        // Mettre à jour formData si nécessaire
        setFormData({
          PatientNomPrenom: response.data.nomPrenom,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des patients :', error.response.data.message);
      }
    };

    fetchPatient();
  }, [patientId]); // Ajouter patientId comme dépendance pour recharger les données du patient lorsque l'ID du patient change

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
  }, [patientId]); // Ajouter patientId comme dépendance pour recharger les rendez-vous lorsque l'ID du patient change

  if (!user || (user.role !== "médecin" && user.role !== "aide")) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className=" w-full overflow-x-scroll grid grid-cols-12 gap-6 my-8 items-start">
            {/* Patient Information */}
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              data-aos-offset="200"
              className="dark:text-gray-200 dark:bg-gray-800 ml-5 col-span-12 lg:col-span-4 bg-white rounded-xl border border-border p-6"
            >
              <div className="gap-2 flex-colo">
                <h2 className="mb-4 text-lg font-semibold text-center"> Patient</h2>
                <p className="mb-4 text-xs font-semibold"> Nom & Prénom : {formData.PatientNomPrenom} </p>
                <p className=" mb-4 text-xs font-semibold">Email : {patient ? patient.email : 'Chargement...'} </p>
                <p className=" mb-4 text-xs font-semibold"> Téléphone : {patient ? patient.telephone : 'Chargement...'} </p>
              </div>
            </div>

            {/* Medical Records */}
            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="100"
              data-aos-offset="200"
              className="dark:text-gray-200 dark:bg-gray-800 mr-5 col-span-12 lg:col-span-8 bg-white rounded-xl border border-border p-6"
            >
              <div className="flex flex-col gap-6">
                <div className="flex-btn gap-4">
                  <h1 className="text-lg sm:block hidden mb-5 font-semibold">Archive des rendez-vous</h1>
                </div>
              </div>

              {appointments.map((appointment) => (
                <div key={appointment._id} className=" mb-4 dark:bg-gray-700 bg-gray-50 items-start grid grid-cols-12 gap-4 rounded-xl border border-border p-6">
                  <div className="col-span-12 md:col-span-3">
                    <p className="text-xs text-textGray font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-12 md:col-span-9 flex flex-col gap-2">
                    <p className="text-xs text-main font-light">
                      <span className="font-medium">Médecin: </span> {appointment.medecin ? appointment.medecin.user.nomPrenom : 'Non spécifié'}
                    </p>
                    <p className="text-xs text-main font-light">
                      <span className="font-medium">Heure: </span> {appointment.time}
                    </p>
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
