import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import SidebarLinkGroup from './SidebarLinkGroup';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useContext(AuthContext);
  const userRole = user ? user.role : null;

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const userNom = user ? user.nomPrenom : '';
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

 
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <div className="flex items-center">
            <NavLink end to="/" className="block">
            <img src="/logo.png" alt="Logo" width="60" height="50" />


            </NavLink>
            <span className={`text-white font-bold ml-2 text-lg animate-text ${sidebarExpanded ? 'block' : 'hidden'}`}>SantéPlus</span>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          {user && userRole === "admin" && (
            <div>
              <div>
                <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
                  <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                    •••
                  </span>
                  <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Admin</span>
                </h3>
                <ul className="mt-3">
                  {/* Dashboard */}
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('inbox') && 'bg-slate-900'}`}>
                    <NavLink
                      end
                      to="/"
                      className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('inbox') ? 'hover:text-slate-200' : 'hover:text-white'
                        }`}
                    >
                      <div className="flex items-center">
                        <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'}`} d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                          <path className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'}`} d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                          <path className={`fill-current ${pathname === '/' || pathname.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'}`} d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </div>

              <h3 className="text-xs uppercase text-slate-500 font-semibold mt-7 mb-7 pl-3">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                  •••
                </span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Gestion Globale</span>
              </h3>
              <ul className="mt-3">


                <di>
                  {/**medecin */}
                  <SidebarLinkGroup >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block  text-slate-200 truncate transition duration-150' 
}`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faUserMd} className={`shrink-0 h-6 w-6 ${pathname.includes('community') ? 'text-indigo-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Médecins
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/listeMedecin"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Liste des médecins
                                  </span>
                                </NavLink>
                              </li>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/addMedecin"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Ajouter médecin
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>

                  {/**assistant */}

                  <SidebarLinkGroup activecondition={pathname.includes('community')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block  text-slate-200 truncate transition duration-150 ${pathname.includes('community') ? 'hover:text-slate-200' : 'hover:text-white'
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faUsers} className={`shrink-0 h-6 w-6 ${pathname.includes('community') ? 'text-indigo-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Assistants
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/listeAssistant"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Liste des assistants
                                  </span>
                                </NavLink>
                              </li>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/addAssistant"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Ajouter un assistant
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/**patient */}
                  </di>

              </ul>

              {/* More group */}
              <div >{/** 
                <h3 className="text-xs uppercase text-slate-500 font-semibold mt-7 mb-7 pl-3">
                  <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                    •••
                  </span>
                  <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Gestion global</span>
                </h3>*/}
                <ul className="mt-3">
                  {/* Specialité */}
                  <SidebarLinkGroup activecondition={pathname.includes('community')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('community') ? 'hover:text-slate-200' : 'hover:text-white'
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faBriefcase} className={`shrink-0 h-6 w-6 ${pathname.includes('community') ? 'text-indigo-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  Spécialités
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/listeSpecialite"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Liste des spécialités
                                  </span>
                                </NavLink>
                              </li>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/addSpecialte"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Ajouter une spécialité
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>

                </ul>
                {/**
                <ul className="mt-3">
                  {/* département
                  <SidebarLinkGroup activecondition={pathname.includes('community')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('community') ? 'hover:text-slate-200' : 'hover:text-white'
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faBriefcase} className={`shrink-0 h-6 w-6 ${pathname.includes('community') ? 'text-indigo-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Département
                                </span>
                              </div>
                              {/* Icon 
                              <div className="flex shrink-0 ml-2">
                                <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/listeDepartement"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Liste des département
                                  </span>
                                </NavLink>
                              </li>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/addDepartement"
                                  className={({ isActive }) =>
                                    'block transition duration-150 truncate ' + (isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-200')
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    Ajouter un département
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>

                </ul>
              */}
              </div>

            </div>)}
          
        {/************************ Secretaire group ********************************/}
        {user && userRole === "aide" && (
            <div>
          <div>
            <h3 className="text-xs uppercase text-slate-500 mt-7 mb-7 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Secrétaire</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('dash-Aide') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/dash-Aide"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('dash-Aide') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-Aide') ? 'text-indigo-500' : 'text-slate-400'}`} d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-Aide') ? 'text-indigo-600' : 'text-slate-600'}`} d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-Aide') ? 'text-indigo-200' : 'text-slate-400'}`} d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                    </svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-slate-500 mt-7 mb-7 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block"></span>
            </h3>
            <ul className="mt-3">
              {/**messages */}
              
              {/**rendezvous */}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('addrdv') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/addrdv"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('addrdv') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className={`shrink-0 h-6 w-6 ${pathname.includes('addrdv') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Rendez-vous
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* patient */}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('listePatient') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/listePatient"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('listePatient') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className={`shrink-0 h-6 w-6 ${pathname.includes('listePatient') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Patients</span>
                  </div>
                </NavLink>
              </li>
              {/* demande rdv */}
