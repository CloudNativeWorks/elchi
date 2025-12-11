// Header.tsx
import { useEffect, useState } from "react";
import { Row, Col, Avatar, Space, Dropdown, Button, Tooltip, Badge, Input } from "antd";
import { RobotOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
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
	const [searchExpanded, setSearchExpanded] = useState(false);

	const { data: errorSummary } = useErrorSummary({
		project,
		enabled: !!project
	});

	const userMenuItems = [
		{
			key: 'profile',
			label: 'My Profile',
			onClick: () => navigate('/profile'),
		},
		{
			type: 'divider' as const,
		},
		{
			key: 'logout',
			label: 'Log out',
			onClick: logout,
		}
	];

	const handleAIClick = () => {
		navigate('/ai-analyzer');
	};

	const handleSearch = (value: string) => {
		if (value.trim()) {
			navigate(`/search?q=${encodeURIComponent(value.trim())}`);
		}
	};

	const errorMenuItems = errorSummary && errorSummary.total_error > 0 ? [
		{
			key: 'error-content',
			label: (
				<div style={{
					width: 320,
					margin: -12
				}}>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						fontSize: 13,
						marginTop: 12,
						marginBottom: 12,
						padding: '12px 16px',
						borderBottom: '1px solid #f0f0f0'
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
							{errorSummary.total_error}
						</span>
					</div>
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 6,
						height: 300,
						overflowY: 'auto',
						paddingRight: 4,
						padding: '0 16px 12px'
					}}>
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
										justifyContent: 'space-between',
										cursor: 'pointer',
										transition: 'background 0.2s'
									}}
									onClick={() => {
										navigate(`/services/${service.id}`);
									}}
									onMouseEnter={e => {
										e.currentTarget.style.background = '#f0f0f0';
									}}
									onMouseLeave={e => {
										e.currentTarget.style.background = '#fafafa';
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
				</div>
			),
			disabled: true,
			style: { cursor: 'default' }
		}
	] : [];

	useEffect(() => window.scrollTo(0, 0));

	return (
		<>
			<style>{`
				.error-dropdown-menu .ant-dropdown-menu-item {
					padding: 0 !important;
				}
				.error-dropdown-menu .ant-dropdown-menu-item:hover {
					background: transparent !important;
				}
				.header .ant-dropdown {
					top: 100% !important;
					margin-top: 4px !important;
				}
				.animated-search-container {
					display: flex;
					align-items: center;
					height: 32px;
				}
				.animated-search-input {
					width: 0;
					opacity: 0;
					transition: width 0.3s ease, opacity 0.3s ease;
					overflow: hidden;
					display: flex;
					align-items: center;
				}
				.animated-search-input.expanded {
					width: 280px;
					opacity: 1;
					margin-right: 8px;
				}
				.animated-search-input .ant-input {
					height: 32px;
					line-height: 32px;
				}
				.search-icon-button {
					background: rgba(255, 255, 255, 0.15) !important;
					border: 1px solid rgba(255, 255, 255, 0.3) !important;
					color: white !important;
					transition: all 0.3s ease !important;
				}
				.search-icon-button:hover {
					background: rgba(255, 255, 255, 0.25) !important;
					border-color: rgba(255, 255, 255, 0.5) !important;
					transform: scale(1.05);
				}
			`}</style>
			<div className="header" style={{ width: '100%', height: '100%', position: 'relative' }}>
				<Row justify="space-between" align="middle" style={{ width: '100%' }}>
					<Col>
						<div className="brand">
							<img src={logoelchi} alt="Logo" style={{ height: '40px' }} />
						</div>
					</Col>
					<Col className="header-control">
						<Space size="middle">
							<div
								className="animated-search-container"
								onMouseEnter={() => setSearchExpanded(true)}
								onMouseLeave={() => setSearchExpanded(false)}
							>
								<div className={`animated-search-input ${searchExpanded ? 'expanded' : ''}`}>
									<Input
										placeholder="Search domains or IPs..."
										onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
										allowClear
										size="middle"
										style={{ width: '100%' }}
									/>
								</div>
								<Tooltip title="Search Resources">
									<Button
										className="search-icon-button"
										icon={<SearchOutlined />}
										size="middle"
										onClick={() => navigate('/search')}
									/>
								</Tooltip>
							</div>
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
								<Dropdown
									menu={{
										items: errorMenuItems,
										className: 'error-dropdown-menu'
									}}
									trigger={['click']}
									placement="bottomRight"
									arrow={{ pointAtCenter: true }}
														getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
								>
									<Badge count={errorSummary.total_error > 99 ? '99+' : errorSummary.total_error} size="small">
										<Button
											icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
											style={{
												background: 'rgba(255, 77, 79, 0.1)',
												border: '1px solid rgba(255, 77, 79, 0.2)',
												borderRadius: 8,
												width: 32,
												height: 32,
												padding: 0,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										/>
									</Badge>
								</Dropdown>
							)}
							<Dropdown
								menu={{ items: userMenuItems }}
								trigger={['click']}
								placement="bottomRight"
								arrow={{ pointAtCenter: true }}
								getPopupContainer={(triggerNode) => triggerNode.parentElement as HTMLElement}
							>
								<Space style={{ cursor: 'pointer' }}>
									<Avatar>
										{userDetail.username.charAt(0).toUpperCase()}
									</Avatar>
									<span style={{ color: 'white' }}>
										{userDetail.username}
									</span>
								</Space>
							</Dropdown>
						</Space>
					</Col>
				</Row>
			</div>
		</>
	);
}

export default Header;