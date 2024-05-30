import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart01 from '../../charts/LineChart01';
import Icon from '../../images/icon-03.svg';
import EditMenu from '../../components/DropdownEditMenu';
import axios from 'axios';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard03() {

  const [globalAidesData, setGlobalAidesData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/global/assistants'); // Endpoint pour récupérer les données
        setGlobalAidesData(response.data);
      } catch (error) {
        console.error('Error fetching global Aides data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 03" />
          {/* Menu button */}
        
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Global Assistants</h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Statistics</div>
        {globalAidesData && (
          <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{globalAidesData.total}</div>
            <div className="text-sm font-semibold text-white px-1.5 bg-orange-500 rounded-full">{globalAidesData.percentChange}</div>
          </div>
        )}
      </div>
        {/* Chart built with Chart.js 3 */}
        <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height 
        {globalAidesData && <LineChart01 data={globalAidesData.chartData} width={389} height={128} />}*/}
      </div>
    </div>
  );
}

export default DashboardCard03;
