import { Button, Form, Input, Divider, notification, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './LoginPage.scss';
import { login } from "../../services/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../redux/account/accountSlice";

function LoginPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        setIsSubmit(true);
        let res = await login(values);
        setIsSubmit(false);
        if (res && res.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(loginAction(res.data.user));
            message.success("Sign in successfully!");
            navigate('/');
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message && res.message.length > 0 && res.message,
                duration: 5
            });
        }
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
                        name="username"
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
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
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