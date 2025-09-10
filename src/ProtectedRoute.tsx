import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const cookies = Cookies.get('bb_token');
        if (!cookies && location.pathname !== '/demo') {
            navigate('/login');
            return;
        }

        // Don't check token expiry here - let the API interceptor handle it
        // The interceptor will automatically refresh if needed
        // Only navigate to login if there's no token at all
        
        // Optionally, you can decode to get user info but don't check expiry
        // const userDetail = DecodeToken(cookies);
    }, [navigate, location.pathname]);

    return <Outlet />;
};

export default ProtectedRoute;