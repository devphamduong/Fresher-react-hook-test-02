import { AppstoreOutlined, BookOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, message } from "antd";
const { Header, Sider, Content, Footer } = Layout;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './LayoutAdmin.scss';
import { logout } from "../../services/api";
import { logoutAction } from "../../redux/account/accountSlice";

const LayoutAdmin = () => {
    const user = useSelector(state => state.account.user);
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            label: <div onClick={() => navigate('/')}>Home</div>,
            key: '0',
        },
        {
            label: <span>Manage account</span>,
            key: '1',
        },
        {
            label: <div onClick={() => handleLogout()}>Log out</div>,
            key: '2',
        }
    ];

    const handleLogout = async () => {
        const res = await logout();
        if (res && res.data) {
            dispatch(logoutAction());
            message.success('Logout successfully');
            navigate('/');
        }
    };

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`;

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
                    <Dropdown menu={{ items: itemsDrop }} trigger={['click']} arrow>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={urlAvatar} />{user.fullName}
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content className="admin-content">
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