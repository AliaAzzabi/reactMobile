import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RealtimeChart from '../../charts/RealtimeChart';
import Icon from '../../images/icon-02.svg';


function DashboardCard05() {
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/patient/statistics');
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient statistics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
      <img src={Icon} width="32" height="32" alt="Icon 02" />
        
        <h2 className="ml-5 font-semibold text-slate-800 dark:text-slate-100">Nombre de patients par jour</h2>
      </header>
      <RealtimeChart data={patientData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
