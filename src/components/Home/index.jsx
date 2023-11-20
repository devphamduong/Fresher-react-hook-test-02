import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Space, Spin, Tabs } from "antd";
import './Home.scss';
import { getAllBookCategories, getBookPaginate } from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

function Home() {
    const [searchTerm, setSearchTerm] = useOutletContext();
    const [form] = Form.useForm();
    const [listCategories, setListCategories] = useState([]);
    const [listBooks, setListBooks] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(4);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('&sort=-sold');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCategories();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, searchTerm]);

    const fetchAllCategories = async () => {
        let res = await getAllBookCategories();
        if (res && res.data.length > 0) {
            setListCategories(res.data);
        }
    };

    const fetchBook = async () => {
        setLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += filter;
        }
        if (sortQuery) {
            query += sortQuery;
        }
        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`;
        }
        let res = await getBookPaginate(query);
        if (res && res.data) {
            setListBooks(res.data.result);
            setTotal(res.data.meta.total);
        }
        setLoading(false);
    };

    const onChangeTab = (key) => {
        setSortQuery(key);
    };

    const handleChangeFilter = (changeValues, values) => {
        if (changeValues.categories) {
            const categories = values.categories;
            if (categories && categories.length > 0) {
                const filters = categories.join();
                setFilter(`&category=${filters}`);
            } else {
                setFilter('');
            }
        }
    };

    const onFinish = (values) => {
        let filters = '';
        if (values?.range?.min >= 0) {
            filters += `&price>=${values?.range?.min}`;
            if (values?.range?.max >= 0) {
                filters += `&price<=${values?.range?.max}`;
            }
            if (values?.categories?.length) {
                const categories = values.categories.join();
                filters += `&category=${categories}`;
            }
            setFilter(filters);
        }
    };

    const onChange = (page, pagesize) => {
        if (page && page !== current) {
            setCurrent(page);
        }
        if (pagesize !== pageSize) {
            setPageSize(pagesize);
            setCurrent(1);
        }
    };

    const removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    };

    const convertSlug = (str) => {
        str = removeVietnameseTones(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa";
        var to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
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
                            <Col><Button type='ghost' icon={<ReloadOutlined />} onClick={() => { form.resetFields(); setFilter(''); setSearchTerm(''); }}></Button></Col>
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
                                    key: '&sort=-sold',
                                    label: 'Popular',
                                    children: <></>,
                                },
                                {
                                    key: '&sort=updatedAt',
                                    label: 'New',
                                    children: <></>,
                                },
                                {
                                    key: '&sort=price',
                                    label: 'Price low to high',
                                    children: <></>,
                                },
                                {
                                    key: '&sort=-price',
                                    label: 'Price high to low',
                                    children: <></>,
                                },
                            ]}
                            onChange={onChangeTab} />
                    </Row>
                    <Spin spinning={loading} tip="Loading...">
                        <Row style={{ flexWrap: 'wrap' }} justify={'space-evenly'}>
                            {listBooks && listBooks.length > 0 &&
                                listBooks.map((item, index) => {
                                    return (
                                        <Col key={`book-${index}`}>
                                            <Card onClick={() => navigate(`/book/${convertSlug(item.mainText)}?id=${item._id}`)}
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
                        <Pagination responsive style={{ textAlign: 'center' }} current={current} total={total} pageSize={pageSize} showSizeChanger={false} onChange={onChange} />
                    </Spin>
                </Col>
            </Row>
        </div>
    );
}

export default Home;