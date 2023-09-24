import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;
import React, { useState } from "react";

function AdminPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>

        </>
    );
}

export default AdminPage;