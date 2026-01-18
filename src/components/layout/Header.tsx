// Header.tsx
import { useEffect, useState } from "react";
import { Row, Col, Avatar, Space, Dropdown, Button, Tooltip, Badge, Input } from "antd";
import { RobotOutlined, ExclamationCircleOutlined, SearchOutlined, SunOutlined, MoonOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../pages/auth/Logout";
import logoelchi from "../../assets/images/logo_white.png";
import { UserDetail } from "@/common/types";
import { useErrorSummary } from "@/hooks/useErrorSummary";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useTheme } from "@/contexts/ThemeContext";


interface HeaderProps {
	userDetail: UserDetail;
}

function Header({ userDetail }: Readonly<HeaderProps>) {
	const logout = useLogout();
	const navigate = useNavigate();
	const { project } = useProjectVariable();
	const [searchExpanded, setSearchExpanded] = useState(false);
	const { isDark, toggleTheme } = useTheme();

	const { data: errorSummary } = useErrorSummary({
		project,
		enabled: !!project
	});

	const userMenuItems = [
		{
			key: 'profile',
			label: 'My Profile',
			icon: <UserOutlined />,
			onClick: () => navigate('/profile'),
		},
		{
			type: 'divider' as const,
		},
		{
			key: 'logout',
			label: 'Log out',
			icon: <LogoutOutlined />,
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
						borderBottom: '1px solid var(--border-default)'
					}}>
						<ExclamationCircleOutlined style={{ color: 'var(--color-danger)', fontSize: 14 }} />
						<span style={{ fontWeight: 600 }}>Configuration Errors</span>
						<span style={{
							background: 'var(--color-danger)',
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
							const statusColor = service.status === 'Critical' ? 'var(--color-danger)' :
								service.status === 'Error' ? 'var(--color-danger)' : 'var(--color-warning)';

							return (
								<div
									key={service.name}
									style={{
										background: 'var(--bg-hover)',
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
										e.currentTarget.style.background = 'var(--bg-active)';
									}}
									onMouseLeave={e => {
										e.currentTarget.style.background = 'var(--bg-hover)';
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
											color: 'var(--text-primary)'
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
					width: 32px !important;
					height: 32px !important;
					padding: 0 !important;
					display: flex !important;
					alignItems: center !important;
					justifyContent: center !important;
					border-radius: 8px !important;
					transition: all 0.3s ease !important;
				}
				.search-icon-button:hover {
					background: rgba(255, 255, 255, 0.25) !important;
					border-color: rgba(255, 255, 255, 0.5) !important;
					transform: translateY(-1px);
				}
				.search-icon-button .anticon {
					font-size: 16px;
				}
				.ai-analyzer-button {
					height: 32px !important;
					border-radius: 8px !important;
					background: linear-gradient(90deg, #722ed1 0%, #1890ff 100%) !important;
					border: none !important;
					box-shadow: 0 2px 4px rgba(114, 46, 209, 0.3) !important;
					display: flex !important;
					align-items: center !important;
					padding: 0 12px !important;
					transition: all 0.3s ease !important;
				}
				.ai-analyzer-button:hover {
					transform: translateY(-1px);
					box-shadow: 0 4px 8px rgba(114, 46, 209, 0.4) !important;
					filter: brightness(1.1);
				}
				.theme-toggle-button {
					background: rgba(255, 255, 255, 0.15) !important;
					border: 1px solid rgba(255, 255, 255, 0.3) !important;
					color: white !important;
					width: 32px !important;
					height: 32px !important;
					padding: 0 !important;
					display: flex !important;
					align-items: center !important;
					justifyContent: center !important;
					border-radius: 8px !important;
					transition: all 0.3s ease !important;
				}
				.theme-toggle-button:hover {
					background: rgba(255, 255, 255, 0.25) !important;
					border-color: rgba(255, 255, 255, 0.5) !important;
					transform: translateY(-1px);
				}
				.theme-toggle-button .anticon {
					font-size: 16px;
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
									className="ai-analyzer-button"
									icon={<RobotOutlined style={{ fontSize: 16 }} />}
									onClick={handleAIClick}
								>
									AI Analyzer
								</Button>
							</Tooltip>
							<Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
								<Button
									className="theme-toggle-button"
									icon={isDark ? <SunOutlined /> : <MoonOutlined />}
									onClick={toggleTheme}
								/>
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