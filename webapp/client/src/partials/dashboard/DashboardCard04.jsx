// DashboardCard04.js
import React, { useEffect, useState } from 'react';
import BarChart01 from '../../charts/BarChart01'; // Assurez-vous d'importer le bon composant
import axios from 'axios';
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard04() {
  const [patientStatistics, setPatientStatistics] = useState([]);

  useEffect(() => {
    // Fetch patient statistics data
    const fetchPatientStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/patient/statistics'); // Remplacez l'URL par votre endpoint backend
        setPatientStatistics(response.data);
      } catch (error) {
        console.error('Error fetching patient statistics:', error);
      }
    };

    fetchPatientStatistics();
  }, []);

  const chartData = {
    labels: patientStatistics.map(stat => {
      // Transformez l'ID du mois en nom du mois (optionnel, pour une meilleure lisibilité)
      const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      return monthNames[stat._id - 1]; // Les mois sont indexés à partir de 1 dans la base de données
    }),
    datasets: [
      {
        label: 'maximale d\'affluence',
        data: patientStatistics.map(stat => stat.count),
        backgroundColor: tailwindConfig().theme.colors.blue[400],
        hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
    
      },
      
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Statistiques mensuelles du nombre de patients</h2>
      </header>
      {patientStatistics.length > 0 && (
        <BarChart01 data={chartData} width={600} height={400} />
      )}
    </div>
  );
}

export default DashboardCard04;
