import { Button, Popconfirm, Table, message, notification } from 'antd';
import InputSearch from './InputSearch';
import { useEffect, useState } from 'react';
import { deleteBook, getBookPaginate } from '../../../services/api';
import { BsTrash3, BsPencil } from 'react-icons/bs';
import { DownloadOutlined, PlusOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import ModalBook from './ModalBook';

function ManageBook(props) {
    const [listBooks, setListBooks] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('&sort=-updatedAt');
    const [openModalBook, setOpenModalBook] = useState(false);
    const [bookDetail, setBookDetail] = useState({});
    const [actionModal, setActionModal] = useState('DETAIL');

    const handleDeleteBook = async (id) => {
        let res = await deleteBook(id);
        if (res && res.data) {
            message.success("Deleted book successfully!");
            await fetchBook();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
                duration: 5
            });
        }
    };

    const handleViewDetail = (data) => {
        setActionModal('DETAIL');
        setBookDetail(data);
        setOpenModalBook(true);
    };

    const handleEditBook = (data) => {
        setActionModal('UPDATE');
        setBookDetail(data);
        setOpenModalBook(true);
    };

    const onCloseModalBook = () => {
        setOpenModalBook(false);
        setBookDetail(null);
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
            title: 'Name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (text, record, index) => {
                return (
                    <>
                        <span>{record.price} đ</span>
                    </>
                );
            },
            sorter: true,
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Popconfirm
                            title="Delete the book"
                            description="Are you sure to delete this book?"
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText='Yes'
                            cancelText='No'
                            placement='left'
                            icon={<WarningOutlined style={{ color: '#dc3545' }} />}
                        >
                            <BsTrash3 style={{ cursor: 'pointer', color: '#dc3545', fontSize: 15 }} />
                        </Popconfirm>
                        <BsPencil style={{ cursor: 'pointer', color: '#ffc107', fontSize: 15 }} onClick={() => handleEditBook(record)} />
                    </div >
                );
            }
        },
    ];

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += filter;
        }
        if (sortQuery) {
            query += sortQuery;
        }
        let res = await getBookPaginate(query);
        if (res && res.data) {
            setListBooks(res.data.result);
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

    const handleSearchBook = async (filter) => {
        if (filter) {
            setFilter(filter);
        }
    };

    const exportData = () => {
        if (listBooks.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBooks);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "DataBook.xlsx");
        }
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>List books</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportData()} >Export</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpenModalBook(true); setActionModal("CREATE"); }}>Add book</Button>
                    <Button type='ghost' icon={<ReloadOutlined />} onClick={() => { setFilter(''); setSortQuery(''); }}></Button>
                </span>
            </div>
        );
    };

    return (
        <>
            <InputSearch handleSearchBook={handleSearchBook} />
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={listBooks}
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
            <ModalBook action={actionModal} bookDetail={bookDetail} open={openModalBook} onClose={onCloseModalBook} fetchBook={fetchBook} />
        </>
    );
}

export default ManageBook;