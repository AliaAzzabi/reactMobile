import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { getAllRendezVousAjourdhui } from '../liaisonfrontback/operation'; 
import { Link } from 'react-router-dom';

function Salle() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [rendezVousAujourdhui, setRendezVousAujourdhui] = useState([]);

  if (!user || (user.role !== 'médecin' && user.role !== 'aide')) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const rendezVous = await getAllRendezVousAjourdhui();
        console.log('Rendez-vous from API:', rendezVous); 
        setRendezVousAujourdhui(rendezVous);
      } catch (error) {
        console.error('Error fetching rendez-vous:', error);
      }
    };

    fetchRendezVous();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <WelcomeBanner />
            <div className="  flex items-center mr-8 mb-8 justify-between gap-8">
            
             
              <select >
  {rendezVousAujourdhui.map(rendezVous => (
    <option  key={rendezVous.id} value={rendezVous.id}>
      {rendezVous.patient.nomPrenom}
    </option>
  ))}
</select>
<div className="flex flex-col gap-2 sm:flex-row ">
                    <Link to="" className="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center">
                      <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="hidden xs:block ml-2">Ajouter un Patient</span>
                    </Link>
                  </div>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th></th>
                    <th scope="col" className="px-6 py-3 pb-5 pt-5">
                      Nom du patient
                    </th>
                    
                    <th scope="col" className="px-6 py-3 pb-5 pt-5"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={`checkbox-table-search`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>

                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    
                  </tr>
                </tbody>
                
              </table>
             
            </div>
            <div className="flex justify-end mt-4">
                <button className="btn bg-red-500 hover:bg-red-600 text-white">
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 3h8a2 2 0 0 1 2 2v1h3a1 1 0 0 1 0 2h-.1l-1.574 13.144A3 3 0 0 1 17.433 22H6.567a3 3 0 0 1-2.993-2.856L2.1 8H2a1 1 0 0 1 0-2h3V5a2 2 0 0 1 2-2zM4.52 8l.927 11.848A1 1 0 0 0 6.429 20h11.142a1 1 0 0 0 .981-1.152L19.48 8H4.52z" />
                  </svg>
                  <span className="hidden xs:block ml-2">
                    Supprimer le patient sélectionné
                  </span>
                </button>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Salle;
