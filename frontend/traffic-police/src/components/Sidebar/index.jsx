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
  HiOutlinePencilSquare,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineCog6Tooth,
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
        <NavItem
          to="/fine"
          label="Fine Drivers"
          Icon={HiOutlineCurrencyDollar}
        />
        <NavItem
          to="/penalty-checking"
          label="List Of penality "
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
            className="flex w-full items-center justify-between rounded px-5 py-2 text-sl font-medium hover:bg-gray-800"
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
            <div className="ml-4 mt-1 flex flex-col gap-1">
              <NavItem
                to="/complain-to-manager"
                label="Complain to Manager"
                Icon={HiOutlinePencilSquare}
                className="text-sm px-2"
                iconClassName="h-4 w-4"
                textClassName="text-sm"
              />
              <NavItem
                to="/user-complain"
                label="Complaints from User"
                Icon={HiOutlineUsers}
                className="text-sm px-2"
                iconClassName="h-4 w-4"
                textClassName="text-sm"
              />
              <NavItem
                to="/driver-complain"
                label="Complaints from Driver"
                Icon={HiOutlineTruck}
                className="text-sm px-2"
                iconClassName="h-4 w-4"
                textClassName="text-sm"
              />
            </div>
          )}
        </div>
        <NavItem
          to="/manager-directives"
          label="Manager Directives"
          Icon={HiOutlineClipboardDocumentList}
        />
        <NavItem
          to="/order-to-driver"
          label="Driver Enforcement "
          Icon={HiOutlineClipboardDocumentCheck}
        />
        <NavItem
          to="/incident-alerts"
          label="Incident Alerts"
          Icon={HiOutlineExclamationCircle}
        />
        <NavItem
          to="/list-of Accident"
          label="Accident Register"
          Icon={HiOutlineClipboardDocumentCheck}
        />
        <NavItem
          to="/post-info"
          label="Post Information"
          Icon={HiOutlineMegaphone}
        />
        <NavItem
          to="/traffic-laws"
          label="Traffic laws"
          Icon={HiOutlineClipboardDocumentList}
        />
        <NavItem
          to="/notification"
          label="Notifications"
          Icon={HiOutlineBell}
        />
        <NavItem to="/settings" label="Settings" Icon={HiOutlineCog6Tooth} />
      </nav>
    </aside>
  );
};

export default Sidebar;
