import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import WelcomeBanner from '../../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../../partials/dashboard/DashboardAvatars';
import FilterButton from '../../components/DropdownFilter';
import Datepicker from '../../components/Datepicker';
import DashboardCard01 from '../../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../../partials/dashboard/DashboardCard03';
import { Link } from 'react-router-dom';
import person1Image from './images/person_1.jpg';
import person2Image from './images/person_2.jpg';
import person3Image from './images/person_3.jpg';
import person4Image from './images/person_4.jpg';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import PersonRemoveTwoToneIcon from '@mui/icons-material/PersonRemoveTwoTone';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { EditTwoTone, PersonRemoveTwoTone } from '@mui/icons-material';

function Medecin() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                        {/* Welcome banner */}


                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">

                            {/* Left: Avatars */}
                            <DashboardAvatars />

                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                {/* Filter button */}
                                <FilterButton />
                                {/* Datepicker built with flatpickr */}
                                <Datepicker />
                                {/* Add view button */}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Add view</span>
                                </button>
                            </div>

                        </div>

                        {/* Cards */}
                        <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom & Prénom</th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'adhésion</th>
        <th className="px-6 py-3 bg-gray-50"></th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {/* Table rows */}
      <tr className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src={person1Image} alt="" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">Dr. Mark Otto</div>
              <div className="text-sm text-gray-500">Ajouté le : 01/03/2020</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologie</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologue</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">1234567890</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">markotto@email.com</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">01/03/2020</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:w-1/6 lg:w-1/5">
          <Link to="/modifMedecin" className="text-indigo-600 hover:text-indigo-900 mr-2">
            <EditTwoTone />
          </Link>
          <button className="text-red-600 hover:text-red-900">
            <PersonRemoveTwoTone />
          </button>
        </td>
      </tr>
      {/* Autres lignes de tableau */}
       {/* Table rows */}
       <tr className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src={person2Image} alt="" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">Dr. Mark Otto</div>
              <div className="text-sm text-gray-500">Ajouté le : 01/03/2020</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologie</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologue</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">1234567890</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">markotto@email.com</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">01/03/2020</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:w-1/6 lg:w-1/5">
          <Link to="/modifMedecin" className="text-indigo-600 hover:text-indigo-900 mr-2">
            <EditTwoTone />
          </Link>
          <button className="text-red-600 hover:text-red-900">
            <PersonRemoveTwoTone />
          </button>
        </td>
      </tr>
       {/* Table rows */}
       <tr className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src={person4Image} alt="" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">Dr. Mark Otto</div>
              <div className="text-sm text-gray-500">Ajouté le : 01/03/2020</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologie</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologue</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">1234567890</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">markotto@email.com</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">01/03/2020</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:w-1/6 lg:w-1/5">
          <Link to="/modifMedecin" className="text-indigo-600 hover:text-indigo-900 mr-2">
            <EditTwoTone />
          </Link>
          <button className="text-red-600 hover:text-red-900">
            <PersonRemoveTwoTone />
          </button>
        </td>
      </tr>
       {/* Table rows */}
       <tr className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img className="h-10 w-10 rounded-full" src={person3Image} alt="" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">Dr. Mark Otto</div>
              <div className="text-sm text-gray-500">Ajouté le : 01/03/2020</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologie</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">Gynécologue</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">1234567890</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">markotto@email.com</td>
        <td className="px-6 py-4 whitespace-nowrap md:w-1/6 lg:w-1/5">01/03/2020</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:w-1/6 lg:w-1/5">
          <Link to="/modifMedecin" className="text-indigo-600 hover:text-indigo-900 mr-2">
            <EditTwoTone />
          </Link>
          <button className="text-red-600 hover:text-red-900">
            <PersonRemoveTwoTone />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
 
  
</div> 
<nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div className="flex-1 flex justify-between sm:hidden">
      <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700 mr-2" onClick={() => console.log('Previous page')}>Previous</button>
      <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700" onClick={() => console.log('Next page')}>Next</button>
    </div>
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing
          <span className="font-medium"> 1 </span>
          to
          <span className="font-medium"> 10 </span>
          of
          <span className="font-medium"> 97 </span>
          results
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700" onClick={() => console.log('Previous page')}>Previous</button>
          <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700">1</button>
          <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700">2</button>
          <span className="relative z-0 inline-flex rounded-md shadow-sm">
            <span className="btn btn-sm bg-gray-200 text-gray-700">...</span>
          </span>
          <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700">8</button>
          <button className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-gray-700" onClick={() => console.log('Next page')}>Next</button>
        </nav>
      </div>
    </div>
  </nav>
<br></br>
<div className="flex flex-col">
  <h3 className="text-lg font-semibold">Gestion de l'attribution des autorisations</h3>
  <div className="mt-4">
    <select className="form-select input-height w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
      <option value="">Sélectionnez...</option>
      <option value="Ajout">Ajout</option>
      <option value="Modification">Modification</option>
      <option value="Suppression">Suppression</option>
      <option value="Consultation">Consultation</option>
      <option value="Toutes">Ajout, Modification, Suppression, Consultation</option>
    </select>
  </div>
  <div className="mt-4">
  <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full">Enregistrer</button>
</div>
</div>

                    </div>
                    
                </main>



            </div>
            
        </div>
        
    );
}

export default Medecin;
