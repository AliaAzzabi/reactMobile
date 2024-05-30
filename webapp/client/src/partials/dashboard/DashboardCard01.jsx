import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart01 from '../../charts/LineChart01';
import Icon from '../../images/icon-01.svg';

function DashboardCard01() {
  const [globalPatientsData, setGlobalPatientsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/global/patients'); // Endpoint pour récupérer les données
        setGlobalPatientsData(response.data);
      } catch (error) {
        console.error('Error fetching global patients data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 01" />
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Patients au Total</h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Statistics</div>
        {globalPatientsData && (
          <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{globalPatientsData.total}</div>
            <div className="text-sm font-semibold text-white px-1.5 bg-green-500 rounded-full">{globalPatientsData.percentChange}</div>
          </div>
        )}
      </div>
        {/* Chart built with Chart.js 3 */}
        <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height 
        {globalPatientsData && <LineChart01 data={globalPatientsData.chartData} width={389} height={128} />}*/}
      </div>
    </div>
  );
}

export default DashboardCard01;
