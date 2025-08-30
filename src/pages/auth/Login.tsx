import { FormEvent, useEffect, useState } from 'react';
import { useAuthMutation } from "@/common/api";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { DecodeToken } from '@utils/tools';
import { CheckDate } from "@/utils/date-time-tool";
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import '@/assets/styles/loginPage.scss'
import logoelchi from "@/assets/images/logo_black.png";
import { useProjectVariable } from '@/hooks/useProjectVariable';



const Login = () => {
    const mutate = useAuthMutation("/auth/login");
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState<any>({});
    const [working, setWorking] = useState(false);
    const [buttonState, setButtonState] = useState('Log in');
    const { setProject } = useProjectVariable();

    useEffect(() => {
        if (userDetail.token) {
            const tokenExp = DecodeToken(userDetail.token);
            if (!CheckDate(tokenExp.exp)) {
                navigate(`/`);
            }
        }
    }, [userDetail, navigate]);

    const handleDemo = () => {
        navigate('/demo');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (working) return;
        setWorking(true);
        setButtonState('Authenticating');

        const target = event.target as HTMLFormElement;
        const username = (target.elements.namedItem('username') as HTMLInputElement).value;
        const password = (target.elements.namedItem('password') as HTMLInputElement).value;
        const values = { username: username, password: password }
        try {
            await mutate.mutateAsync(values, {
                onSuccess: (data: any) => {
                    Cookies.set('bb_token', data.data.token);
                    Cookies.set('bb_refresh_token', data.data.refresh_token);

                    const newUserDetail = DecodeToken(data.data.token);
                    setUserDetail(newUserDetail);
                    setProject(newUserDetail.base_project);
                    navigate(`/`, { replace: true });
                }
            })
        } catch (error) {
            setButtonState('Log in');
            setWorking(false);
        }
    };

    return (
        <div className="wrapper2">
            <form className={`login ${buttonState === 'Username or Password incorrect!' ? 'ok' : ''} ${buttonState === 'Authenticating' ? 'loading' : ''}`} onSubmit={handleSubmit}>
                <div className="brand" style={{ textAlign: 'center', marginBottom: 4 }}>
                    <span><img alt='Elchi' src={logoelchi} /></span>
                </div>
                <input type="text" placeholder="Username" name="username" />
                <i className="fa fa-user"> <UserOutlined /></i>
                <input type="password" placeholder="Password" name="password" />
                <i className="fa fa-key"><KeyOutlined /></i>
                <button type='submit' style={{ cursor: "pointer" }}>
                    <i className="spinner"></i>
                    <span className="state">{buttonState}</span>
                </button>
            </form>
            <footer>
                {
                    window.APP_CONFIG?.ENABLE_DEMO ?
                        <a target="blank" style={{ cursor: 'pointer' }} onClick={handleDemo}>Create Demo Account</a>
                        : <a target="_blank" href="#">Elchi</a>
                }
            </footer>
        </div>
    );
};

export default Login;
