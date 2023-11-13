import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getOrderHistory } from "../../services/api";
import ReactJson from "react-json-view";

function OrderHistoryPage() {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        let res = await getOrderHistory();
        if (res.data) {
            setOrderHistory(res.data);
        }
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            render: (text) => text,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Total price',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => (
                <Tag color={'green'} key={status}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Detail',
            key: 'detail',
            dataIndex: 'detail',
            render: (_, { detail }) => (
                <ReactJson src={detail} name="Order detail" collapsed enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            ),
        },
    ];

    const data =
        orderHistory.map((item, index) => {
            return {
                key: item._id,
                no: index + 1,
                date: item.updatedAt,
                total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice),
                status: 'approved',
                detail: item.detail
            };
        });

    return (
        <div style={{ padding: '0 40px' }}>
            <h3>Order history</h3>
            <Table columns={columns} dataSource={data} pagination={false} />
        </div>
    );
}

export default OrderHistoryPage;