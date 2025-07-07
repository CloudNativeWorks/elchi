import React from "react";
import { Menu, Select } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { LSVG, RSVG, FSVG, ESVG, CSVG, HOMESVG, BSVG, SCRTSVG, VSVG, EXSVG, SETSVG, TSVG, QSSVG, SVCSVG, CLNTSVG, OMSVG, OLSVG } from '@/assets/svg/letter'
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { UserDetail } from "@/common/types";


type defaultProps = {
	color: string;
	userDetail: UserDetail;
	collapsed: boolean;
}

const menuConfig = [
	{
		key: "/home",
		to: "/",
		icon: "HOMESVG",
		label: "Dashboard",
	},
	{
		key: "/quick_start",
		to: "/quick_start",
		icon: "QSSVG",
		label: "Quick Start",
	},
	{
		key: "/Resources",
		to: "#",
		label: "Resources",
		className: 'menu-item-header',
	},
	{
		key: "/resource/listener",
		to: "/resource/listener",
		icon: "LSVG",
		label: "Listener",
	},
	{
		key: "/resource/route",
		to: "/resource/route",
		icon: "RSVG",
		label: "Route",
	},
	{
		key: "/resource/virtual_host",
		to: "/resource/virtual_host",
		icon: "VSVG",
		label: "Virtual Host",
	},
	{
		key: "/resource/cluster",
		to: "/resource/cluster",
		icon: "CSVG",
		label: "Cluster",
	},
	{
		key: "/resource/endpoint",
		to: "/resource/endpoint",
		icon: "ESVG",
		label: "Endpoint",
	},
	{
		key: "/resource/tls",
		to: "/resource/tls",
		icon: "TSVG",
		label: "TLS",
	},
	{
		key: "/resource/secret",
		to: "/resource/secret",
		icon: "SCRTSVG",
		label: "Secret",
	},
	{
		key: "/filters",
		to: "/filters",
		icon: "FSVG",
		label: "Filter",
	},
	{
		key: "/extensions",
		to: "/extensions",
		icon: "EXSVG",
		label: "Extension",
	},
	{
		key: "/observability",
		to: "#",
		label: "Observability",
		className: 'menu-item-header',
	},
	{
		key: "/Observability/metrics",
		to: "/Observability/metrics",
		icon: "OMSVG",
		label: "Metrics",
	},
	{
		key: "/Observability/logs",
		to: "/Observability/logs",
		icon: "OLSVG",
		label: "Logs",
	},
	{
		key: "/Administration",
		to: "#",
		label: "Administration",
		className: 'menu-item-header',
	},
	{
		key: "/resource/bootstrap",
		to: "/resource/bootstrap",
		icon: "BSVG",
		label: "Bootstrap",
	},
	{
		key: "/services",
		to: "/services",
		icon: "SVCSVG",
		label: "Services",
	},
	{
		key: "/clients",
		to: "/clients",
		icon: "CLNTSVG",
		label: "Clients",
	},
	{
		key: "/settings",
		to: "/settings",
		icon: "SETSVG",
		label: "Settings",
		items: [
			{
				"key": "/settings/users",
				"to": "/settings/users",
				"label": "Users"
			},
			{
				"key": "/settings/groups",
				"to": "/settings/groups",
				"label": "Groups"
			},
			{
				"key": "/settings/projects",
				"to": "/settings/projects",
				"label": "Projects"
			}
		]
	},
];

const iconMap = {
	FSVG: FSVG,
	HOMESVG: HOMESVG,
	LSVG: LSVG,
	RSVG: RSVG,
	CSVG: CSVG,
	ESVG: ESVG,
	SCRTSVG: SCRTSVG,
	BSVG: BSVG,
	VSVG: VSVG,
	EXSVG: EXSVG,
	SETSVG: SETSVG,
	TSVG: TSVG,
	QSSVG: QSSVG,
	SVCSVG: SVCSVG,
	CLNTSVG: CLNTSVG,
	OMSVG: OMSVG,
	OLSVG: OLSVG,
};

