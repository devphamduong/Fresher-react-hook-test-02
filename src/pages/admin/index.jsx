import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Card, Layout, Menu } from 'antd';

import React, { useState } from "react";
import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';
import { useEffect } from 'react';
import { getDashboard } from '../../services/api';

function AdminPage() {
    const [dashboard, setDashboard] = useState();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        let res = await getDashboard();
        if (res && res.data) {
            setDashboard(res.data);
        }
    };

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <Row gutter={16}>
            <Col span={5}>
                <Card bordered={false}>
                    <Statistic title="Total Users" value={dashboard?.countUser} formatter={formatter} />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered={false}>
                    <Statistic title="Total Orders" value={dashboard?.countOrder} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    );
}

export default AdminPage;