import { Descriptions, Drawer, Form, Input, Modal, Tag, message, notification } from "antd";
import moment from "moment/moment";
import { createUser, updateUser } from "../../../services/api";
import { useEffect, useState } from "react";

function ModalUser(props) {
    const { action, userDetail, open, onClose, fetchUser } = props;
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onClose();
        if (action === 'CREATE') {
            formAdd.resetFields();
        } else if (action === 'UPDATE') {
            formUpdate.resetFields();
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        let res;
        if (action === 'CREATE') {
            res = await createUser(values);

        } else if (action === 'UPDATE') {
            res = await updateUser(values);
        }
        if (res && res.data) {
            action === 'CREATE' ? message.success("Created user successfully!") : message.success("Updated user successfully!");
            onClose();
            formAdd.resetFields();
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

    useEffect(() => {
        if (action === 'UPDATE') {
            formUpdate.setFieldsValue(userDetail);
        }
    }, [userDetail]);

    return (
        <>
            {action === 'DETAIL'
                &&
                <Drawer title="Detail" placement="right" onClose={onClose} open={open} width={'50vw'}>
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
            }
            {action === 'CREATE'
                &&
                <Modal title="Add user" open={open} onOk={() => formAdd.submit()} centered onCancel={handleCancel} okText="Add" confirmLoading={loading}>
                    <Form form={formAdd} name="basic" layout="vertical" onFinish={onFinish}>
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
            {action === 'UPDATE'
                &&
                <Modal title="Update user" open={open} onOk={() => formUpdate.submit()} centered onCancel={handleCancel} okText="Save changes" confirmLoading={loading}>
                    <Form form={formUpdate} name="basic" layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Id"
                            name="_id"
                            rules={[{ required: true, message: 'Please input your id!' }]}
                            hidden
                        >
                            <Input defaultValue={userDetail?.fullName} />
                        </Form.Item>
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input defaultValue={userDetail?.fullName} />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input defaultValue={userDetail?.email} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input defaultValue={userDetail?.phone} />
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </>
    );
}

export default ModalUser;