import { useEffect, useCallback, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, Layout } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
import { DecodeToken } from "@utils/tools";
import Cookies from 'js-cookie';
import BreadCrumb from "./BreadCrumb";

const { Header: AntHeader, Content, Sider } = Layout;
function Main() {
	const navigate = useNavigate();
	const sidenavColor = "#1890ff"
	const location = useLocation();
	const userDetail = DecodeToken(Cookies.get('bb_token'))
	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const [collapsed, setCollapsed] = useState(
		localStorage.getItem('menuCollapsed') === 'true'
	);
	const checkExpiry = useCallback(() => {
		const timeRemaining = Math.floor(((userDetail?.exp * 1000) - new Date().getTime()) / 1000);

		if (timeRemaining <= 0) {
			Cookies.remove('bb_token');
			navigate('/login');
		}
	}, [navigate, userDetail]);

	useEffect(() => {
		localStorage.setItem('menuCollapsed', collapsed.toString());
	}, [collapsed]);


	useEffect(() => {
		const intervalId = setInterval(checkExpiry, 10000);

		return () => {
			clearInterval(intervalId);
		};
	}, [checkExpiry]);

	useEffect(() => {
		return () => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
				timeoutId.current = null;
			}
		};
	}, []);

	/* function handleCollapse() {
		const newCollapsedState = !collapsed;
		setCollapsed(newCollapsedState);
		localStorage.setItem('menuCollapsed', newCollapsedState.toString());
	} */

	return (
		<div className="App">
			<Layout style={{ minHeight: '100vh' }}>
				<AntHeader className="main-header">
					<Header userDetail={userDetail} />
				</AntHeader>
				{window.APP_CONFIG?.ENABLE_DEMO &&
					<Alert
						message="Warning"
						description="Please do not use your sensitive valuable resources (Certificate, Keys, etc.). All resources will be deleted along with your user after 24 hours."
						type="warning"
						showIcon
						closable
					/>
				}
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
							<Content>
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
