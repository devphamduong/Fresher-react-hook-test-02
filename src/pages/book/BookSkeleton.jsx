import { Col, Row, Skeleton } from "antd";

function BookSkeleton() {
    return (
        <Row style={{ padding: '0 40px' }} justify={'space-evenly'}>
            <Col span={10}>
                <Skeleton.Input active block style={{ width: '100%', height: 350 }} />
                <div style={{ display: 'flex', gap: 20, marginTop: 20, justifyContent: 'center' }}>
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                    <Skeleton.Image active />
                </div>
            </Col>
            <Col span={13}>
                <Skeleton paragraph={{ rows: 3 }} active />
                <Skeleton paragraph={{ rows: 2 }} active />
                <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                    <Skeleton.Button active style={{ width: 100 }} />
                    <Skeleton.Button active style={{ width: 100 }} />
                </div>
            </Col>
        </Row>
    );
}

export default BookSkeleton;