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
import CheckpointTable from "./pages/dashboard/CheckpointTable";
import PendingActivationCard from "./pages/dashboard/PendingActivationCard";
import ShiftList from "./pages/dashboard/shift/ShiftList";
import ShiftCreate from "./pages/dashboard/shift/ShiftCreate";
import LocationRegistrationForm from "./pages/dashboard/location/LocationRegistrationForm";
import CheckpointsList from "./pages/dashboard/location/CheckpointsList";
import AssignOfficer from "./pages/dashboard/Attendance/AssignShiftForm";
import AssignShiftForm from "./pages/dashboard/Attendance/AssignShiftForm";
import ShiftAssignmentTable from "./pages/dashboard/Attendance/ShiftAssignmentTable";
import CreateAccountingUser from "./pages/dashboard/CreateAccountingCheacker";
import CreateAccountingCheacker from "./pages/dashboard/CreateAccountingCheacker";
import CheackerTable from "./pages/dashboard/CheackerTable";
import CheckerDriverTable from "./pages/dashboard/CheckerDriverTable";


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
        icon: <UserPlusIcon {...icon} />,
        name: "Activate traffic account",
        path: "/activation-page",
        element: <PendingActivationCard />, // replace with actual component if needed
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Shift Management",
        path: "/shift-management",
        element: <ShiftList />,
      },
      {
        icon: <MapPinIcon {...icon} />,
        name: "Location Management",
        path: "/location-management",
        element: <CheckpointsList/>,
      },
      {
        icon: <CalendarIcon {...icon} />,
        name: "Traffic Assignment",
        path: "/traffic-assignemnt",
        element: <ShiftAssignmentTable />,
      },
     
     
      
      {
        icon: <BellAlertIcon {...icon} />,
        name: "cheacker Accounts",
        path: "/complain",
        element: <CheackerTable/>,
      },
      {
        icon: <IdentificationIcon {...icon} />,
        name: "List of Drivers",
        path: "/cheack-driver",
        element: <CheckerDriverTable />,

      },
      
      
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        // name: "",
        path: "create-account",
        element: <TrafficAccount />,
      },
      {
        // name: "Location  Registration  (Hidden)",
        path: "location-registration",
        element: <LocationRegistrationForm />,
      },
      {
        // name: "",
        path: "shifts-create",
        element: <ShiftCreate />,
      },
      {
        // name: "",
        path: "cheackpoint-create",
        element: <LocationRegistrationForm />,
      },
      {
        // name: "",
        path: "assign-traffic-officer",
        element: <AssignShiftForm />,
      },
      {
        // name: "",
        path: "create-cheacker",
        element: <CreateAccountingCheacker />,
      },
      {
        // name: "",
        path: "cheack-driver",
        element: <CheckerDriverTable />,
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <UserCircleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <UserPlusIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
