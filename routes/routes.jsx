import { lazy } from 'react';
import PrivateRoute from './PrivateRoute ';
import PublicRoute from './PublicRoute';
import EditAppointment from '../components/appointmentSchema ';
import RoleBasedRoute from '../components/RoleBasedRoute';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Appointments = lazy(() => import('../pages/Appointments'));
const NewAppointment = lazy(() => import('../pages/NewAppointment'));
const UserManagement = lazy(() => import('../pages/Admin/UserManagement'));
const AppointmentManagement = lazy(() => import('../pages/Admin/AppointmentManagement'));
const TermsAndPrivacy = lazy(() => import('../pages/TermsAndPrivacy'));

export const routes = [
  {
    path: '/terms',
    element: <TermsAndPrivacy />
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgotPassword /></PublicRoute>
  },
  {
    path: '/reset-password',
    element: <PublicRoute><ResetPassword /></PublicRoute>
  },
  {
    path: '/',
    element: <PrivateRoute><Dashboard /></PrivateRoute>
  },
  {
    path: '/appointments',
    element: <PrivateRoute><Appointments /></PrivateRoute>
  },
  {
    path: '/appointments/new',
    element: <PrivateRoute><NewAppointment /></PrivateRoute>
  },
  {
    path: '/admin/users',
    element: <RoleBasedRoute roles={['Admin']}><UserManagement /></RoleBasedRoute>
  },
  {
    path: '/admin/appointments',
    element: <RoleBasedRoute roles={['Admin']}><AppointmentManagement /></RoleBasedRoute>
  },
  {
    path: '//Appointment/edit/:id',
    element: <PrivateRoute><EditAppointment /></PrivateRoute>
  }
];