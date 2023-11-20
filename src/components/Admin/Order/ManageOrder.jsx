import { ReloadOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { getOrderPaginate } from "../../../services/api";
import moment from "moment";

function ManageOrder(props) {
    const [listOrders, setListOrders] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('&sort=-updatedAt');

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <>
                        {record._id}
                    </>
                );
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</span>
                    </>
                );
            },
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Updated at',
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return (
                    <>
                        {moment(record.updatedAt).format('DD/MM/YYYY hh:mm:ss A')}
                    </>
                );
            },
            sorter: true,
        },
    ];

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, filter, sortQuery]);

    const fetchOrder = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += filter;
        }
        if (sortQuery) {
            query += sortQuery;
        }
        let res = await getOrderPaginate(query);
        if (res && res.data) {
            setListOrders(res.data.result);
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

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>List orders</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button type='ghost' icon={<ReloadOutlined />} onClick={() => { setFilter(''); setSortQuery(''); }}></Button>
                </span>
            </div>
        );
    };

    return (
        <>
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={listOrders}
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
        </>
    );
}

export default ManageOrder;