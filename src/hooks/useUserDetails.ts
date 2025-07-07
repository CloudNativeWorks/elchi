import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { DecodeToken } from '@/utils/tools';
import { UserDetail } from '@/common/types';


const useAuth = (): UserDetail | null => {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

    useEffect(() => {
        const token = Cookies.get('bb_token');
        if (token) {
            const decodedUser = DecodeToken(token);
            setUserDetail(decodedUser);
        } else {
            setUserDetail(null);
        }
    }, []);

    return userDetail;
};

export default useAuth;