<li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('demandeRDV') && 'bg-slate-900'}`}>
  <NavLink
    end
    to="/demandeRDV"
    className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('demandeRDV') ? 'hover:text-slate-200' : 'hover:text-white'
      }`}
  >
    <div className="flex items-center">
      <FontAwesomeIcon icon={faClock} className={`shrink-0 h-6 w-6 ${pathname.includes('demandeRDV') ? 'text-indigo-500' : 'text-slate-600'}`} />
      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Demandes rendez-vous</span>
    </div>
  </NavLink>
</li>
              {/**salle d'attente 
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('salleDattente') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/salleDattente"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('salleDattente') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChair} className={`shrink-0 h-6 w-6 ${pathname.includes('salleDattente') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Salle d'attente
                    </span>
                  </div>
                </NavLink>
              </li>*/}
              {/**Historique */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('historique') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/historique"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('historique') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faHistory} className={`shrink-0 h-6 w-6 ${pathname.includes('historique') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Historique d'appel
                    </span>
                  </div>
                </NavLink>
              </li>

            </ul>
          </div>
          </div>)}
          {/* ***********************médecin group ****************************************/}
          {user && userRole === "médecin" && (
            <div>
          <div>
            <h3 className="text-xs uppercase text-slate-500 mt-7 mb-7 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Médecin</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('inbox') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/dash-medecin"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('inbox') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-medecin') ? 'text-indigo-500' : 'text-slate-400'}`} d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-medecin') ? 'text-indigo-600' : 'text-slate-600'}`} d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                      <path className={`fill-current ${pathname === '/' || pathname.includes('dash-medecin') ? 'text-indigo-200' : 'text-slate-400'}`} d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                    </svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-slate-500 mt-7 mb-7 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block"> </span>
            </h3>
            <ul className="mt-3">
              {/**rendezvous */}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('addrdv') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/addrdv"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('addrdv') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className={`shrink-0 h-6 w-6 ${pathname.includes('addrdv') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Rendez-vous
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* patient */}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('listePatient') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/listePatient"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('listePatient') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className={`shrink-0 h-6 w-6 ${pathname.includes('listePatient') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Patients</span>
                  </div>
                </NavLink>
              </li>
              
              {/**salle d'attente 
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('salleDattente') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/salleDattente"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('salleDattente') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChair} className={`shrink-0 h-6 w-6 ${pathname.includes('salleDattente') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Salle d'attente
                    </span>
                  </div>
                </NavLink>
              </li>*/}
              <li className={`px-3 py-2 mt-4 mb-4 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('listeAideParMed') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/listeAideParMed"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('listeAideParMed') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`} 
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className={`shrink-0 h-6 w-6 ${pathname.includes('listeAideParMed') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Liste des Assitants
                    </span>
                  </div>
                </NavLink>
              </li>
              {/**Historique */}
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes('historique') && 'bg-slate-900'}`}>
                <NavLink
                  end
                  to="/historique"
                  className={`block text-slate-200 truncate transition duration-150 ${pathname.includes('historique') ? 'hover:text-slate-200' : 'hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faHistory} className={`shrink-0 h-6 w-6 ${pathname.includes('historique') ? 'text-indigo-500' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Historique d'appel
                    </span>
                  </div>
                </NavLink>
              </li>
              

            </ul>
          </div>
          </div>)}
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;