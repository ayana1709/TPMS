import React, { useState } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { Outlet, useLocation } from 'react-router-dom'; // ✅ updated here

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const excludedRoutes = ['/login', '/signup'];
  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {!isExcludedRoute && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          {!isExcludedRoute && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          {/* Main Content */}
          <main>
            <div
              className={`mx-auto max-w-screen-2xl ${
                isExcludedRoute ? '' : 'p-4 md:p-6 2xl:p-10'
              }`}
            >
              <Outlet /> {/* ✅ This enables nested route rendering */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
