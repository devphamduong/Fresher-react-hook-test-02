import { Badge, Button, Col, Descriptions, Divider, Drawer, Form, Input, InputNumber, Modal, Row, Select, Upload, message, notification } from "antd";
import moment from "moment/moment";
import { createUser, getAllBookCategories, updateUser } from "../../../services/api";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const getBase64Img = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

function ModalBook(props) {
    const { action, bookDetail, open, onClose, fetchBook } = props;
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

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
        console.log(values);
        return;
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
        if (action === 'DETAIL') {
            if (bookDetail) {
                let imgThumbnail = {}, imgSlider = [];
                if (bookDetail.thumbnail) {
                    imgThumbnail = {
                        uid: uuidv4(),
                        name: bookDetail.thumbnail,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail.thumbnail}`
                    };
                }
                if (bookDetail.slider && bookDetail.slider.length > 0) {
                    bookDetail.slider.map(item => {
                        imgSlider.push({
                            uid: uuidv4(),
                            name: item,
                            status: 'done',
                            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                        });
                    });
                }
                setFileList([imgThumbnail, ...imgSlider]);
            }
        }
        if (action === 'UPDATE') {
            formUpdate.setFieldsValue(bookDetail);
        }
    }, [bookDetail]);

    useEffect(() => {
        if (action === 'CREATE') {
            fetchAllCategories();
        }
    }, [action]);

    const fetchAllCategories = async () => {
        let res = await getAllBookCategories();
        if (res && res.data.length > 0) {
            setListCategories(res.data);
        }
    };

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64Img(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoadingThumbnail(false);
                setImageUrl(url);
            });
        }
    };

    const handleUpLoadFile = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

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
                <Modal title="Add book" open={open} onOk={() => formAdd.submit()} centered onCancel={handleCancel} okText="Add" confirmLoading={loading} width={'50vw'}>
                    <Form form={formAdd} name="basic" layout="vertical" onFinish={onFinish}>
                        <Row justify={'space-around'}>
                            <Col span={11}>
                                <Form.Item
                                    label="Name"
                                    name="mainText"
                                    rules={[{ required: true, message: 'Please input book name!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    label="Author"
                                    name="author"
                                    rules={[{ required: true, message: 'Please input author!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label="Price"
                                    name="price"
                                    rules={[{ required: true, message: 'Please input price!' }]}>
                                    <InputNumber
                                        min={1}
                                        addonAfter="VND"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label="Category"
                                    name="category"
                                    rules={[{ required: true, message: 'Please select category!' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        options={
                                            listCategories && listCategories.length > 0 && listCategories.map(item => {
                                                return (
                                                    {
                                                        value: item,
                                                        label: item,
                                                    }
                                                );
                                            })
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label="Quantity"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Please input quantity!' }]}
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label="Sold"
                                    name="sold"
                                    initialValue={0}
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    label="Thumbnail"
                                    name="thumbnail"
                                    rules={[{ required: true, message: 'Please upload thumbnail!' }]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        maxCount={1}
                                        multiple={false}
                                        onChange={handleChange}
                                        customRequest={handleUpLoadFile}
                                        beforeUpload={beforeUpload}>
                                        <div>
                                            {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item
                                    label="Slider"
                                    name="slider"
                                    rules={[{ required: true, message: 'Please upload at least one slider!' }]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        multiple
                                        onChange={(info) => handleChange(info, 'slider')}
                                        customRequest={handleUpLoadFile}
                                        beforeUpload={beforeUpload}>
                                        <div>
                                            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
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