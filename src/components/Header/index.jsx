import './Header.scss';
import { Badge, Col, Divider, Drawer, Dropdown, Input, Row, Space } from 'antd';
import { DownOutlined, SearchOutlined, ShoppingCartOutlined, SmileTwoTone, BarsOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const [open, setOpen] = useState(false);
    const items = [
        {
            label: 'Manage account',
            key: '0',
        },
        {
            label: 'Log out',
            key: '1',
        }
    ];

    const onClose = () => {
        setOpen(false);
    };

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
                    <p>Manage account</p>
                    <Divider />
                    <p>Log out</p>
                    <Divider />
                </Drawer>
            </Col>
            <Col span={0} md={6} className="logo">
                <Row justify={'center'}>
                    <Col>
                        <SmileTwoTone className='logo-icon' />
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
                                        {user.fullName}
                                        <DownOutlined />
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