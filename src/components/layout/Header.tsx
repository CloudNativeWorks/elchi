// Header.tsx
import { useEffect } from "react";
import { Row, Col, Avatar, Space, Dropdown } from "antd";
import { useLogout } from "../../pages/auth/Logout";
import logoelchi from "../../assets/images/logo_white.png";
import { UserDetail } from "@/common/types";


interface HeaderProps {
	userDetail: UserDetail;
}

function Header({ userDetail }: Readonly<HeaderProps>) {
	const logout = useLogout();
	const items = [
		{
			onClick: logout,
			label: <b style={{ cursor: 'pointer' }}>Log out</b>,
			key: 'logout',
		},
	];

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
				</Col>
			</Row>
		</div>
	);
}

export default Header;