import React, { useEffect,useState } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import DashboardMedecin from './pages/medecin/DashboardMedecin';
import DashboardAide from './pages/aide/DashboardAid';
import ArchiveRDV from './pages/archiveRDVpattient';
import Medecin from './pages/medecin/medecin';
import ListePatient from './pages/ListePatient';
import Salle from './pages/salle';
import ListeAssistant from './pages/ListeAssistants';
import AddPatient from './pages/AddPatient';
import AddSpecialte from './pages/addSpecialté';
import ListeSpecialite from './pages/ListeSpecialte';
import Calendar from './pages/Calendar';
 import AddAssistant from './pages/addAssistant';
 import AddMedecin from './pages/addMedecin';
 import ListeMedecin from './pages/ListeMedecin';
 import Profile from './pages/Profile';
 import Login from './pages/login';
 import ListeDepartement from './pages/ListeDepartement';
 import AddDepartement from './pages/AddDepartemnt';
 import AddRendezVousForm from './pages/addRendezVous';
 import ListeAideParMed from './pages/ListeAideParMed';
 import AddAssistantMed from './pages/AddAssistantMed';
 import Historique from './pages/historique';
import DemandeRDV from './pages/demandeRDV';
import DashboardCard13 from './partials/dashboard/DashboardCard13';
function App() {


  return (
    <>


      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/dash-Medecin" element={<DashboardMedecin />} />
        <Route exact path="/dash-Aide" element={<DashboardAide />} />

        <Route exact path="/medecin" element={<Medecin />} />
        <Route exact path="/listePatient" element={<ListePatient />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/salleDattente" element={<Salle />} />
        <Route exact path="/listeAssistant" element={<ListeAssistant />} />
        <Route exact path="/addAssistant" element={<AddAssistant />} />

        <Route exact path="/listeMedecin" element={<ListeMedecin />} />
        <Route exact path="/addMedecin" element={<AddMedecin />} />
        <Route exact path="/profile" element={<Profile />} />

        <Route exact path="/addPatient" element={<AddPatient />} />
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/login" element={<Login />} />

        <Route exact path="/addSpecialte" element={<AddSpecialte />} />
        <Route exact path="/listeSpecialite" element={<ListeSpecialite />} />

        <Route exact path="/addDepartement" element={<AddDepartement />} />
        <Route exact path="/listeDepartement" element={<ListeDepartement />} />
        <Route exact path="/dashi" element={<DashboardCard13 />} />
        <Route exact path="/addrdv" element={<AddRendezVousForm/>} />
        
        <Route exact path="/listeAideParMed" element={<ListeAideParMed/>} />
        <Route exact path="/addAssistantMed/:medecinId" element={<AddAssistantMed/>} />
        <Route exact path="/historique" element={<Historique/>} />
        <Route exact path="/patients/:patientId/rendezvous" element={<ArchiveRDV/>} />
        <Route exact path="/demandeRDV" element={<DemandeRDV/>} />
      </Routes>
    </>
  );
}

export default App;
