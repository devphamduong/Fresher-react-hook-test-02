import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Space, Tabs } from "antd";
import './Home.scss';
import { getAllBookCategories, getBookPaginate } from "../../services/api";
import { useEffect, useState } from "react";

function Home() {
    const [form] = Form.useForm();
    const [listCategories, setListCategories] = useState([]);
    const [listBooks, setListBooks] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current]);

    const fetchAllCategories = async () => {
        let res = await getAllBookCategories();
        if (res && res.data.length > 0) {
            setListCategories(res.data);
        }
    };

    const fetchBook = async () => {
        let query = `current=${current}&pageSize=4`;
        let res = await getBookPaginate(query);
        if (res && res.data) {
            setListBooks(res.data.result);
            setTotal(res.data.meta.total);
        }
    };

    const onChangeTab = (key) => {
        console.log(key);
    };

    const handleChangeFilter = (changeValues, values) => {
        console.log(values);
    };

    const onFinish = (values) => {
        console.log(values);
    };

    const onChange = (page) => {
        if (page && page !== current) {
            console.log(page);
            setCurrent(page);
        }
    };

    return (
        <div className="home-container">
            <Row className="home-content" justify={'space-evenly'}>
                <Col md={4} xs={4} style={{ padding: '10px 20px', background: 'white', borderRadius: 8 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify={'space-between'} align={'middle'}>
                            <Col>
                                <FilterOutlined style={{ color: '#4c96ff' }} /><span style={{ fontSize: 15, fontWeight: 'bold' }}> Filter</span>
                            </Col>
                            <Col><Button type='ghost' icon={<ReloadOutlined />}></Button></Col>
                        </Row>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={(changeValues, values) => handleChangeFilter(changeValues, values)}
                            onFinish={onFinish}
                        >
                            <Form.Item name="categories" label="Categories" style={{ margin: 0 }}>
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Row>
                                        {listCategories && listCategories.length > 0 &&
                                            listCategories.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`category-${item}-${index}`}>
                                                        <Checkbox value={item}>{item}</Checkbox>
                                                    </Col>
                                                );
                                            })}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Price" style={{ margin: 0 }}>
                                <Row justify={'space-between'} align={'middle'}>
                                    <Col>
                                        <Form.Item name={['range', 'min']}>
                                            <InputNumber
                                                min={0}
                                                name="min"
                                                placeholder="Min"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ marginBottom: 24 }}><span>to</span></Col>
                                    <Col>
                                        <Form.Item name={['range', 'max']}>
                                            <InputNumber
                                                min={0}
                                                name="max"
                                                placeholder="Max"
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" style={{ width: '100%' }} type="primary">Apply</Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </Col>
                <Col sm={19} style={{ padding: '10px 20px', background: 'white', borderRadius: 8 }}>
                    <Row>
                        <Tabs defaultActiveKey="1" style={{ width: '100%' }}
                            items={[
                                {
                                    key: '1',
                                    label: 'Popular',
                                    children: <></>,
                                },
                                {
                                    key: '2',
                                    label: 'New',
                                    children: <></>,
                                },
                                {
                                    key: '3',
                                    label: 'Price low to high',
                                    children: <></>,
                                },
                                {
                                    key: '4',
                                    label: 'Price high to low',
                                    children: <></>,
                                },
                            ]}
                            onChange={onChangeTab} />
                    </Row>
                    <Row style={{ flexWrap: 'wrap' }} justify={'space-evenly'}>
                        {listBooks && listBooks.length > 0 &&
                            listBooks.map((item, index) => {
                                return (
                                    <Col key={`book-${index}`}>
                                        <Card
                                            hoverable
                                            style={{ width: 240 }}
                                            cover={<img alt="example" src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} />}
                                        >
                                            <Card.Meta
                                                title={item.mainText}
                                                className={`title ${item.mainText.length > 40 ? 'ellipsis' : ''}`}
                                                description={
                                                    <>
                                                        <div className="price" style={{ color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</div>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Rate className="rate" defaultValue={5} disabled={true} style={{ fontSize: 15 }} />
                                                            <span className="sold" style={{ marginLeft: 5, color: 'black' }}>{item.sold} sold</span></div>
                                                    </>
                                                } />
                                        </Card>
                                    </Col>
                                );
                            })}
                    </Row>
                    <Divider />
                    <Pagination style={{ textAlign: 'center' }} current={current} total={total} pageSize={4} showSizeChanger={false} onChange={onChange} />
                </Col>
            </Row>
        </div>
    );
}

export default Home;