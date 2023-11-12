import './Header.scss';
import { Avatar, Badge, Button, Col, Divider, Drawer, Dropdown, Input, Popover, Row, Space, Typography, message } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, BarsOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/api';
import { logoutAction } from '../../redux/account/accountSlice';
import { FaReact } from 'react-icons/fa';

function Header(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.orders.carts);
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
            }];

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
                        <Badge count={carts?.length ?? 0} showZero>
                            <Popover content={
                                carts?.length > 0 ?
                                    <>
                                        {carts.map((item, index) => {
                                            return (
                                                <Row align={'middle'}>
                                                    <Col span={4}>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} alt="" width={50} height={50} />
                                                    </Col>
                                                    <Col span={16}>
                                                        <Typography.Text ellipsis>{item.detail.mainText}</Typography.Text>
                                                    </Col>
                                                    <Col span={4} style={{ textAlign: 'end' }}>
                                                        <div style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price ?? 0)}</div>
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                        <div style={{ display: 'flex', justifyContent: 'end' }}><Button className='button button-buy' style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/order')}>View Cart</Button></div>
                                    </>
                                    :
                                    <>No Product</>
                            } title="Recent added product" placement="bottom">
                                <ShoppingCartOutlined className='cart-icon' />
                            </Popover>
                        </Badge>
                    </Col>
                    <Col span={0} md={12} className="settings">
                        {isAuthenticated
                            ? <Dropdown menu={{ items }} trigger={['click']} arrow>
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