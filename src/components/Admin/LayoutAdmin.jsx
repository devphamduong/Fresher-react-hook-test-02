import { AppstoreOutlined, BookOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, message } from "antd";
const { Header, Sider, Content, Footer } = Layout;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './LayoutAdmin.scss';
import { logout } from "../../services/api";
import { logoutAction } from "../../redux/account/accountSlice";
import { useEffect } from "react";

const LayoutAdmin = () => {
    const user = useSelector(state => state.account.user);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('/admin');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const itemsNav = [
        {
            label: <Link to={'/admin'}>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage users</span>,
            key: '/admin/user',
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
            key: '/admin/book',
            icon: <BookOutlined />
        },
        {
            label: <Link to={'/admin/order'}>Manage orders</Link>,
            key: '/admin/order',
            icon: <ShoppingCartOutlined />
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

    useEffect(() => {
        setActiveMenu(window.location.pathname);
    }, [window.location.pathname]);

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
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    style={{ borderInlineEnd: 'none' }}
                    items={itemsNav}
                    onClick={(e) => { setActiveMenu(e.key); }}
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