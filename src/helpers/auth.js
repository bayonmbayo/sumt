import { Navigate, Outlet } from 'react-router-dom';

export const isAuthenticated = () => {
    return !!localStorage.getItem('user'); // or use context or cookie
};

export const ProtectedLayout = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};