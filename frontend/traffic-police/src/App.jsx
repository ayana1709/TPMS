import { useEffect, useState, createContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';

import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import Chart from './pages/Chart';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';

import SignIn from './pages/Authentication/SignIn';
import TrafficWelcome from './pages/Authentication/TrafficWelcome';
import PendingActivation from './pages/Authentication/PendingActivation';
import NotFound from './pages/NotFound'; // 🔥 Create this page!

import DefaultLayout from './layout/DefaultLayout';
import PrivateRoute from './components/PrivateRoute'; // 🔐 You'll need this HOC/wrapper
import api from './api';

// Auth context to use globally if needed
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await api.get('/traffic-user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data); // assuming the API returns user object directly
      } catch (error) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  if (loadingUser) return <Loader />;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <PageTitle title="TPMS | Login" />
              <SignIn />
            </>
          }
        />
        <Route path="/traffic-welcome" element={<TrafficWelcome />} />
        <Route path="/pending-activation" element={<PendingActivation />} />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forms/form-elements" element={<FormElements />} />
          <Route path="/forms/form-layout" element={<FormLayout />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/ui/alerts" element={<Alerts />} />
          <Route path="/ui/buttons" element={<Buttons />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
