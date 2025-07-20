import React from "react";
import { Menu, Select } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { 
    HomeOutlined,
    RocketOutlined,
    GlobalOutlined,
    ShareAltOutlined,
    CloudOutlined,
    ClusterOutlined,
    AimOutlined,
    SafetyOutlined,
    KeyOutlined,
    FilterOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    FileTextOutlined,
    SettingOutlined,
    UserOutlined,
    BarChartOutlined
} from '@ant-design/icons';
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
		icon: "HomeOutlined",
		label: "Dashboard",
	},
	{
		key: "/quick_start",
		to: "/quick_start",
		icon: "RocketOutlined",
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
		icon: "GlobalOutlined",
		label: "Listener",
	},
	{
		key: "/resource/route",
		to: "/resource/route",
		icon: "ShareAltOutlined",
		label: "Route",
	},
	{
		key: "/resource/virtual_host",
		to: "/resource/virtual_host",
		icon: "CloudOutlined",
		label: "Virtual Host",
	},
	{
		key: "/resource/cluster",
		to: "/resource/cluster",
		icon: "ClusterOutlined",
		label: "Cluster",
	},
	{
		key: "/resource/endpoint",
		to: "/resource/endpoint",
		icon: "AimOutlined",
		label: "Endpoint",
	},
	{
		key: "/resource/tls",
		to: "/resource/tls",
		icon: "SafetyOutlined",
		label: "TLS",
	},
	{
		key: "/resource/secret",
		to: "/resource/secret",
		icon: "KeyOutlined",
		label: "Secret",
	},
	{
		key: "/filters",
		to: "/filters",
		icon: "FilterOutlined",
		label: "Filter",
	},
	{
		key: "/extensions",
		to: "/extensions",
		icon: "AppstoreOutlined",
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
		icon: "BarChartOutlined",
		label: "Metrics",
	},
	{
		key: "/Observability/logs",
		to: "/Observability/logs",
		icon: "FileTextOutlined",
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
		icon: "DashboardOutlined",
		label: "Bootstrap",
	},
	{
		key: "/services",
		to: "/services",
		icon: "AppstoreOutlined",
		label: "Services",
	},
	{
		key: "/clients",
		to: "/clients",
		icon: "UserOutlined",
		label: "Clients",
	},
	{
		key: "/settings",
		to: "/settings",
		icon: "SettingOutlined",
		label: "Settings",
	},
];

const iconMap = {
	HomeOutlined: HomeOutlined,
	RocketOutlined: RocketOutlined,
	GlobalOutlined: GlobalOutlined,
	ShareAltOutlined: ShareAltOutlined,
	CloudOutlined: CloudOutlined,
	ClusterOutlined: ClusterOutlined,
	AimOutlined: AimOutlined,
	SafetyOutlined: SafetyOutlined,
	KeyOutlined: KeyOutlined,
	FilterOutlined: FilterOutlined,
	AppstoreOutlined: AppstoreOutlined,
	DashboardOutlined: DashboardOutlined,
	FileTextOutlined: FileTextOutlined,
	SettingOutlined: SettingOutlined,
	UserOutlined: UserOutlined,
	BarChartOutlined: BarChartOutlined,
};

