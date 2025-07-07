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
							collapsedWidth={50}
							theme="light"
							collapsible={true}
							collapsed={collapsed}
							onCollapse={(value) => setCollapsed(value)}
							trigger={null}
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