function Sidenav({ color, userDetail, collapsed }: Readonly<defaultProps>) {
	const { pathname } = useLocation();
	const page = pathname.replace("/", "");
	const { project, setProject } = useProjectVariable();

	const findBestMatchKey = (path) => {
		let bestMatch = "";
		menuConfig.forEach((item) => {
			if (path.startsWith(item.key) && item.key.length > bestMatch.length) {
				bestMatch = item.key;
			}
			item.items?.forEach((subItem) => {
				if (path.startsWith(subItem.key) && subItem.key.length > bestMatch.length) {
					bestMatch = subItem.key;
				}
			});
		});
		return bestMatch;
	};

	const options = userDetail.projects?.map((item: any) => ({
		label: item.projectname,
		value: item.project_id,
	}));

	const selectedKey = findBestMatchKey(pathname);
	const createMenuItemsFromJson = (items: any[]) => items
		.map((item) => {
			const isActive = page.startsWith(item.key.replace("/", ""));
			const itemStyle = isActive ? { background: color } : {};
			const itemClassName = `icon ${isActive ? 'active' : ''}`;

			if (item.key.startsWith("/settings") && !["owner", "admin"].includes(userDetail.role)) {
				return null;
			}

			if (item.items && item.items.length > 0) {
				return {
					key: item.key,
					icon: (
						<NavLink to={item.to}>
							{item.icon && React.createElement(iconMap[item.icon], { style: itemStyle, className: itemClassName })}
							<span className="menu-label">{item.label}</span>
						</NavLink>
					),
					children: createMenuItemsFromJson(item.items),
					className: item.className,
				};
			}

			return {
				key: item.key,
				icon: (
					<NavLink to={item.to}>
						{item.icon && React.createElement(iconMap[item.icon], { style: itemStyle, className: itemClassName })}
						<span className="menu-label">{item.label}</span>
					</NavLink>
				),
				className: item.className,
				title: item.label
			};
		})
		.filter(Boolean);

	return (
		<div style={{
			background: '#fff',
			borderRadius: 0,
			boxShadow: 'none',
			padding: collapsed ? '4px 0' : '10px 0 10px 0',
			margin: 0,
			minHeight: '100vh',
			height: '100vh',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'stretch',
			border: 'none',
			transition: 'all 0.2s',
			fontFamily: "'Inter', 'Roboto', 'Segoe UI', 'SF Pro Display', 'Arial', sans-serif"
		}}>
			{!collapsed &&
				<div style={{ display: "flex", justifyContent: "center", padding: "0 10px", marginBottom: "18px", marginTop: "10px" }}>
					<Select
						title="Project"
						placeholder="Project"
						optionFilterProp="label"
						style={{ width: "100%", paddingRight: 0, borderRadius: 10, background: '#fff', boxShadow: '0 2px 8px 0 rgba(24,144,255,0.04)' }}
						value={project}
						onChange={(value) => { setProject(value) }}
						options={[
							{
								label: <span style={{ fontWeight: 700, letterSpacing: 1 }}>Project</span>,
								title: 'Project',
								options: options,
							},
						]}
					/>
				</div>
			}
			<Menu
				mode="inline"
				theme="light"
				items={createMenuItemsFromJson(menuConfig)}
				selectedKeys={[selectedKey]}
				key={"menu"}
				defaultSelectedKeys={['/home']}
				style={{
					background: 'transparent',
					border: 'none',
					fontWeight: 600,
					fontSize: 15,
					letterSpacing: 0.5,
					padding: 0,
				}}
			/>
			<style>{`
				.ant-menu,
				.ant-menu * {
					font-family: 'Inter', 'Roboto', 'Segoe UI', 'SF Pro Display', 'Arial', sans-serif !important;
				}
				.ant-menu-item {
					border-radius: 6px !important;
					margin: 0 2px 4px 2px !important;
					transition: background 0.15s, color 0.15s;
					padding-top: 2px !important;
					padding-bottom: 2px !important;
					min-height: 32px !important;
					background: transparent !important;
				}
				.ant-menu-item-selected {
					background: #e6f7ff !important;
					border-left: 3px solid #1890ff !important;
					color: #1890ff !important;
					font-weight: 500 !important;
					box-shadow: none;
				}
				.ant-menu-item:hover {
					background: #f0f5ff !important;
					color: #1890ff !important;
				}
				.ant-menu-item .icon {
					font-size: 15px !important;
					min-width: 15px;
					min-height: 15px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 7px;
				}
				.ant-menu-item-selected .icon {
					background: none;
					color: #1890ff !important;
				}
				.ant-menu-item .menu-label {
					font-weight: 400;
					letter-spacing: 0px;
					font-size: 12.5px;
					margin-left: 0;
					margin-right: 0;
					padding: 0;
				}
				.ant-menu-submenu-title, .ant-menu-submenu .menu-label {
					font-weight: 400 !important;
				}
				.menu-item-header {
					font-size: 10.5px !important;
					color: #bfbfbf !important;
					font-weight: 400 !important;
					margin: 14px 0 4px 8px !important;
					letter-spacing: 0px;
				}
			`}</style>
		</div>
	);
}

export default Sidenav;
