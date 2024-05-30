import React, { useState,useContext } from 'react';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import WelcomeBanner from '../../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../../partials/dashboard/DashboardAvatars';
import FilterButton from '../../components/DropdownFilter';
import Datepicker from '../../components/Datepicker';
import DashboardCard01 from '../../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../../partials/dashboard/DashboardCard04';

import Banner from '../../partials/Banner';
import CalendarComponent from '../../components/CalenderComponent';
function DashboardAide() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  if (!user || ( user.role !== "aide")) {
    return <Navigate to="/login" />;
  }
    
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
           

            

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
            <DashboardCard01 />
              {/* Line chart (Acme Advanced) */}
              <DashboardCard02 />
              {/* Line chart (Acme Professional) */}
              <DashboardCard03 />
             
             
              
            </div>
            <div className="grid grid-cols-1 mt-8">

 <DashboardCard04 />
</div>
          </div>
        </main>


      </div>
    </div>
  );
}

export default DashboardAide;