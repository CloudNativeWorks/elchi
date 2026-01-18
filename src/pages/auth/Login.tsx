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
import styled from 'styled-components';
import { OTPInputField } from '@/components/otp/OTPInputField';
import { OTPSetupModal } from '@/components/otp/OTPSetupModal';
import { Modal, message, notification } from 'antd';

const CloudNativeWorksLogo = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0;

    .cloudnative {
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
        color: inherit;
    }

    .works {
        background: linear-gradient(to right, rgb(255, 107, 53), rgb(30, 58, 138), rgb(59, 130, 246));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        font-size: 1.5rem;
        font-weight: bold;
    }
`;

const Login = () => {
    const mutate = useAuthMutation("/auth/login");
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState<any>({});
    const [working, setWorking] = useState(false);
    const [buttonState, setButtonState] = useState('Log in');
    const { setProject } = useProjectVariable();

    // OTP states
    const [requiresOTP, setRequiresOTP] = useState(false);
    const [requiresOTPSetup, setRequiresOTPSetup] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    useEffect(() => {
        if (userDetail.token) {
            const tokenExp = DecodeToken(userDetail.token);
            if (!CheckDate(tokenExp.exp)) {
                navigate(`/`);
            }
        }
    }, [userDetail, navigate]);

    const handleMetrics = () => {
        window.location.href = '/grafana';
    };

    const handleLoginSuccess = (data: any) => {
        // Set tokens (backend handles expiry, no security flags for compatibility)
        Cookies.set('bb_token', data.data.token);
        Cookies.set('bb_refresh_token', data.data.refresh_token);

        const newUserDetail = DecodeToken(data.data.token);
        setUserDetail(newUserDetail);
        setProject(newUserDetail.base_project);
        navigate(`/`, { replace: true });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (working) return;
        setWorking(true);
        setButtonState('Authenticating');

        const target = event.target as HTMLFormElement;
        const username = (target.elements.namedItem('username') as HTMLInputElement).value;
        const password = (target.elements.namedItem('password') as HTMLInputElement).value;
        const values = { username, password }

        setCredentials({ username, password });

        try {
            await mutate.mutateAsync(values, {
                onSuccess: handleLoginSuccess
            })
        } catch (error: any) {
            console.log(error)

            // Check for OTP requirement
            if (error.response?.data?.requires_otp) {
                setRequiresOTP(true);
                setButtonState('Log in');
                setWorking(false);
                return;
            }

            // Check for OTP setup requirement
            if (error.response?.data?.requires_otp_setup) {
                // Save temp token for OTP setup
                const tempToken = error.response?.data?.temp_token;
                if (tempToken) {
                    Cookies.set('bb_token', tempToken);
                }
                setRequiresOTPSetup(true);
                setButtonState('Log in');
                setWorking(false);
                return;
            }

            // Show error message
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
            message.error(errorMessage);

            setButtonState('Log in');
            setWorking(false);
        }
    };

    const handleOTPSubmit = async (otpCode: string) => {
        setWorking(true);
        setButtonState('Verifying OTP');

        const values = {
            username: credentials.username,
            password: credentials.password,
            otp_code: otpCode
        };

        try {
            await mutate.mutateAsync(values, {
                onSuccess: (data: any) => {
                    handleLoginSuccess(data);
                    setRequiresOTP(false);
                }
            })
        } catch (error: any) {
            console.log(error)

            // Show error message
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'OTP verification failed';
            message.error(errorMessage);

            setButtonState('Log in');
            setWorking(false);
        }
    };

    const handleOTPSetupComplete = async () => {
        // Clear temp token
        Cookies.remove('bb_token');

        // Close modal
        setRequiresOTPSetup(false);

        // Show success message and auto-login with OTP
        message.success('2FA enabled successfully! Please enter your OTP code to login.');

        // Trigger OTP login flow
        setRequiresOTP(true);
    };

    return (
        <div className="wrapper2">
            <CloudNativeWorksLogo>
                <span className="cloudnative">CloudNative</span>
                <span className="works">Works</span>
            </CloudNativeWorksLogo>
            <form className={`login ${buttonState === 'Username or Password incorrect!' ? 'ok' : ''} ${buttonState === 'Authenticating' || buttonState === 'Verifying OTP' ? 'loading' : ''}`} onSubmit={handleSubmit}>
                <div className="brand" style={{ textAlign: 'center', marginBottom: 4 }}>
                    <span><img alt='Elchi' src={logoelchi} /></span>
                </div>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    defaultValue={window.APP_CONFIG?.ENABLE_DEMO ? 'demo' : ''}
                />
                <i className="fa fa-user"> <UserOutlined /></i>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    defaultValue={window.APP_CONFIG?.ENABLE_DEMO ? 'Demo123!123*123' : ''}
                />
                <i className="fa fa-key"><KeyOutlined /></i>
                <button type='submit' style={{ cursor: "pointer" }}>
                    <i className="spinner"></i>
                    <span className="state">{buttonState}</span>
                </button>
            </form>
            <footer className="login-footer">
                <div className="footer-links">
                    <a className="footer-link" onClick={handleMetrics}>
                        <span className="link-icon">📊</span>
                        <span>Metrics</span>
                    </a>
                    <a className="footer-link" href="https://www.elchi.io" target="_blank" rel="noopener noreferrer">
                        <span className="link-icon">🌐</span>
                        <span>elchi.io</span>
                    </a>
                </div>
                <div className="footer-text">
                    <span>Powered by Elchi</span>
                </div>
            </footer>

            {/* OTP Input Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <KeyOutlined style={{ color: '#fff', fontSize: 20 }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                                Two-Factor Authentication
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', marginTop: 2 }}>
                                Enter your 6-digit code
                            </div>
                        </div>
                    </div>
                }
                open={requiresOTP}
                onCancel={() => {
                    setRequiresOTP(false);
                    setButtonState('Log in');
                    setWorking(false);
                }}
                footer={null}
                width={520}
                centered
                styles={{
                    header: { paddingBottom: 20, borderBottom: '1px solid var(--border-default)', background: 'transparent' },
                    body: { paddingTop: 24, paddingBottom: 24, paddingLeft: 32, paddingRight: 32 }
                }}
            >
                <OTPInputField
                    onSubmit={handleOTPSubmit}
                    loading={working}
                    allowBackupCode={true}
                />
            </Modal>

            {/* OTP Setup Required Modal */}
            <OTPSetupModal
                visible={requiresOTPSetup}
                onComplete={handleOTPSetupComplete}
                onCancel={() => setRequiresOTPSetup(false)}
                username={credentials.username}
            />
        </div>
    );
};

export default Login;
