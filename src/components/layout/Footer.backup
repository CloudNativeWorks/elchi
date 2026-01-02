import { Layout } from "antd";
import { Link } from "react-router-dom";

function Footer() {
	const { Footer: AntFooter } = Layout;
	const paddingVertical = 7;
	const footerHeight = 'auto';

	return (
		<AntFooter style={{
			background: "linear-gradient(to left, rgba(255,255,255,0), #1990FF, rgba(255,255,255,0))",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: `${paddingVertical}px 0`,
			height: footerHeight,
			marginTop: 20,
		}}>
			<div style={{
				textAlign: "center",
			}}>
				© 2024, made by
				<Link to="https://elchi.io" style={{ fontWeight: 900, fontSize: 14, margin: '0 4px' }}>
					elchi.io
				</Link>
			</div>
		</AntFooter>
	);
}

export default Footer;
