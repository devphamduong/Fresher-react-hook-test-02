import { Button, Col, Form, Input, Row, Space } from "antd";

function InputSearch(props) {
    const [form] = Form.useForm();

    const buildQuery = (arrayValues) => {

    };

    const onFinish = (values) => {
        let filter = '';
        Object.entries(values).map(([key, value], index) => {
            if (key && value) {
                filter += `&${key}=/${value}/i`;
            }
        });
        props.handleSearchUser(filter);
    };

    return (
        <div style={{ margin: '20px 0px' }}>
            <Form
                form={form}
                name="advanced_search"
                style={{ padding: 24, backgroundColor: '#fafafa', borderRadius: '8px' }}
                onFinish={onFinish}
                layout="vertical">
                <Row justify={'space-around'}>
                    <Col span={7}>
                        <Form.Item
                            name='fullName'
                            label='Name'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            name='email'
                            label='Email'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            name='phone'
                            label='Phone'
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                props.handleSearchUser();
                            }}
                        >
                            Clear
                        </Button>
                    </Space>
                </div>
            </Form>
        </div >
    );
}

export default InputSearch;