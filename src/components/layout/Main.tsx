import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, App as AntdApp } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
import { DecodeToken } from "@utils/tools";
import Cookies from 'js-cookie';
import BreadCrumb from "./BreadCrumb";

const { Header: AntHeader, Content, Sider } = Layout;
function Main() {
	const sidenavColor = "#1890ff"
	const location = useLocation();
	const userDetail = DecodeToken(Cookies.get('bb_token'))
	const { notification } = AntdApp.useApp();
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
							collapsedWidth={70}
							theme="light"
							collapsible={true}
							collapsed={collapsed}
							onCollapse={(value) => setCollapsed(value)}
							trigger={
								<div style={{
									position: 'absolute',
									bottom: 16,
									left: '50%',
									transform: 'translateX(-50%)',
									width: 32,
									height: 32,
									background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
									borderRadius: '20%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									boxShadow: '0 2px 8px rgba(5, 108, 205, 0.3), 0 -4px 12px rgba(0, 0, 0, 0.1)',
									transition: 'all 0.3s ease',
									zIndex: 9999,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
									e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 108, 205, 0.4), 0 -6px 16px rgba(0, 0, 0, 0.15)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
									e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 108, 205, 0.3), 0 -4px 12px rgba(0, 0, 0, 0.1)';
								}}
								>
									<div style={{
										width: 12,
										height: 12,
										border: '2px solid white',
										borderTop: 'none',
										borderRight: 'none',
										transform: collapsed ? 'rotate(-135deg)' : 'rotate(45deg)',
										transition: 'transform 0.3s ease',
									}} />
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
