// Header.tsx
import { useEffect, useState } from "react";
import { Row, Col, Avatar, Space, Dropdown, Button, Tooltip, Modal } from "antd";
import { RobotOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../pages/auth/Logout";
import logoelchi from "../../assets/images/logo_white.png";
import { UserDetail } from "@/common/types";
import { useErrorSummary } from "@/hooks/useErrorSummary";
import { useProjectVariable } from "@/hooks/useProjectVariable";


interface HeaderProps {
	userDetail: UserDetail;
}

function Header({ userDetail }: Readonly<HeaderProps>) {
	const logout = useLogout();
	const navigate = useNavigate();
	const { project } = useProjectVariable();
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	
	const { data: errorSummary } = useErrorSummary({
		project,
		enabled: !!project
	});
	
	const items = [
		{
			onClick: logout,
			label: <b style={{ cursor: 'pointer' }}>Log out</b>,
			key: 'logout',
		},
	];

	const handleAIClick = () => {
		navigate('/ai-analyzer');
	};

	const handleErrorBadgeClick = () => {
		setIsErrorModalOpen(true);
	};

	const handleErrorModalClose = () => {
		setIsErrorModalOpen(false);
	};

	useEffect(() => window.scrollTo(0, 0));

	return (
		<div className="header" style={{ width: '100%', height: '100%' }}>
			<Row justify="space-between" align="middle" style={{ width: '100%' }}>
				<Col>
					<div className="brand">
						<img src={logoelchi} alt="Logo" style={{ height: '40px' }} />
					</div>
				</Col>
				<Col className="header-control">
					<Space size="middle">
						<Tooltip title="AI Configuration Analyzer">
							<Button
								type="primary"
								icon={<RobotOutlined />}
								onClick={handleAIClick}
								style={{
									background: 'linear-gradient(90deg, #722ed1 0%, #1890ff 100%)',
									border: 'none',
									boxShadow: '0 2px 4px rgba(114, 46, 209, 0.3)',
								}}
							>
								AI Analyzer
							</Button>
						</Tooltip>
						{errorSummary && errorSummary.total_error > 0 && (
							<Tooltip title="View Error Summary">
								<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
									<button
										onClick={handleErrorBadgeClick}
										style={{
											position: 'relative',
											background: 'rgba(255, 77, 79, 0.1)',
											border: '1px solid rgba(255, 77, 79, 0.2)',
											borderRadius: 8,
											width: 32,
											height: 32,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
											transition: 'all 0.2s ease',
											outline: 'none'
										}}
										onMouseEnter={e => {
											e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)';
											e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.3)';
										}}
										onMouseLeave={e => {
											e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
											e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.2)';
										}}
									>
										<ExclamationCircleOutlined style={{ 
											fontSize: 16,
											color: '#ff4d4f'
										}} />
										{errorSummary.total_error > 0 && (
											<div style={{
												position: 'absolute',
												top: -4,
												right: -4,
												background: '#ff4d4f',
												color: 'white',
												minWidth: 16,
												height: 16,
												borderRadius: 8,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: 10,
												fontWeight: 600,
												padding: '0 4px',
												border: '1.5px solid white'
											}}>
												{errorSummary.total_error > 99 ? '99+' : errorSummary.total_error}
											</div>
										)}
									</button>
								</div>
							</Tooltip>
						)}
						<Dropdown menu={{ items }}>
							<Space>
								<Avatar style={{ cursor: 'pointer' }}>
									{userDetail.username.charAt(0).toUpperCase()}
								</Avatar>
								<span style={{ color: 'white', cursor: 'pointer' }}>
									{userDetail.username}
								</span>
							</Space>
						</Dropdown>
					</Space>
				</Col>
			</Row>
			
			<Modal
				title={
					<div style={{ 
						display: 'flex', 
						alignItems: 'center', 
						gap: 6,
						fontSize: 13
					}}>
						<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 14 }} />
						<span style={{ fontWeight: 600 }}>Configuration Errors</span>
						<span style={{
							background: '#ff4d4f',
							color: 'white',
							padding: '1px 6px',
							borderRadius: 8,
							fontSize: 10,
							fontWeight: 600
						}}>
							{errorSummary?.total_error}
						</span>
					</div>
				}
				open={isErrorModalOpen}
				onCancel={handleErrorModalClose}
				footer={null}
				width={380}
				styles={{ body: { padding: '12px' } }}
				style={{ top: 120 }}
			>
				{errorSummary && (
					<>
						<style dangerouslySetInnerHTML={{ __html: `
							.error-modal-scroll::-webkit-scrollbar {
								width: 6px;
							}
							.error-modal-scroll::-webkit-scrollbar-track {
								background: #f0f0f0;
								border-radius: 3px;
							}
							.error-modal-scroll::-webkit-scrollbar-thumb {
								background: #d9d9d9;
								border-radius: 3px;
							}
							.error-modal-scroll::-webkit-scrollbar-thumb:hover {
								background: #bfbfbf;
							}
						`}} />
						<div 
							className="error-modal-scroll"
							style={{ 
								display: 'flex', 
								flexDirection: 'column', 
								gap: 6,
								maxHeight: '400px',
								overflowY: 'auto',
								paddingRight: 4
							}}
						>
							{errorSummary.services.map((service: any) => {
							const statusColor = service.status === 'Critical' ? '#ff4d4f' : 
											   service.status === 'Error' ? '#ff7875' : '#faad14';
							
							return (
								<div 
									key={service.name}
									style={{
										background: '#fafafa',
										borderRadius: 6,
										padding: 8,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between'
									}}
								>
									<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										<div style={{
											minWidth: 20,
											height: 20,
											background: statusColor,
											borderRadius: 4,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'white',
											fontSize: 10,
											fontWeight: 600
										}}>
											{service.count}
										</div>
										<span style={{ 
											fontSize: 12, 
											color: '#262626'
										}}>
											{service.name}
										</span>
									</div>
									<span style={{
										color: statusColor,
										fontSize: 10,
										fontWeight: 600
									}}>
										{service.status}
									</span>
								</div>
							);
						})}
						</div>
					</>
				)}
			</Modal>
		</div>
	);
}

export default Header;