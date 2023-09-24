import { Table } from 'antd';
import InputSearch from './InputSearch';

function ManageUser(props) {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Chinese Score',
            dataIndex: 'chinese',
            sorter: true,
        },
        {
            title: 'Math Score',
            dataIndex: 'math',
            sorter: true,
        },
        {
            title: 'English Score',
            dataIndex: 'english',
            sorter: true,
        },
    ];

    const data = [
        {
            key: '1',
            name: 'Aohn Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },
        {
            key: '2',
            name: 'Bim Green',
            chinese: 98,
            math: 66,
            english: 89,
        },
        {
            key: '3',
            name: 'Coe Black',
            chinese: 98,
            math: 90,
            english: 70,
        },
        {
            key: '4',
            name: 'Dim Red',
            chinese: 88,
            math: 99,
            english: 89,
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <>
            <InputSearch />
            <Table columns={columns} dataSource={data} onChange={onChange} />
        </>
    );
}

export default ManageUser;