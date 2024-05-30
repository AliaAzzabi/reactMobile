import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart01 from '../../charts/LineChart01';
import Icon from '../../images/icon-02.svg';
import EditMenu from '../../components/DropdownEditMenu';
import axios from 'axios';
// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard02() {

  const [globalMedecinsData, setGlobalMedecinsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/global/medecins'); // Endpoint pour récupérer les données
        setGlobalMedecinsData(response.data);
      } catch (error) {
        console.error('Error fetching global medecins data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 02" />
          {/* Menu button */}
          
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Global médecins</h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Statistics</div>
        {globalMedecinsData && (
          <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{globalMedecinsData.total}</div>
            <div className="text-sm font-semibold text-white px-1.5 bg-blue-500 rounded-full">{globalMedecinsData.percentChange}</div>
          </div>
        )}
      </div>
      {/* Chart built with Chart.js 3 */}
    
    </div>
  );
}

export default DashboardCard02;
