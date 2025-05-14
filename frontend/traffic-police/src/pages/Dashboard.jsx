import React from 'react';
// import { useAuth } from '../context/AuthContext';
import DashboardCard14 from '../components/DashboardCard14';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  // const { token } = useAuth();
  console.log(user);
  const token = localStorage.getItem('token');
  console.log(token);

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Dashboard
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Home /
              </a>
            </li>
            <li className="font-medium text-primary">Dashboard</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Traffic Laws Card */}
        <DashboardCard14 />

        {/* Add more dashboard cards here as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
