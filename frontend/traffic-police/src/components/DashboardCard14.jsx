import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const DashboardCard14 = () => {
  const navigate = useNavigate();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchLaws();
  }, []);

  const fetchLaws = async () => {
    try {
      const response = await api.get('/violations');
      setLaws(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch traffic laws');
      setLoading(false);
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-title-sm font-bold text-black dark:text-white">
            Traffic Laws
          </h4>
          <p className="text-sm font-medium">Total: {laws.length}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center justify-center rounded-full bg-primary p-3 text-white hover:bg-opacity-90"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                fill=""
              />
              <path
                d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                fill=""
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <button
                onClick={() => {
                  navigate('/traffic-laws');
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-meta-4"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                    fill=""
                  />
                  <path
                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67812 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67812 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                    fill=""
                  />
                </svg>
                View All
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-4 flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[80px] py-3 px-4 font-medium text-black dark:text-white">
                    Code
                  </th>
                  <th className="min-w-[200px] py-3 px-4 font-medium text-black dark:text-white">
                    Violation
                  </th>
                  <th className="min-w-[80px] py-3 px-4 font-medium text-black dark:text-white">
                    Fine
                  </th>
                </tr>
              </thead>
              <tbody>
                {laws.slice(0, 5).map((law, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{law.code}</p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {law.violation_name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {law.fine_birr}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard14;
