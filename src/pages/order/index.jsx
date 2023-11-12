import { Button, Col, Divider, InputNumber, Row, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from '@ant-design/icons';
import { addToCartAction, removeProductAction } from '../../redux/order/orderSlice';
import { useEffect, useState } from "react";

function OrderPage(props) {
    const carts = useSelector(state => state.orders.carts);
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(carts.reduce((total, item) => total + (item.quantity * item.detail.price), 0));

    const onChange = (value, book) => {
        if (value && !value < 1) {
            dispatch(addToCartAction({ quantity: value, _id: book._id, detail: book, action: 'cart' }));
        }
    };

    const handleRemoveProduct = (id) => {
        if (id) {
            dispatch(removeProductAction(id));
        }
    };

    useEffect(() => {
        setTotalPrice(carts.reduce((total, item) => total + (item.quantity * item.detail.price), 0));
    }, [carts]);

    return (
        <div style={{ padding: '0 40px' }}>
            {carts.length > 0 ?
                <Row justify={'space-evenly'}>
                    <Col span={17}>
                        {
                            carts.map((item, index) => {
                                return (
                                    <Row align={'middle'} justify={'space-between'} style={index === 0 ? { backgroundColor: 'white', margin: 0, padding: '10px 20px', borderRadius: 5 } : { backgroundColor: 'white', margin: '15px 0', padding: '10px 20px', borderRadius: 5 }}>
                                        <Col span={2}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`} alt="" width={80} height={80} />
                                        </Col>
                                        <Col span={10}>
                                            <Typography.Text ellipsis>{item.detail.mainText}</Typography.Text>
                                        </Col>
                                        <Col span={3}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price ?? 0)}
                                        </Col>
                                        <Col span={2}>
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
                    <Col span={6}>
                        <div style={{ backgroundColor: 'white', padding: '20px 20px', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Temporarily calculated</span><span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider></Divider>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total</span><span style={{ color: 'red' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider></Divider>
                            <div style={{}}><Button block className='button button-buy' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Purchase ({carts.length})</Button></div>
                        </div>
                    </Col>
                </Row>
                :
                <div style={{ textAlign: 'center' }}>No Product</div>}
        </div >
    );
}

export default OrderPage;