import { Modal, Space, Table, notification } from "antd";
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useState } from "react";
import { bulkCreateUser } from "../../../services/api";
import templateFile from './template-import.xlsx?url';

const { Dragger } = Upload;

function ModalUpLoad(props) {
    const { open, onClose, fetchUser } = props;
    const [dataExcel, setDataExcel] = useState([]);
    const [uploadKey, setUploadKey] = useState(0);

    const handleOk = async () => {
        let data = dataExcel.map(item => {
            item.password = '123456';
            return item;
        });
        let res = await bulkCreateUser(data);
        if (res && res.data) {
            notification.success({
                description: `Succeed: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Import successfully"
            });
            setUploadKey(uploadKey + 1);
            setDataExcel([]);
            onClose();
            await fetchUser();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
                duration: 5
            });
        }
    };

    const handleCancel = () => {
        onClose();
        setUploadKey(uploadKey + 1);
        setDataExcel([]);
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };

    const propsUpLoad = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        key: uploadKey,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    let reader = new FileReader(file);
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(reader.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1 //skip header row
                        });
                        if (jsonData && jsonData.length > 0) {
                            setDataExcel(jsonData);
                        }
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Modal title="Import data user" centered open={open} onOk={handleOk} onCancel={handleCancel} width={'50vw'} okText='Import' okButtonProps={{ disabled: dataExcel.length < 1 }} maskClosable={false}>
            <Dragger {...propsUpLoad}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx
                    <div>
                        <a onClick={e => e.stopPropagation()} href={templateFile} download>Download Sample File</a>
                    </div>
                </p>
            </Dragger>
            <Table
                title={() => <span>Data upload:</span>}
                columns={[
                    { title: 'Full name', dataIndex: 'fullName', },
                    { title: 'Email', dataIndex: 'email', },
                    { title: 'Phone', dataIndex: 'phone', }
                ]}
                dataSource={dataExcel}
                bordered />
        </Modal>
    );
}

export default ModalUpLoad;