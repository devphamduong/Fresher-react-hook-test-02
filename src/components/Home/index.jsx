import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Space, Tabs } from "antd";
import './Home.scss';

function Home() {
    const [form] = Form.useForm();

    const onChangeTab = (key) => {
        console.log(key);
    };

    const handleChangeFilter = (changeValues, values) => {
        console.log(values);
    };

    const onFinish = (values) => {
        console.log(values);
    };

    return (
        <div className="home-container">
            <Row className="home-content">
                <Col md={4} xs={4} style={{ padding: '0 10px' }}>
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
                                        <Col span={24}>
                                            <Checkbox value="A">A</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="B">B</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="C">C</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="D">D</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="E">E</Checkbox>
                                        </Col>
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
                <Col sm={20} style={{ padding: '0 10px' }}>
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
                    <Row style={{ flexWrap: 'wrap', gap: 15 }}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                            >
                                <Card.Meta
                                    title="Cộc"
                                    description={
                                        <>
                                            <div className="price" style={{ color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Rate className="rate" defaultValue={5} disabled={true} style={{ fontSize: 15 }} />
                                                <span className="sold" style={{ marginLeft: 5, color: 'black' }}>1k sold</span></div>
                                        </>
                                    } />
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                            >
                                <Card.Meta
                                    title="Cộc"
                                    description={
                                        <>
                                            <div className="price" style={{ color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Rate className="rate" defaultValue={5} disabled={true} style={{ fontSize: 15 }} />
                                                <span className="sold" style={{ marginLeft: 5, color: 'black' }}>1k sold</span></div>
                                        </>
                                    } />
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                            >
                                <Card.Meta
                                    title="Cộc"
                                    description={
                                        <>
                                            <div className="price" style={{ color: 'black' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Rate className="rate" defaultValue={5} disabled={true} style={{ fontSize: 15 }} />
                                                <span className="sold" style={{ marginLeft: 5, color: 'black' }}>1k sold</span></div>
                                        </>
                                    } />
                            </Card>
                        </Col>
                    </Row>
                    <Divider />
                    <Pagination style={{ textAlign: 'center' }} defaultCurrent={6} total={500} />
                </Col>
            </Row>
        </div>
    );
}

export default Home;