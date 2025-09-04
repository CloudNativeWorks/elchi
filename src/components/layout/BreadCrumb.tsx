import { Breadcrumb, Col, Divider } from "antd";
import { HomeOutlined } from '@ant-design/icons';

type defaultProps = {
    name: string;
};

function BreadCrumb({ name }: Readonly<defaultProps>) {
    const arrayNames = name && typeof name === 'string' ? name.split('/') : [];
    let currentPath = '';

    const capitalizeWords = (str: string) => {
        return str
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const generatedBreadcrumbItems = arrayNames.map(item => {
        currentPath += "/" + item.toLowerCase();

        const displayName = capitalizeWords(item);

        return {
            title: displayName,
            href: `#${currentPath}`
        };
    });

    const breadcrumbItems = [
        {
            href: '/',
            title: <HomeOutlined />,
        },
        ...generatedBreadcrumbItems
    ];

    return (
        <>
            <Col md={14} style={{ maxHeight: 30, marginLeft: 10 }}>
                <Breadcrumb items={breadcrumbItems} />
            </Col>
            <Divider style={{ marginTop: -8, marginBottom: 5 }} />
        </>
    );
}

export default BreadCrumb;