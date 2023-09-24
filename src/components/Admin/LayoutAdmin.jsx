import { AppstoreOutlined, BookOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space } from "antd";
const { Header, Sider, Content, Footer } = Layout;
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import './LayoutAdmin.scss';

const LayoutAdmin = () => {
    const user = useSelector(state => state.account.user);
    const [collapsed, setCollapsed] = useState(false);

    const itemsNav = [
        {
            label: <Link to={'/admin'}>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage users</span>,
            key: 'manageUsers',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to={'/admin/user'}>CRUD</Link>,
                    key: 'crud',
                    icon: <AppstoreOutlined />
                }
            ]
        },
        {
            label: <Link to={'/admin/book'}>Manage books</Link>,
            key: 'manageBooks',
            icon: <BookOutlined />
        },
    ];

    const itemsDrop = [
        {
            label: 'Manage account',
            key: '0',
        },
        {
            label: 'Log out',
            key: '1',
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            <Sider
                theme="light"
                breakpoint="lg"
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div style={{ height: 32, margin: 16, textAlign: 'center' }} >Admin</div>
                <Menu
                    defaultSelectedKeys={['dashboard']}
                    mode="inline"
                    items={itemsNav}
                />
            </Sider>
            <Layout>
                <Header className="admin-header">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px'
                        }}
                    />
                    <Dropdown menu={{ items: itemsDrop }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                {user.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    React Test Fresher ©2023 Created DuongPC
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;