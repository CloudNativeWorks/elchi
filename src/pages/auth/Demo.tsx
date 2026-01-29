import { useState } from 'react';
import { Button, Card, message, Result } from 'antd';
import { useDemoMutation } from "@/common/api";
import { MailOutlined } from '@ant-design/icons';
import '@/assets/styles/loginPage.scss';
import logoelchi from "@/assets/images/logo_black.webp";
import { useNavigate } from 'react-router';


const Demo = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [userMail, setUserMail] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const mutate = useDemoMutation("/auth/demo");
    const [buttonState, setButtonState] = useState('Create Demo Account');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserMail(event.target.value);
    };

    const handleSubmit = async () => {
        if (!userMail) {
            messageApi.warning('Please enter a valid email address!');
            return;
        }

        setButtonState('User Creating...');

        try {
            await mutate.mutateAsync(userMail, {
                onSuccess: (_: any) => {
                    setSuccess(true);
                }
            });
        } catch (error) {
            setButtonState('Create Demo Account');
        }
    };

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <>
            {contextHolder}
            <div className="wrapper2">
                {success ?
                    <Card style={{ backgroundColor: 'var(--bg-glass)', border: 'none' }}>
                        <Result
                            status="success"
                            title="Successfully Created!"
                            subTitle="You can log in and create Envoy resources using the credentials we provided. Your username and password have been sent to you. Don't forget, this account is valid for 24 hours only!!"
                            extra={[
                                <Button key="login" type="primary" onClick={handleLogin}>
                                    Login
                                </Button>,
                            ]}
                        />
                    </Card> :
                    <>
                        <div className={`login ${buttonState === "User Creating..." && "loading"}`}>
                            <div className="brand" style={{ textAlign: 'center', marginBottom: 4 }}>
                                <span><img alt='Elchi' src={logoelchi} /></span>
                            </div>
                            <div className="input-container">
                                <input style={{ display: 'none' }}
                                    name="xxmail"
                                    value={userMail}
                                    onChange={handleChange}
                                />

                                <input type="email" placeholder="E-Mail Address" name="mail" value={userMail}
                                    onChange={handleChange} />
                                <i className="fa fa-user"> <MailOutlined /></i>
                            </div>

                            <button type='button' style={{ cursor: "pointer" }} onClick={handleSubmit} disabled={buttonState !== 'Create Demo Account'}>
                                <i className="spinner"></i>
                                <span className="state">{buttonState}</span>
                            </button>
                        </div>
                        <footer><a target="_blank" href="#">Elchi</a></footer>
                    </>
                }
            </div>
        </>
    );
};

export default Demo;