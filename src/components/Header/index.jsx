import './Header.scss';
import { Avatar, Badge, Col, Divider, Drawer, Dropdown, Input, Row, Space, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, SmileTwoTone, BarsOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/api';
import { logoutAction } from '../../redux/account/accountSlice';
import { FaReact } from 'react-icons/fa';

function Header(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items =
        user.role === "ADMIN"
            ?
            [{
                label: <div onClick={() => navigate('/admin')}>Admin</div>,
                key: '0',
            },
            {
                label: <div>Manage account</div>,
                key: '1',
            },
            {
                label: <div onClick={() => handleLogout()}>Log out</div>,
                key: '2',
            }]
            :
            [{
                label: <div>Manage account</div>,
                key: '0',
            },
            {
                label: <div onClick={() => handleLogout()}>Log out</div>,
                key: '1',
            }
            ];

    const onClose = () => {
        setOpen(false);
    };

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
        <Row className='header-container'>
            <Col className='drawer' span={4} md={0}>
                <BarsOutlined onClick={() => setOpen(true)} className='drawer-icon' />
                <Drawer
                    title="Menu"
                    placement={'left'}
                    width={500}
                    onClose={onClose}
                    open={open}
                >
                    {isAuthenticated
                        ?
                        <>
                            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>Admin</div>
                            <Divider />
                            <div style={{ cursor: 'pointer' }} >Manage account</div>
                            <Divider />
                            <div style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Log out</div>
                            <Divider />
                        </>
                        :
                        <>
                            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Log In</span>
                            <Divider />
                        </>
                    }
                </Drawer>
            </Col>
            <Col span={0} md={6} className="logo">
                <Row justify={'center'}>
                    <Col>
                        <FaReact className='logo-icon' />
                    </Col>
                    <Col>
                        <span className='logo-name'>DuongPC</span>
                    </Col>
                </Row>
            </Col>
            <Col span={16} md={12}>
                <Input className='search'
                    placeholder="What do you have in mind?"
                    prefix={<SearchOutlined className='search-icon' />}
                />
            </Col>
            <Col span={4} md={6}>
                <Row className="others">
                    <Col span={24} md={12} className="cart">
                        <Badge count={5}>
                            <ShoppingCartOutlined className='cart-icon' />
                        </Badge>
                    </Col>
                    <Col span={0} md={12} className="settings">
                        {isAuthenticated
                            ? <Dropdown menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar src={urlAvatar} />{user.fullName}
                                    </Space>
                                </a>
                            </Dropdown>
                            : <Link to={'/login'}>
                                Log In
                            </Link>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Header;