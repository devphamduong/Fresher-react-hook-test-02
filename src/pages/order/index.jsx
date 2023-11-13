import { Button, Col, Divider, Empty, Form, Input, InputNumber, Radio, Result, Row, Steps, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, SmileOutlined } from '@ant-design/icons';
import { addToCartAction, clearCart, removeProductAction } from '../../redux/order/orderSlice';
import { useEffect, useState } from "react";
import './Order.scss';
import { createOrder } from "../../services/api";
import { useNavigate } from "react-router-dom";

function OrderPage(props) {
    const carts = useSelector(state => state.orders.carts);
    const user = useSelector(state => state.account.user);
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(carts.reduce((total, item) => total + (item.quantity * item.detail.price), 0));
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        next();
        let data = {
            name: values.receiver,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: carts.map(item => {
                return {
                    bookName: item.detail.mainText,
                    quantity: item.quantity,
                    _id: item._id
                };
            })

        };
        await createOrder(data);
        dispatch(clearCart());
    };

    useEffect(() => {
        if (current === steps.length - 1) {
            message.success('Order successfully!');
        }
    }, [current]);

    const steps = [
        {
            title: 'Cart',
            content:
                <>
                    <Col span={17}>
                        {
                            carts.map((item, index) => {
                                return (
                                    <Row align={'middle'} gutter={[10, 0]} style={index === 0 ? { backgroundColor: 'white', margin: 0, padding: '10px 20px', borderRadius: 5 } : { backgroundColor: 'white', margin: '15px 0', padding: '10px 20px', borderRadius: 5 }}>
                                        <Col span={2}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} alt="" width={80} height={80} />
                                        </Col>
                                        <Col span={10}>
                                            <Typography.Text ellipsis>{item.detail.mainText}</Typography.Text>
                                        </Col>
                                        <Col span={3}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price ?? 0)}
                                        </Col>
                                        <Col span={3}>
                                            <InputNumber min={1} max={item.detail.quantity} defaultValue={item.quantity} onChange={(value) => onChange(value, item.detail)} />
                                        </Col>
                                        <Col span={5} style={{ textAlign: 'center' }}>
                                            Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity * item.detail.price ?? 0)}
                                        </Col>
                                        <Col span={1} style={{ textAlign: 'center' }}>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleRemoveProduct(item._id)} />
                                        </Col>
                                    </Row>
                                );
                            })
                        }
                    </Col>
                    <Col span={7}>
                        <div style={{ backgroundColor: 'white', padding: '20px 20px', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Temporarily calculated</span><span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider></Divider>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total</span><span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider></Divider>
                            <div><Button block className='button button-buy' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => next()}>Purchase ({carts.length})</Button></div>
                        </div>
                    </Col>
                </>,
        },
        {
            title: 'Order',
            content:
                <>
                    <Col span={17}>
                        {
                            carts.map((item, index) => {
                                return (
                                    <Row align={'middle'} gutter={[10, 0]} style={index === 0 ? { backgroundColor: 'white', margin: 0, padding: '10px 20px', borderRadius: 5 } : { backgroundColor: 'white', margin: '15px 0', padding: '10px 20px', borderRadius: 5 }}>
                                        <Col span={2}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} alt="" width={80} height={80} />
                                        </Col>
                                        <Col span={10}>
                                            <Typography.Text ellipsis>{item.detail.mainText}</Typography.Text>
                                        </Col>
                                        <Col span={3}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price ?? 0)}
                                        </Col>
                                        <Col span={3}>
                                            Quantity: {item.quantity}
                                        </Col>
                                        <Col span={6} style={{ textAlign: 'center' }}>
                                            Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity * item.detail.price ?? 0)}
                                        </Col>
                                    </Row>
                                );
                            })
                        }
                    </Col>
                    <Col span={7}>
                        <div style={{ backgroundColor: 'white', padding: '20px 20px', borderRadius: 5 }}>
                            <Form
                                form={form}
                                onFinish={onFinish}
                                layout="vertical"
                            >
                                <Form.Item name="receiver" label="Receiver" rules={[{ required: true }]} initialValue={user.fullName}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="phone" label="Phone number" rules={[{ required: true }]} initialValue={user.phone}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item name="payment" label="Payment type">
                                    <Radio.Group value={1}>
                                        <Radio value="1">Payment on delivery</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form>
                            <Divider ></Divider>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total</span><span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider></Divider>
                            <div style={{ display: 'flex', gap: 10 }} >
                                <Button className='button button-buy' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%' }} onClick={() => prev()}>Previous</Button>
                                <Button className='button button-buy' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%' }} onClick={() => form.submit()}>Place order ({carts.length})</Button>
                            </div>
                        </div>
                    </Col>
                </>,
        },
        {
            title: 'Purchase',
            content:
                <Col span={24}>
                    <Result
                        icon={<SmileOutlined />}
                        title="The order has been placed successfully!"
                        extra={
                            <Button type="primary" key="console" onClick={() => navigate('/order-history')}>
                                View order history
                            </Button>
                        }
                    />
                </Col>,
        },
    ];

    const onChange = (value, book) => {
        if (value && !value < 1) {
            dispatch(addToCartAction({ quantity: value, _id: book._id, detail: book, action: 'cart' }));
        }
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const handleRemoveProduct = (id) => {
        if (id) {
            dispatch(removeProductAction(id));
        }
    };

    useEffect(() => {
        setTotalPrice(carts.reduce((total, item) => total + (item.quantity * item.detail.price), 0));
    }, [carts]);

    return (
        <>
            <div style={{ padding: '0 40px' }} className="order-container">
                <Row justify={'space-between'} gutter={[16, 10]}>
                    <Col span={24}><Steps style={{ padding: '10px 20px', backgroundColor: 'white', borderRadius: 5 }} current={current} items={items} status={current === steps.length - 1 ? "finish" : "finish"} /></Col>
                    {current === 0 && carts.length > 0 &&
                        steps[0].content
                    }
                    {
                        current === 0 && carts.length === 0 &&
                        <Col span={24}><Empty description="There are no products in the cart" /></Col>
                    }
                    {current === 1 &&
                        steps[1].content
                    }
                    {current === 2 &&
                        steps[2].content
                    }
                </Row>
            </div >
        </>
    );
}

export default OrderPage;