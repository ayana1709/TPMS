import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  UserPlusIcon,
  MapPinIcon,
  CalendarIcon,
  BellAlertIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  IdentificationIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import TrafficAccount from "./pages/dashboard/TrafficAccount";
import TrafficAccountsTable from "./pages/dashboard/TrafficAccountsTable";
import ShiftManager from "./pages/dashboard/ShiftManager";
import LocationRegistrationForm from "./pages/dashboard/LocationRegistrationForm";
import CheckpointTable from "./pages/dashboard/CheckpointTable";
// import LocationRegistrationForm from "./pages/dashboard/GeoTest";
// import GeoTest from "./pages/dashboard/LocationRegistrationForm";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "Traffic Account Setup",
        path: "/traffic-account",
        element: <TrafficAccountsTable />, // replace with actual component if needed
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Shift Management",
        path: "/shift-management",
        element: <ShiftManager />,
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Location Management",
        path: "/location-management",
        element: <CheckpointTable />,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Attendance",
        path: "/attendance",
        element: <Notifications />,
      },
      {
        icon: <BellAlertIcon {...icon} />,
        name: "Complaint",
        path: "/complain",
        element: <Notifications />,
      },
      {
        icon: <ExclamationTriangleIcon {...icon} />,
        name: "Accident",
        path: "/accident",
        element: <Notifications />,
      },
      {
        icon: <TruckIcon {...icon} />,
        name: "List of Cars",
        path: "/cars",
        element: <Notifications />,
      },
      {
        icon: <IdentificationIcon {...icon} />,
        name: "List of Drivers",
        path: "/drivers",
        element: <Notifications />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        name: "Create Traffic Account (Hidden)",
        path: "create-account",
        element: <TrafficAccount />,
      },
      {
        name: "Location  Registration  (Hidden)",
        path: "location-registration",
        element: <LocationRegistrationForm />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
