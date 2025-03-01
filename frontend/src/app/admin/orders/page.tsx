'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, OrderedListOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Order } from '../interfaces/Order';

const { Title, Text } = Typography;

function OrderPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const columns: TableProps<Order>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => (
                <span>{record.user.lastname} {record.user.firstname}</span>
            ),
        },
        {
            title: 'Order date',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (order_date: string) => <Text type="secondary">{new Date(order_date).toLocaleDateString()}</Text>,
        },
        {
            title: 'Total Price',
            dataIndex: 'total_price',
            key: 'total_price',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
    ]

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setOpen(true);
    };


    return (
        <div className='card-mt2'>
            <div className="flex items-center justify-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Orders List</h1>
                <Link href="/admin/orders/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey='id'
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                    position: ['bottomCenter'],
                    onChange: handlePageChange,
                }}
            />
            {/* Modal hiển thị chi tiết */}
            <Modal
                open={open}
                title={<Title level={4}><OrderedListOutlined /> Details Order of {`${selectedOrder?.user.lastname} ${selectedOrder?.user.firstname}`|| ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500} // Đặt chiều rộng cố định
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
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="ID">{selectedOrder.id}</Descriptions.Item>
                            <Descriptions.Item label="Total Price">{selectedOrder.total_price}</Descriptions.Item>
                            <Descriptions.Item label="Status">{selectedOrder.status}</Descriptions.Item>
                            <Descriptions.Item label="Order date">{new Date(selectedOrder.order_date).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

        </div>
    )
}

export default OrderPage