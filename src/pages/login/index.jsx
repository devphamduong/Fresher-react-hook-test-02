import { Button, Form, Input, Divider, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './LoginPage.scss';

function LoginPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h1>Sign In</h1>
                <Divider></Divider>
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Your email is not valid!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Sign In
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p>Don't have an account?
                        <span>
                            <Link to={'/register'}> Sign Up</Link>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;