import { Button, Form, Input, Divider, notification, message } from "antd";
import './RegisterPage.scss';
import { register } from '../../services/api';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        setIsSubmit(true);
        let res = await register(values);
        setIsSubmit(false);
        if (res && res.data && res.data._id) {
            message.success("Sign up successfully!");
            navigate('/login');
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message && res.message.length > 0 && res.message,
                duration: 5
            });
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h1>Sign Up</h1>
                <Divider></Divider>
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Your email is not valid!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Sign Up
                        </Button>
                    </Form.Item>
                    <Divider>Or</Divider>
                    <p>Already have an account?
                        <span>
                            <Link to={'/login'}> Sign In</Link>
                        </span>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;