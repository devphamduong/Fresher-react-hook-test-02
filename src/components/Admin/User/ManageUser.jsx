import { Button, Table } from 'antd';
import InputSearch from './InputSearch';
import { useEffect, useState } from 'react';
import { getUserPaginate } from '../../../services/api';

function ManageUser(props) {
    const [listUsers, setListUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
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
                    <Button>Delete</Button>
                );
            }
        },
    ];

    useEffect(() => {
        fetchUser();
    }, [current, pageSize]);

    const fetchUser = async () => {
        let res = await getUserPaginate(current, pageSize);
        if (res && res.data) {
            setListUsers(res.data.result);
            setTotal(res.data.meta.total);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    return (
        <>
            <InputSearch />
            <Table
                columns={columns}
                dataSource={listUsers}
                onChange={onChange}
                rowKey={'_id'}
                pagination={{
                    total: total, current: current, pageSize: pageSize, showSizeChanger: true
                }} />
        </>
    );
}

export default ManageUser;