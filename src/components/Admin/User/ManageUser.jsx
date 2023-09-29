import { Button, Popconfirm, Table, message, notification } from 'antd';
import InputSearch from './InputSearch';
import { useEffect, useState } from 'react';
import { deleteUser, getUserPaginate } from '../../../services/api';
import { BsTrash3, BsPencil } from 'react-icons/bs';
import { CloudUploadOutlined, DownloadOutlined, PlusOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import ModalUser from './ModalUser';
import ModalUpLoad from './ModalUpLoad';
import * as XLSX from 'xlsx';

function ManageUser(props) {
    const [listUsers, setListUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [openModalUser, setOpenModalUser] = useState(false);
    const [openModalUpLoad, setOpenModalUpLoad] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [actionModal, setActionModal] = useState('DETAIL');

    const handleDeleteUser = async (id) => {
        let res = await deleteUser(id);
        if (res && res.data) {
            message.success("Deleted user successfully!");
            await fetchUser();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
                duration: 5
            });
        }
    };

    const handleViewDetail = (data) => {
        setActionModal('DETAIL');
        setUserDetail(data);
        setOpenModalUser(true);
    };

    const handleEditUser = (data) => {
        setActionModal('UPDATE');
        setUserDetail(data);
        setOpenModalUser(true);
    };

    const onCloseModalUser = () => {
        setOpenModalUser(false);
    };

    const onCloseModalUpLoad = () => {
        setOpenModalUpLoad(false);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <>
                        <a onClick={() => handleViewDetail(record)}>{record._id}</a>
                    </>
                );
            }
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText='Yes'
                            cancelText='No'
                            placement='left'
                            icon={<WarningOutlined style={{ color: '#dc3545' }} />}
                        >
                            <BsTrash3 style={{ cursor: 'pointer', color: '#dc3545', fontSize: 15 }} />
                        </Popconfirm>
                        <BsPencil style={{ cursor: 'pointer', color: '#ffc107', fontSize: 15 }} onClick={() => handleEditUser(record)} />
                    </div >
                );
            }
        },
    ];

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);

    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += filter;
        }
        if (sortQuery) {
            query += sortQuery;
        }
        let res = await getUserPaginate(query);
        if (res && res.data) {
            setListUsers(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const column = sorter.field;
            const order = sorter.order;
            if (order) {
                let sort = order === 'ascend' ? `&sort=${column}` : `&sort=-${column}`;
                setSortQuery(sort);
            }
        }
    };

    const handleSearchUser = async (filter) => {
        if (filter) {
            setFilter(filter);
        }
    };

    const exportData = () => {
        if (listUsers.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUsers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "Data.xlsx");
        }
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>List users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportData()} >Export</Button>
                    <Button type="primary" icon={<CloudUploadOutlined />} onClick={() => setOpenModalUpLoad(true)}>Import</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpenModalUser(true); setActionModal("CREATE"); }}>Add user</Button>
                    <Button type='ghost' icon={<ReloadOutlined />} onClick={() => { setFilter(''); setSortQuery(''); }}></Button>
                </span>
            </div>
        );
    };

    return (
        <>
            <InputSearch handleSearchUser={handleSearchUser} />
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={listUsers}
                onChange={onChange}
                rowKey={'_id'}
                loading={isLoading}
                bordered
                pagination={{
                    total: total,
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]}-{range[1]} on {total} rows
                            </div>
                        );
                    }
                }} />
            <ModalUser action={actionModal} userDetail={userDetail} open={openModalUser} onClose={onCloseModalUser} fetchUser={fetchUser} />
            <ModalUpLoad open={openModalUpLoad} onClose={onCloseModalUpLoad} fetchUser={fetchUser} />
        </>
    );
}

export default ManageUser;