import { Badge, Button, Col, Descriptions, Divider, Drawer, Form, Input, InputNumber, Modal, Row, Select, Upload, message, notification } from "antd";
import moment from "moment/moment";
import { callUploadBookImg, createBook, createUser, getAllBookCategories, updateUser } from "../../../services/api";
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
    const [dataSlider, setDataSlider] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState({});
    const [initForm, setInitForm] = useState({});

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
        let data = {
            thumbnail: dataThumbnail.name,
            slider: dataSlider.map(item => item.name),
            mainText: values.mainText,
            author: values.author,
            price: values.price,
            sold: values.sold,
            quantity: values.quantity,
            category: values.category
        };
        let res;
        if (action === 'CREATE') {
            res = await createBook(data);
        } else if (action === 'UPDATE') {
            res = await updateUser(values);
        }
        if (res && res.data) {
            action === 'CREATE' ? message.success("Created book successfully!") : message.success("Updated user successfully!");
            onClose();
            formAdd.resetFields();
            setDataThumbnail({});
            setDataSlider([]);
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
            if (bookDetail) {
                const arrThumbnail = [
                    {
                        uid: uuidv4(),
                        name: bookDetail.thumbnail,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail.thumbnail}`
                    }
                ];
                const arrSlider = bookDetail?.slider?.map(item => {
                    return {
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    };
                });
                const init = {
                    id: bookDetail._id,
                    mainText: bookDetail.mainText,
                    author: bookDetail.author,
                    price: bookDetail.price,
                    category: bookDetail.category,
                    quantity: bookDetail.quantity,
                    sold: bookDetail.sold,
                    thumbnail: { fileList: arrThumbnail },
                    slider: { fileList: arrSlider }
                };
                setInitForm(init);
                setDataThumbnail(arrThumbnail);
                setDataSlider(arrSlider);
                formUpdate.setFieldsValue(init);
            }
        }
        return () => {
            formUpdate.resetFields();
        };
    }, [bookDetail]);

    useEffect(() => {
        if (action === 'CREATE' || action === 'UPDATE') {
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
            });
        }
    };

    const handleUpLoadFileSlider = async ({ file, onSuccess, onError }) => {
        let res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }]);
            onSuccess('ok');
        } else {
            onError('An error occurred when upload file');
        }
    };

    const handleUpLoadFileThumbnail = async ({ file, onSuccess, onError }) => {
        let res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail({
                name: res.data.fileUploaded,
                uid: file.uid
            });
            onSuccess('ok');
        } else {
            onError('An error occurred when upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail({});
        } else {
            const newSlider = dataSlider.filter(s => s.uid !== file.uid);
            setDataSlider(newSlider);
        }
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
                                        customRequest={handleUpLoadFileThumbnail}
                                        beforeUpload={beforeUpload}
                                        onPreview={handlePreview}
                                        onRemove={(file) => handleRemoveFile(file, 'thumbnail')}>
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
                                        customRequest={handleUpLoadFileSlider}
                                        beforeUpload={beforeUpload}
                                        onPreview={handlePreview}
                                        onRemove={(file) => handleRemoveFile(file, 'slider')}>
                                        <div>
                                            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Row>
                    </Form>
                </Modal>
            }
            {action === 'UPDATE'
                &&
                <Modal title="Update book" open={open} onOk={() => formUpdate.submit()} centered onCancel={handleCancel} okText="Save changes" confirmLoading={loading} width={'50vw'}>
                    <Form form={formUpdate} name="basic" layout="vertical" onFinish={onFinish}>
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
                                        defaultFileList={initForm?.thumbnail?.fileList ?? []}
                                        maxCount={1}
                                        multiple={false}
                                        onChange={handleChange}
                                        customRequest={handleUpLoadFileThumbnail}
                                        beforeUpload={beforeUpload}
                                        onPreview={handlePreview}
                                        onRemove={(file) => handleRemoveFile(file, 'thumbnail')}>
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
                                        defaultFileList={initForm?.slider?.fileList ?? []}
                                        multiple
                                        onChange={(info) => handleChange(info, 'slider')}
                                        customRequest={handleUpLoadFileSlider}
                                        beforeUpload={beforeUpload}
                                        onPreview={handlePreview}
                                        onRemove={(file) => handleRemoveFile(file, 'slider')}>
                                        <div>
                                            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Row>
                    </Form>
                </Modal >
            }
        </>
    );
}

export default ModalBook;