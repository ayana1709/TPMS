import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const TrafficLaws = () => {
  const { user } = useAuth();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredLaws = laws.filter(
    (law) =>
      law.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.violation_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Traffic Laws
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Home /
              </a>
            </li>
            <li className="font-medium text-primary">Traffic Laws</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search laws..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Code
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Violation Name
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Fine (Birr)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLaws.map((law, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{law.code}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {law.violation_name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {law.fine_birr}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficLaws;
