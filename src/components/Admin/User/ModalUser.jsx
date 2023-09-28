import { Descriptions, Drawer, Form, Input, Modal, Space, Tag, message, notification } from "antd";
import moment from "moment/moment";
import { createUser } from "../../../services/api";
import { useState } from "react";

function ModalUser(props) {
    const { action, userDetail, open, onClose, width, fetchUser } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    const onFinish = async (values) => {
        setLoading(true);
        let res = await createUser(values);
        if (res && res.data) {
            message.success("Created user successfully!");
            onClose();
            form.resetFields();
            await fetchUser();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
                duration: 5
            });
        }
        setLoading(false);
    };

    return (
        <>
            {action === 'DETAIL'
                ?
                <Drawer title={action === 'DETAIL' ? "Detail" : "Update"} placement="right" onClose={onClose} open={open} width={width}>
                    <Descriptions title="User Info" bordered column={2}>
                        <Descriptions.Item label="Id">{userDetail?._id}</Descriptions.Item>
                        <Descriptions.Item label="Full name">{userDetail?.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Email" >{userDetail?.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone" >{userDetail.phone}</Descriptions.Item>
                        <Descriptions.Item label="Role" span={2}>
                            <Tag color={userDetail?.role === 'ADMIN' ? 'geekblue' : 'green'} key={userDetail?._id}>
                                {userDetail?.role}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {moment(userDetail?.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Updated At">
                            {moment(userDetail?.updatedAt).format('DD/MM/YYYY hh:mm:ss')}
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
                :
                <Modal title="Add user" open={open} onOk={() => form.submit()} centered onCancel={handleCancel} okText="Add" confirmLoading={loading}>
                    <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
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
                    </Form>
                </Modal>
            }
        </>
    );
}

export default ModalUser;