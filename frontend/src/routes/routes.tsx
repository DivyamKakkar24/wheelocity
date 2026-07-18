import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardPage from '../modules/dashboard/DashboardPage';
import AuthPage from '../modules/auth/AuthPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
  { path: '/login', element: <AuthPage /> },
  { path: '/register', element: <AuthPage /> },
]);

export default router;
