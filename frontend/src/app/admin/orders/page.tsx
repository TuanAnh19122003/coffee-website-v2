'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions, Input } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, OrderedListOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Order, OrderStatus } from '../interfaces/Order';
import numeral from 'numeral';
import { DatePicker } from 'antd';
import moment from 'moment';



const { Title, Text } = Typography;

function OrderPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5)
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
                let filteredData = response.data;

                if (dateFilter) {
                    filteredData = filteredData.filter((order: Order) =>
                        moment(order.order_date).format("YYYY-MM-DD") === dateFilter
                    );
                }

                setData(filteredData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateFilter]);


    const handleDateChange = (date: moment.Moment | null) => {
        if (date) {
            setDateFilter(date.format("YYYY-MM-DD"));
        } else {
            setDateFilter(null);
        }
    };


    const statusFilters = Object.values(OrderStatus).map(status => ({
        text: status.charAt(0).toUpperCase() + status.slice(1),
        value: status
    }));

    const columns: TableProps<Order>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Full Name',
            key: 'fullname',
            render: (_, record) => `${record.user.lastname} ${record.user.firstname}`,
            sorter: (a, b) => (`${a.user.lastname} ${a.user.firstname}`).localeCompare(`${b.user.lastname} ${b.user.firstname}`),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Order date',
            dataIndex: 'order_date',
            key: 'order_date',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker
                        onChange={(date) => {
                            if (date) {
                                setSelectedKeys([date.format("YYYY-MM-DD")]);
                            } else {
                                setSelectedKeys([]);
                            }
                            confirm();
                        }}
                        style={{ width: 200 }}
                    />
                    <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90, marginTop: 8 }}>
                        Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) =>
                moment(record.order_date).format("YYYY-MM-DD") === value,
            render: (order_date: string) => <Text type="secondary">{moment(order_date).format("DD/MM/YYYY HH:mm")}</Text>,
        },
        {
            title: 'Total Price',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (total_price) => total_price ? numeral(total_price).format('0,0') + ' ₫' : 'N/A',
        },
        {
            title: 'Shipping address',
            dataIndex: 'shipping_address',
            key: 'shipping_address',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: statusFilters,
            onFilter: (value, record) => record.status.toLowerCase() === value,
            render: (status: OrderStatus) => (
                <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/orders/edit/${record.id}`}>
                        <Button type="primary" size="small" icon={<EditOutlined />}>
                            Edit
                        </Button>
                    </Link>
                    <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetails(record)}>
                        Detail
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDelete = async (orderId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
                    setData((prevData) => prevData.filter((order) => order.id !== orderId));
                    message.success('Đơn hàng đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa đơn hàng! Vui lòng thử lại.');
                }
            },
        });
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    const handleViewDetails = async (order: Order) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}?populate=orderItems.product`);
            setSelectedOrder(response.data);
            setOpen(true);
        } catch (error) {
            message.error('Lỗi khi lấy chi tiết đơn hàng!');
        }
    };

    const filteredData = data.filter(order =>
        order.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='card-mt2'>
            <div className="flex items-center justify-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Orders List</h1>
                <div className='flex gap-2'>
                    <Input
                        placeholder="Search order..."
                        prefix={<SearchOutlined />}
                        className="border p-1 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link href="/admin/orders/create">
                        <Button type="primary" icon={<PlusOutlined />}>
                            New
                        </Button>
                    </Link>
                </div>


            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey='id'
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                    },
                    position: ['bottomCenter'],
                    onChange: handlePageChange,
                }}
                loading={loading}
            />
            <Modal
                open={open}
                title={<Title level={4}><OrderedListOutlined /> Details Order of {`${selectedOrder?.user.lastname} ${selectedOrder?.user.firstname}` || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500}
            >
                {selectedOrder ? (
                    <Card
                        style={{
                            background: '#fff',
                            borderRadius: 10,
                            padding: 20,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Descriptions.Item label="Products">
                            {selectedOrder?.orderItems && selectedOrder.orderItems.length > 0 ? (
                                <Table
                                    dataSource={selectedOrder.orderItems}
                                    rowKey="id"
                                    size="small"
                                    pagination={false}
                                    columns={[
                                        { title: "Product", dataIndex: ["product", "name"], key: "product" },
                                        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                                        {
                                            title: "Price",
                                            dataIndex: "price",
                                            key: "price",
                                            render: (price) => price ? numeral(price).format('0,0') + ' ₫' : 'N/A',
                                        },
                                    ]}
                                />
                            ) : (
                                <Text type="secondary">No items</Text>
                            )}
                        </Descriptions.Item>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    );
}

export default OrderPage;
