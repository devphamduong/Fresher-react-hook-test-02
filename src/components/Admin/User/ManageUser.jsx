import { Button, Popconfirm, Table, message } from 'antd';
import InputSearch from './InputSearch';
import { useEffect, useState } from 'react';
import { getUserPaginate } from '../../../services/api';
import { BsTrash3 } from 'react-icons/bs';
import { CloudUploadOutlined, DownloadOutlined, PlusOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import ModalUser from './ModalUser';

function ManageUser(props) {
    const [listUsers, setListUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [actionModal, setActionModal] = useState('DETAIL');

    const confirm = (event) => {
        message.success('Click on Yes');
    };

    const handleViewDetail = (data) => {
        setActionModal('DETAIL');
        setUserDetail(data);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
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
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={confirm}
                        okText='Yes'
                        cancelText='No'
                        icon={<WarningOutlined style={{ color: 'red' }} />}
                    >
                        <BsTrash3 style={{ cursor: 'pointer', color: 'red' }} />
                    </Popconfirm>
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

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>List users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button type="primary" icon={<DownloadOutlined />}>Export</Button>
                    <Button type="primary" icon={<CloudUploadOutlined />}>Import</Button>
                    <Button type="primary" icon={<PlusOutlined />}>Add user</Button>
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
            <ModalUser action={actionModal} userDetail={userDetail} open={open} onClose={onClose} width='50vw' />
        </>
    );
}

export default ManageUser;