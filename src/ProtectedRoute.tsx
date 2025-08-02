import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DecodeToken } from './utils/tools';

const ProtectedRoute: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const cookies = Cookies.get('bb_token');
        if (!cookies && location.pathname !== '/demo') {
            navigate('/login');
            return;
        }

        const userDetail = DecodeToken(cookies);
        const timeRemaining = Math.floor(((userDetail.exp * 1000) - new Date().getTime()) / 1000);
        if (timeRemaining < 0 && location.pathname !== '/demo') {
            navigate('/login');
        }
    }, [navigate]);

    return <Outlet />;
};

export default ProtectedRoute;