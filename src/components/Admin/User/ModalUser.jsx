import { Descriptions, Drawer, Tag } from "antd";
import moment from "moment/moment";

function ModalUser(props) {
    const { action, userDetail, open, onClose, width } = props;

    return (
        <>
            <Drawer title={action === 'DETAIL' ? "Detail" : "Update"} placement="right" onClose={onClose} open={open} width={width}>
                <Descriptions title="User Info" bordered column={2}>
                    <Descriptions.Item label="Id">{userDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Full name">{userDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email" >{userDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone" >{userDetail.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Tag color={userDetail?.role === 'ADMIN' ? 'geekblue' : 'green'} key={userDetail?._id}>
                            {userDetail?.role}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(userDetail?.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(userDetail?.updatedAt).format('DD/MM/YYYY hh:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
}

export default ModalUser;