function Sidenav({ color, userDetail, collapsed }: Readonly<defaultProps>) {
	const { pathname } = useLocation();
	const page = pathname.replace("/", "");
	const { project, setProject } = useProjectVariable();

	const findBestMatchKey = (path: string) => {
		let bestMatch = "";
		menuConfig.forEach((item) => {
			if (path.startsWith(item.key) && item.key.length > bestMatch.length) {
				bestMatch = item.key;
			}
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
			boxShadow: collapsed ? '0 -4px 12px rgba(0, 0, 0, 0.1)' : 'none',
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
					paddingBottom: collapsed ? '80px' : '60px',
				}}
			/>
			<style>{`
				.ant-menu,
				.ant-menu * {
					font-family: 'Inter', 'Roboto', 'Segoe UI', 'SF Pro Display', 'Arial', sans-serif !important;
				}
				/* Collapsed menu specific styles */
				.ant-menu.ant-menu-inline.ant-menu-collapsed .ant-menu-item {
					padding: 8px !important;
					margin: 0 2px 4px 2px !important;
					min-height: 40px !important;
					justify-content: center !important;
					align-items: center !important;
					width: 40px !important;
					height: 40px !important;
					border-radius: 8px !important;
					background: transparent !important;
				}
				/* Override all collapsed menu styles with maximum specificity */
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item {
					padding: 8px !important;
					margin: 0 2px 4px 2px !important;
					min-height: 40px !important;
					justify-content: center !important;
					align-items: center !important;
					width: 40px !important;
					height: 40px !important;
					border-radius: 8px !important;
					background: transparent !important;
				}
				.ant-menu.ant-menu-inline.ant-menu-collapsed .ant-menu-item .icon {
					margin-right: 0 !important;
					font-size: 18px !important;
					min-width: 18px !important;
					min-height: 18px !important;
					justify-content: center !important;
					align-items: center !important;
					background: transparent !important;
					padding: 0 !important;
					border-radius: 0 !important;
					width: 18px !important;
					height: 18px !important;
					color: #2c3e50 !important;
				}
				/* Maximum specificity for collapsed icons */
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item span.icon {
					margin-right: 0 !important;
					font-size: 18px !important;
					min-width: 18px !important;
					min-height: 18px !important;
					justify-content: center !important;
					align-items: center !important;
					background: transparent !important;
					padding: 0 !important;
					border-radius: 0 !important;
					width: 18px !important;
					height: 18px !important;
					color: #2c3e50 !important;
					display: flex !important;
				}
				.ant-menu.ant-menu-inline.ant-menu-collapsed .ant-menu-item-selected {
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%) !important;
					box-shadow: 0 2px 8px rgba(5, 108, 205, 0.3) !important;
					margin-right: 0 !important;
					width: 40px !important;
					max-width: 40px !important;
					transform: none !important;
					border-radius: 8px !important;
				}
				/* Maximum specificity for collapsed selected items */
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item.ant-menu-item-selected {
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%) !important;
					box-shadow: 0 2px 8px rgba(5, 108, 205, 0.3) !important;
					margin-right: 0 !important;
					width: 40px !important;
					max-width: 40px !important;
					transform: none !important;
					border-radius: 8px !important;
					padding: 8px !important;
				}
				.ant-menu.ant-menu-inline.ant-menu-collapsed .ant-menu-item-selected .icon {
					background: transparent !important;
					color: white !important;
					padding: 0 !important;
					border-radius: 0 !important;
					backdrop-filter: none !important;
				}
				/* Maximum specificity for collapsed selected icons */
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item.ant-menu-item-selected span.icon {
					background: transparent !important;
					color: white !important;
					padding: 0 !important;
					border-radius: 0 !important;
					backdrop-filter: none !important;
					margin-right: 0 !important;
					font-size: 18px !important;
					min-width: 18px !important;
					min-height: 18px !important;
					width: 18px !important;
					height: 18px !important;
					display: flex !important;
					justify-content: center !important;
					align-items: center !important;
				}
				/* Override inline styles with maximum specificity */
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item.ant-menu-item-selected span.icon[style*="background"] {
					background: transparent !important;
				}
				div.ant-menu.ant-menu-inline.ant-menu-collapsed li.ant-menu-item span.icon[style*="background"] {
					background: transparent !important;
				}
				/* Force override all inline styles */
				.ant-menu-collapsed .ant-menu-item .icon[style] {
					background: transparent !important;
					padding: 0 !important;
					border-radius: 0 !important;
				}
				.ant-menu-collapsed .ant-menu-item-selected .icon[style] {
					background: transparent !important;
					color: white !important;
					padding: 0 !important;
					border-radius: 0 !important;
				}
				/* Nuclear option - override everything */
				.ant-menu-collapsed .ant-menu-item .icon {
					all: unset !important;
					display: flex !important;
					align-items: center !important;
					justify-content: center !important;
					font-size: 18px !important;
					width: 18px !important;
					height: 18px !important;
					color: #2c3e50 !important;
					background: transparent !important;
					padding: 0 !important;
					margin: 0 !important;
					border-radius: 0 !important;
				}
				/* Fix collapsed menu item width */
				.ant-menu-collapsed .ant-menu-item {
					width: 48px !important;
					min-width: 48px !important;
					max-width: 48px !important;
					min-height: 80px !important;
					height: 80px !important;
					padding: 12px 8px 32px 8px !important;
					margin: 0 4px 12px 4px !important;
					justify-content: flex-start !important;
					align-items: center !important;
					display: flex !important;
					flex-direction: column !important;
				}
				/* Force flex layout for collapsed items */
				.ant-menu-collapsed .ant-menu-item > a {
					display: flex !important;
					flex-direction: column !important;
					justify-content: flex-start !important;
					align-items: center !important;
					height: 100% !important;
					padding: 12px 8px 32px 8px !important;
					margin-bottom: 12px !important;
				}
				/* Add bottom margin to icon */
				.ant-menu-collapsed .ant-menu-item .icon {
					margin-bottom: 8px !important;
				}
				.ant-menu-collapsed .ant-menu-item-selected .icon {
					all: unset !important;
					display: flex !important;
					align-items: center !important;
					justify-content: center !important;
					font-size: 18px !important;
					width: 18px !important;
					height: 18px !important;
					color: white !important;
					background: transparent !important;
					padding: 0 !important;
					margin: 0 !important;
					border-radius: 0 !important;
				}
				/* Fix collapsed selected menu item width */
				.ant-menu-collapsed .ant-menu-item-selected {
					width: 48px !important;
					min-width: 48px !important;
					max-width: 48px !important;
					min-height: 80px !important;
					height: 80px !important;
					padding: 12px 8px 32px 8px !important;
					margin: 0 4px 12px 4px !important;
					justify-content: flex-start !important;
					align-items: center !important;
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%) !important;
					border-radius: 8px !important;
					display: flex !important;
					flex-direction: column !important;
				}
				/* Force flex layout for collapsed selected items */
				.ant-menu-collapsed .ant-menu-item-selected > a {
					display: flex !important;
					flex-direction: column !important;
					justify-content: flex-start !important;
					align-items: center !important;
					height: 100% !important;
					padding: 12px 8px 32px 8px !important;
				}
				.ant-menu-item {
					border-radius: 8px !important;
					margin: 0 4px 6px 4px !important;
					transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease !important;
					padding: 8px 12px !important;
					min-height: 48px !important;
					background: transparent !important;
					border: none !important;
					position: relative !important;
					overflow: hidden !important;
					transform: translateX(0) !important;
					opacity: 1 !important;
					visibility: visible !important;
					max-width: 48px !important;
				}

				.ant-menu-item-selected {
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%) !important;
					color: white !important;
					font-weight: 600 !important;
					box-shadow: 0 4px 12px rgba(5, 108, 205, 0.3) !important;
					transform: translateX(4px) !important;
					z-index: 1 !important;
					opacity: 1 !important;
					visibility: visible !important;
					margin-right: 12px !important;
					width: calc(100% - 12px) !important;
					max-width: calc(100% - 16px) !important;
				}

				.ant-menu-item:hover:not(.ant-menu-item-selected):not(.menu-item-header) {
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%) !important;
					color: white !important;
					transform: translateX(2px) !important;
					box-shadow: 0 2px 8px rgba(5, 108, 205, 0.3) !important;
					z-index: 0 !important;
					opacity: 1 !important;
					visibility: visible !important;
					margin-right: 12px !important;
					width: calc(100% - 12px) !important;
					max-width: calc(100% - 14px) !important;
				}

				.ant-menu-item:not(.ant-menu-item-selected):not(:hover) {
					background: transparent !important;
					color: #2c3e50 !important;
					transform: translateX(0) !important;
					box-shadow: none !important;
					opacity: 1 !important;
					visibility: visible !important;
					margin-right: 12px !important;
					width: calc(100% - 12px) !important;
					max-width: calc(100% - 14px) !important;
				}
				.ant-menu-item.menu-item-header:hover {
					background: transparent !important;
					color: #8b9dc3 !important;
					transform: translateX(0) !important;
					box-shadow: none !important;
					cursor: default !important;
				}
				.ant-menu-item.menu-item-header {
					pointer-events: none !important;
					cursor: default !important;
				}
				.ant-menu-item .icon {
					font-size: 16px !important;
					min-width: 16px;
					min-height: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 10px;
					transition: background 0.3s ease, color 0.3s ease, padding 0.3s ease !important;
					position: relative !important;
					color: #2c3e50 !important;
					background: transparent !important;
					padding: 0 !important;
					border-radius: 0 !important;
				}

				.ant-menu-item-selected .icon {
					background: rgba(255, 255, 255, 0.2) !important;
					color: white !important;
					padding: 6px !important;
					border-radius: 6px !important;
					backdrop-filter: blur(10px) !important;
				}
				.ant-menu-item:hover:not(.ant-menu-item-selected) .icon {
					background: rgba(255, 255, 255, 0.15) !important;
					color: white !important;
					padding: 6px !important;
					border-radius: 6px !important;
					backdrop-filter: blur(10px) !important;
				}
				.ant-menu-item:not(.ant-menu-item-selected):not(:hover) .icon {
					color: #2c3e50 !important;
					background: transparent !important;
					padding: 0 !important;
					border-radius: 0 !important;
				}
				.ant-menu-item .menu-label {
					font-weight: 500;
					letter-spacing: 0.3px;
					font-size: 13px;
					margin-left: 0;
					margin-right: 0;
					padding: 0;
					transition: color 0.3s ease, font-weight 0.3s ease !important;
					position: relative !important;
					color: #2c3e50 !important;
				}
				.ant-menu-item-selected .menu-label {
					font-weight: 600 !important;
					color: white !important;
				}
				.ant-menu-item:hover:not(.ant-menu-item-selected) .menu-label {
					color: white !important;
				}
				.ant-menu-item:not(.ant-menu-item-selected):not(:hover) .menu-label {
					color: #2c3e50 !important;
					font-weight: 500 !important;
				}
				.ant-menu-submenu-title, .ant-menu-submenu .menu-label {
					font-weight: 500 !important;
				}
				.menu-item-header {
					font-size: 11px !important;
					color: #8b9dc3 !important;
					font-weight: 600 !important;
					margin: 20px 0 8px 12px !important;
					letter-spacing: 1px !important;
					text-transform: uppercase !important;
					position: relative !important;
				}
				.menu-item-header::before {
					content: '';
					position: absolute;
					left: -8px;
					top: 50%;
					transform: translateY(-50%);
					width: 3px;
					height: 3px;
					background: linear-gradient(90deg, #056ccd 0%, #00c6fb 100%);
					border-radius: 50%;
				}
			`}</style>
		</div>
	);
}

export default Sidenav;
