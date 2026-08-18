import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewApplication from './pages/NewApplication';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import Help from './pages/Help';
import Policy from './pages/Policy';
import PrintToken from './pages/PrintToken';
import DigitalProfile from './pages/DigitalProfile';
import Eligibility from './pages/Eligibility';


/* =========================================================
   ROLE PROTECTION
========================================================= */

const RoleRoute = ({ allowedRole, children }) => {
  const location = useLocation();

  const currentRole = sessionStorage.getItem('loanlens_role');

  /*
   * No role selected
   */
  if (!currentRole) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /*
   * Client trying to access bank area
   */
  if (currentRole === 'client' && allowedRole === 'bank') {
    return <Navigate to="/client/new" replace />;
  }

  /*
   * Bank trying to access client-only area
   */
  if (currentRole === 'bank' && allowedRole === 'client') {
    return <Navigate to="/dashboard" replace />;
  }

  /*
   * Unknown / invalid role
   */
  if (currentRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <ToastProvider>

      <Router>

        <Routes>

          {/* =================================================
              PUBLIC LANDING PAGE
          ================================================= */}
          <Route
            path="/"
            element={<Landing />}
          />


          {/* =================================================
              BANK / MANAGER LOGIN
          ================================================= */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/client/new"
            element={
              <RoleRoute allowedRole="client">
                <NewApplication />
              </RoleRoute>
            }
          />
          <Route
            element={
              <RoleRoute allowedRole="bank">
                <MainLayout />
              </RoleRoute>
            }
          >

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* New Application */}
            <Route
              path="/new"
              element={<NewApplication />}
            />

            {/* Applications */}
            <Route
              path="/applications"
              element={<Applications />}
            />

            {/* Application Details */}
            <Route
              path="/applications/:id"
              element={<ApplicationDetail />}
            />

            {/* Digital Profile */}
            <Route
              path="/digital-profile"
              element={<DigitalProfile />}
            />

            <Route
              path="/digital-profile/:applicationId"
              element={<DigitalProfile />}
            />

            {/* Eligibility */}
            <Route
              path="/eligibility"
              element={<Eligibility />}
            />

            <Route
              path="/eligibility/:applicationId"
              element={<Eligibility />}
            />

            {/* Help */}
            <Route
              path="/help"
              element={<Help />}
            />

            {/* Policy */}
            <Route
              path="/policy"
              element={<Policy />}
            />

          </Route>


          {/* =================================================
              PRINT TOKEN

              Bank only.
          ================================================= */}
          <Route
            path="/print/:id"
            element={
              <RoleRoute allowedRole="bank">
                <PrintToken />
              </RoleRoute>
            }
          />


          {/* =================================================
              FALLBACK
          ================================================= */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </Router>

    </ToastProvider>
  );
}

export default App;