import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, App as AntdApp } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Sidenav from "./Sidenav";
import Header from "./Header";
import { DecodeToken } from "@utils/tools";
import Cookies from 'js-cookie';
import BreadCrumb from "./BreadCrumb";
import { useTheme } from "@/contexts/ThemeContext";

const { Header: AntHeader, Content, Sider } = Layout;
function Main() {
	const sidenavColor = "var(--color-primary)"
	const location = useLocation();
	const userDetail = DecodeToken(Cookies.get('bb_token'))
	const { notification } = AntdApp.useApp();
	const { isDark } = useTheme();
	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const [collapsed, setCollapsed] = useState(() => {
		const domainKey = window.location.hostname;
		const savedMenuCollapsed = localStorage.getItem(`menuCollapsed-${domainKey}`);
		return savedMenuCollapsed === 'true';
	});
	const [demoWarningShown, setDemoWarningShown] = useState(false);
	// Removed checkExpiry - let API interceptor handle token refresh
	// Token expiry should be handled by API calls, not by a timer
	
	useEffect(() => {
		const domainKey = window.location.hostname;
		localStorage.setItem(`menuCollapsed-${domainKey}`, collapsed.toString());
	}, [collapsed]);

	useEffect(() => {
		if (window.APP_CONFIG?.ENABLE_DEMO && !demoWarningShown) {
			notification.warning({
				key: 'demo-warning', // Unique key to prevent duplicates
				message: 'Demo Environment Warning',
				description: 'Please do not use your sensitive valuable resources (Certificate, Keys, etc.).',
				placement: 'bottomRight',
				duration: 0, // Don't auto-close
				onClose: () => {
					setDemoWarningShown(true);
				},
				style: {
					width: 400,
				}
			});
		}
	}, [demoWarningShown]);

	useEffect(() => {
		return () => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
				timeoutId.current = null;
			}
		};
	}, []);

	return (
		<div className="App">
			<Layout style={{ minHeight: '100vh' }}>
				<AntHeader className="main-header">
					<Header userDetail={userDetail} />
				</AntHeader>
				<Layout>
					<div className="content-wrapper">
						<Sider
							key={`sider-${isDark ? 'dark' : 'light'}`}
							collapsedWidth={70}
							theme={isDark ? "dark" : "light"}
							collapsible={true}
							collapsed={collapsed}
							onCollapse={(value) => setCollapsed(value)}
							trigger={
								<div
									className="sidebar-collapse-trigger"
									style={{
										position: 'absolute',
										bottom: 20,
										left: '50%',
										transform: 'translateX(-50%)',
										width: 36,
										height: 36,
										background: 'var(--gradient-primary)',
										borderRadius: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer',
										boxShadow: '0 4px 12px var(--shadow-color)',
										transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
										zIndex: 9999,
										border: 'none',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)';
										e.currentTarget.style.boxShadow = '0 6px 20px var(--shadow-color)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
										e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
									}}
								>
									{collapsed ? (
										<MenuUnfoldOutlined style={{
											color: 'white',
											fontSize: 16,
											transition: 'transform 0.3s ease'
										}} />
									) : (
										<MenuFoldOutlined style={{
											color: 'white',
											fontSize: 16,
											transition: 'transform 0.3s ease'
										}} />
									)}
								</div>
							}
							className="main-menu"
						>
							<Sidenav color={sidenavColor} collapsed={collapsed} userDetail={userDetail} />
						</Sider>
						<Layout className="main-content">
							<BreadCrumb
								name={location.pathname.replace("/", "") === "" ? "" : location.pathname.replace("/", "").charAt(0).toUpperCase() + location.pathname.replace("/", "").slice(1)}
							/>
							<Content style={{ padding: '6px' }}>
								<Outlet />
							</Content>
							{/* <Footer /> */}
						</Layout>
					</div>
				</Layout>
			</Layout>
		</div>
	);
}

export default Main;
