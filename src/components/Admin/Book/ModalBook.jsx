import { Badge, Button, Descriptions, Divider, Drawer, Form, Input, Modal, Upload, message, notification } from "antd";
import moment from "moment/moment";
import { createUser, updateUser } from "../../../services/api";
import { useEffect, useState } from "react";

function ModalBook(props) {
    const { action, bookDetail, open, onClose, fetchBook } = props;
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
    ]);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancelPreview = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || !file.url.substring(!file.url.lastIndexOf('/') + 1));
    };

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
            action === 'CREATE' ? message.success("Created book successfully!") : message.success("Updated user successfully!");
            onClose();
            formAdd.resetFields();
            await fetchBook();
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
            formUpdate.setFieldsValue(bookDetail);
        }
    }, [bookDetail]);

    return (
        <>
            {action === 'DETAIL'
                &&
                <Drawer title="Detail" placement="right" onClose={onClose} open={open} width={'50vw'}>
                    <Descriptions title="Book Info" bordered column={2}>
                        <Descriptions.Item label="Id">{bookDetail?._id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{bookDetail?.mainText}</Descriptions.Item>
                        <Descriptions.Item label="Author" >{bookDetail?.author}</Descriptions.Item>
                        <Descriptions.Item label="Price" >{bookDetail?.price} đ</Descriptions.Item>
                        <Descriptions.Item label="Category" span={2}>
                            <Badge status="processing" text={bookDetail?.category} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {moment(bookDetail?.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Updated At">
                            {moment(bookDetail?.updatedAt).format('DD/MM/YYYY hh:mm:ss')}
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider orientation="left">Pictures</Divider>
                    <Upload
                        //action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onRemove={false}
                        showUploadList={
                            { showRemoveIcon: false }
                        }>
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Drawer>
            }
            {action === 'CREATE'
                &&
                <Modal title="Add book" open={open} onOk={() => formAdd.submit()} centered onCancel={handleCancel} okText="Add" confirmLoading={loading}>
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
                <Modal title="Update book" open={open} onOk={() => formUpdate.submit()} centered onCancel={handleCancel} okText="Save changes" confirmLoading={loading}>
                    <Form form={formUpdate} name="basic" layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Id"
                            name="_id"
                            rules={[{ required: true, message: 'Please input your id!' }]}
                            hidden
                        >
                            <Input defaultValue={bookDetail?.fullName} />
                        </Form.Item>
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input defaultValue={bookDetail?.fullName} />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input defaultValue={bookDetail?.email} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <Input defaultValue={bookDetail?.phone} />
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </>
    );
}

export default ModalBook;