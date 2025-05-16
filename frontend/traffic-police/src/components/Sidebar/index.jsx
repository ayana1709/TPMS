import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';

// Import icons from react-icons
import {
  HiOutlineHome,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
  HiOutlineMapPin,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineShoppingCart,
  HiOutlineClipboardDocumentCheck,
  HiOutlineMegaphone,
  HiOutlineBell,
  HiOutlineClipboardDocumentList,
  HiChevronDown,
} from 'react-icons/hi2';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(
    localStorage.getItem('sidebar-expanded') === 'true',
  );
  const [complaintOpen, setComplaintOpen] = useState(false); // Add this inside your component

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    document.body.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebarRef}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col bg-gray-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wide">TPMS</h1>
        <button
          ref={triggerRef}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="mt-6 space-y-2 px-4">
        <NavItem to="/dashboard" label="Dashboard" Icon={HiOutlineHome} />
        <NavItem to="/fine" label="Fine" Icon={HiOutlineCurrencyDollar} />
        <NavItem
          to="/penalty-checking"
          label="Penalty Checking"
          Icon={HiOutlineExclamationCircle}
        />
        <NavItem
          to="/work-assignment"
          label="Shift & Location"
          Icon={HiOutlineMapPin}
        />
        <div>
          <button
            onClick={() => setComplaintOpen(!complaintOpen)}
            className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium hover:bg-gray-800"
          >
            <span className="flex items-center gap-2">
              <HiOutlineChatBubbleBottomCenterText className="h-5 w-5" />
              Complaints
            </span>
            <HiChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                complaintOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {complaintOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-1">
              <NavItem to="/complaints/add" label="Complain t" />
              <NavItem to="/complaints/view" label="View Complaints" />
              <NavItem to="/complaints/resolved" label="Resolved Complaints" />
            </div>
          )}
        </div>
        <NavItem to="/orders" label="Orders" Icon={HiOutlineShoppingCart} />
        <NavItem
          to="/accident-registration"
          label="Accident Register"
          Icon={HiOutlineClipboardDocumentCheck}
        />
        <NavItem
          to="/post-announcement"
          label="Post Announcement"
          Icon={HiOutlineMegaphone}
        />
        <NavItem
          to="/notifications"
          label="Notifications"
          Icon={HiOutlineBell}
        />
        <NavItem
          to="/accident-reports"
          label="Accident Reports"
          Icon={HiOutlineClipboardDocumentList}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
