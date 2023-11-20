import './Header.scss';
import { Avatar, Badge, Button, Col, Divider, Drawer, Dropdown, Form, Image, Input, Modal, Popover, Row, Space, Tabs, Typography, Upload, message, notification } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, BarsOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, logout, updateInfo, uploadAvatar } from '../../services/api';
import { logoutAction, updateUserAvatar, updateUserInfo } from '../../redux/account/accountSlice';
import { FaReact } from 'react-icons/fa';

function Header(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.orders.carts);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const items =
        user.role === "ADMIN"
            ?
            [{
                label: <div onClick={() => navigate('/admin')}>Admin</div>,
                key: '0',
            },
            {
                label: <div onClick={showModal}>Manage account</div>,
                key: '1',
            },
            {
                label: <div onClick={() => navigate('/order-history')}>Order history</div>,
                key: '2'
            },
            {
                label: <div onClick={() => handleLogout()}>Log out</div>,
                key: '3',
            }]
            :
            [{
                label: <div onClick={showModal}>Manage account</div>,
                key: '0',
            },
            {
                label: <div onClick={() => navigate('/order-history')}>Order history</div>,
                key: '1'
            },
            {
                label: <div onClick={() => handleLogout()}>Log out</div>,
                key: '2',
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

    const onFinish = async (values, type) => {
        if (type === 'info') {
            let data = {
                fullName: values.fullName,
                phone: values.phone,
                avatar: userAvatar,
                _id: user.id
            };
            let res = await updateInfo(data);
            if (res && res.data) {
                dispatch(updateUserInfo({ avatar: userAvatar ? userAvatar : user.avatar, phone: values.phone, fullName: values.fullName }));
                message.success('Updated info successfully');
                localStorage.removeItem('access_token');
            } else {
                notification.error({
                    message: 'An error occurred',
                    description: res.message,
                    duration: 5
                });
            }
        }
        if (type === 'password') {
            let data = {
                email: values.emailPass,
                oldpass: values.oldpass,
                newpass: values.newpass,
            };
            let res = await changePassword(data);
            if (res && res.statusCode !== 400) {
                form.setFieldValue('oldpass', '');
                form.setFieldValue('newpass', '');
                message.success('Changed password successfully');
            } else {
                notification.error({
                    message: 'An error occurred',
                    description: res.message,
                    duration: 5
                });
            }
        }
    };

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        let res = await uploadAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            dispatch(updateUserAvatar(newAvatar));
            setUserAvatar(newAvatar);
            onSuccess('ok');
        } else {
            onError('An error occurred');
        }
    };

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`;
    const urlTempAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.tempAvatar}`;

    return (
        <>
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
                        <Col style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <FaReact className='logo-icon' />
                        </Col>
                        <Col style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
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
                                        <>There are no products in the cart</>
                                } title="Recent added product" placement="bottom">
                                    <ShoppingCartOutlined className='cart-icon' style={{ cursor: 'pointer' }} />
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
            <Modal title="Manage account" width={'60%'} open={isModalOpen} footer={false} onCancel={handleCancel}>
                <Tabs defaultActiveKey="1" items={[
                    {
                        key: '1',
                        label: 'Update information',
                        children:
                            <Row >
                                <Col span={10}>
                                    <Row gutter={[16, 16]} style={{ flexDirection: 'column' }} align={'middle'} justify={'center'}>
                                        <Col>
                                            <Avatar
                                                size={250}
                                                src={user.tempAvatar ? urlTempAvatar : urlAvatar}
                                            />
                                        </Col>
                                        <Col>
                                            <Upload maxCount={1}
                                                multiple={false}
                                                showUploadList={false}
                                                customRequest={handleUploadAvatar}>
                                                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={14}>
                                    <Form
                                        form={form}
                                        onFinish={(values) => onFinish(values, 'info')}
                                        layout='vertical'
                                    >
                                        <Form.Item name="emailInfo" label="Email" initialValue={user.email}>
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item name="fullName" label="Full name" initialValue={user.fullName} rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="phone" label="Phone number" initialValue={user.phone} rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Save changes
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row >,
                    },
                    {
                        key: '2',
                        label: 'Change password',
                        children:
                            <Row >
                                <Col span={14}>
                                    <Form
                                        form={form}
                                        onFinish={(values) => onFinish(values, 'password')}
                                        layout='vertical'
                                    >
                                        <Form.Item name="emailPass" label="Email" initialValue={user.email}>
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item name="oldpass" label="Old password" rules={[{ required: true }]}>
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item name="newpass" label="New password" rules={[{ required: true }]}>
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Save changes
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>,
                    }
                ]} />
            </Modal >
        </>
    );
};

export default Header;