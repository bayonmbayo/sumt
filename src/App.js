import { connect } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './App.css';
import { Confirmation } from './components/Confirmation';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import { NewPassword } from './components/NewPassword';
import NewTransfer from './components/NewTransfer';
import NewUser from './components/NewUser';
import { PasswortVergessen } from './components/PasswortVergessen';
import Settings from './components/Settings';
import Users from './components/Users';
import ViewTransfer from './components/ViewTransfer';
import { ProtectedLayout } from './helpers/auth';


// Layout component to include Header
const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter(
  [
    {
      element: <Layout />, // all routes share this layout (with Header)
      children: [
        { path: '/', element: <Login /> },
        { path: 'login', element: <Login /> },
        // { path: 'registrieren', element: <Registrieren /> }, // still commented
        { path: 'confirmation/:token', element: <Confirmation /> },
        { path: 'resettingpassword/:token', element: <NewPassword /> },
        { path: 'passwortvergessen', element: <PasswortVergessen /> },

        {
          element: <ProtectedLayout />, // this wraps private routes
          children: [
            { path: 'transfers', element: <Home /> },
            { path: 'transfer/:transfer', element: <ViewTransfer /> },
            { path: 'new', element: <NewTransfer /> },
            { path: 'settings', element: <Settings /> },
            { path: 'users', element: <Users /> },
            { path: 'newuser', element: <NewUser update={false} /> },
            { path: 'user/:user', element: <NewUser update={true} /> },
          ]
        },

        { path: 'about', element: <Home /> },
      ],
    },
  ],
  {
    basename: '/sumt', // preserve your original basename
  }
);

function App() {
  return <RouterProvider router={router} />;
}

const connectedApp = connect(null)(App);
export { connectedApp as App };
