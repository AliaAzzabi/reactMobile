import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from './ChartjsConfig';
import { tailwindConfig, formatValue } from '../utils/Utils';

function RealtimeChart({ data, width, height }) {
  const canvasRef = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    if (!data || !data.length) return;

    const ctx = canvasRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => formatDate(entry._id)), 
        datasets: [{
          label: 'Nombre de patients',
          data: data.map(entry => entry.count),
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
        }],
      },
      options: {
        layout: {
          padding: {
            top: 20,
            bottom: 0, // Réduire l'espace en bas
            left: 20,
            right: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        scales: {
          y: {
            ticks: {
              stepSize: 1, 
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}


export default RealtimeChart;
