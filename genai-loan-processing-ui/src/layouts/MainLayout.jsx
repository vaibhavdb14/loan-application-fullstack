import React, {
  useState,
  useEffect,
} from 'react';

import {
  Outlet,
  useLocation,
} from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


const PAGE_TITLES = {

  '/dashboard':
    'Dashboard',

  '/new':
    'New Application',

  '/applications':
    'Applications',

  '/digital-profile':
    'Digital Profile',

  '/eligibility':
    'Eligibility Check',

  '/help':
    'Help',

  '/policy':
    'Policy / Rules',

};


const MainLayout = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();


  /* =========================================================
     CLOSE SIDEBAR WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {

    setSidebarOpen(false);

  }, [location.pathname]);


  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const pageTitle =
    PAGE_TITLES[location.pathname] ||

    (
      location.pathname.startsWith('/applications/')
      && 'Application Details'
    ) ||

    (
      location.pathname.startsWith('/digital-profile/')
      && 'Digital Profile'
    ) ||

    (
      location.pathname.startsWith('/eligibility/')
      && 'Eligibility Check'
    ) ||

    '';


  return (

    <div className="
      flex
      min-h-screen
      bg-banking-background
    ">

      {/* SIDEBAR */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* MAIN */}

      <div className="
        flex-1
        lg:ml-64
        flex
        flex-col
        min-w-0
      ">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />


        <main className="
          flex-1
          overflow-x-hidden
        ">

          <Outlet />

        </main>

      </div>

    </div>

  );
};


export default MainLayout;