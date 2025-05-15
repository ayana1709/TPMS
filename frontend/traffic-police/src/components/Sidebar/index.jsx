import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-8 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <div className="text-2xl text-white font-bold">Traffic Dashbord</div>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dashboard') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                      fill=""
                    />
                  </svg>
                  Dashboard
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Fine --> */}
              <li>
                <NavLink
                  to="/fine"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('fine') && 'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  Fine
                </NavLink>
              </li>
              {/* <!-- Menu Item Fine --> */}

              {/* <!-- Menu Item Penalty Checking --> */}
              <li>
                <NavLink
                  to="/penalty-checking"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('penalty-checking') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  Penalty Checking
                </NavLink>
              </li>
              {/* <!-- Menu Item Penalty Checking --> */}

              {/* <!-- Menu Item Work Assignment --> */}
              <li>
                <NavLink
                  to="/work-assignment"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('work-assignment') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M15.75 0H2.25C1.0125 0 0 1.0125 0 2.25V15.75C0 16.9875 1.0125 18 2.25 18H15.75C16.9875 18 18 16.9875 18 15.75V2.25C18 1.0125 16.9875 0 15.75 0ZM2.25 1.5H15.75C16.1625 1.5 16.5 1.8375 16.5 2.25V6.75H1.5V2.25C1.5 1.8375 1.8375 1.5 2.25 1.5ZM15.75 16.5H2.25C1.8375 16.5 1.5 16.1625 1.5 15.75V8.25H16.5V15.75C16.5 16.1625 16.1625 16.5 15.75 16.5Z"
                      fill=""
                    />
                    <path d="M3.75 3H5.25V4.5H3.75V3Z" fill="" />
                    <path d="M7.5 3H9V4.5H7.5V3Z" fill="" />
                    <path d="M11.25 3H12.75V4.5H11.25V3Z" fill="" />
                  </svg>
                  Work Assignment
                </NavLink>
              </li>
              {/* <!-- Menu Item Work Assignment --> */}

              {/* <!-- Menu Item Order --> */}
              <li>
                <NavLink
                  to="/order"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('order') && 'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  List Of Order
                </NavLink>
              </li>
              {/* <!-- Menu Item Order --> */}

              {/* <!-- Menu Item Complain --> */}
              <li>
                <NavLink
                  to="/complain"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('complain') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  List Of Complain
                </NavLink>
              </li>
              {/* <!-- Menu Item Complain --> */}

              {/* <!-- Menu Item Report Accident --> */}
              <li>
                <NavLink
                  to="/report-accident"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('report-accident') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  Accident Registration
                </NavLink>
              </li>
              {/* <!-- Menu Item Report Accident --> */}

              {/* <!-- Menu Item Register Accident --> */}
              <li>
                <NavLink
                  to="/register-accident"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('register-accident') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
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
                      d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM9 16.2C5.0316 16.2 1.8 12.9684 1.8 9C1.8 5.0316 5.0316 1.8 9 1.8C12.9684 1.8 16.2 5.0316 16.2 9C16.2 12.9684 12.9684 16.2 9 16.2Z"
                      fill=""
                    />
                    <path
                      d="M9 3.6C8.0064 3.6 7.2 4.4064 7.2 5.4V9C7.2 9.9936 8.0064 10.8 9 10.8C9.9936 10.8 10.8 9.9936 10.8 9V5.4C10.8 4.4064 9.9936 3.6 9 3.6Z"
                      fill=""
                    />
                    <path
                      d="M9 12.6C8.0064 12.6 7.2 13.4064 7.2 14.4C7.2 15.3936 8.0064 16.2 9 16.2C9.9936 16.2 10.8 15.3936 10.8 14.4C10.8 13.4064 9.9936 12.6 9 12.6Z"
                      fill=""
                    />
                  </svg>
                  Post Information
                </NavLink>
              </li>
              {/* <!-- Menu Item Register Accident --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
