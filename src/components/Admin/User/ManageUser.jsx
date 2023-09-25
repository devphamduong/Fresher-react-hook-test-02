import { Button, Table } from 'antd';
import InputSearch from './InputSearch';
import { useEffect, useState } from 'react';
import { getUserPaginate } from '../../../services/api';

function ManageUser(props) {
    const [listUsers, setListUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('');

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
        setFilter(filter);
    };

    return (
        <>
            <InputSearch handleSearchUser={handleSearchUser} />
            <Table
                columns={columns}
                dataSource={listUsers}
                onChange={onChange}
                rowKey={'_id'}
                loading={isLoading}
                pagination={{
                    total: total, current: current, pageSize: pageSize, showSizeChanger: true
                }} />
        </>
    );
}

export default ManageUser;