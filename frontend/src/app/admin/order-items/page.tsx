'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions, Input } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, OrderedListOutlined, EyeOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { OrderItem } from '../interfaces/OrderItem';
import numeral from 'numeral';

const { Title, Text } = Typography;

function OrderItemPage() {
    const [data, setData] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order-items`);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            }
            setLoading(false);
        };
        fetchData();
    }, [])

    const handleDelete = async (orderItemId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa chi tiết đơn hàng này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/order-items/${orderItemId}`);
                    setData((prevData) => prevData.filter((orderItem) => orderItem.id !== orderItemId));
                    message.success('Đơn hàng đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa đơn hàng! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetails = (orderItem: OrderItem) => {
        setSelectedOrderItem(orderItem);
        setOpen(true);
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    const filteredData = data.filter(order =>
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.size.size.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: TableProps<OrderItem>["columns"] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (product) => product?.name || 'N/A',
        },
        {
            title: 'order',
            dataIndex: 'order',
            key: 'order',
            render: (order) => order?.id || 'N/A',
        },
        {
            title: 'quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price ? numeral(price).format('0,0') + ' ₫' : 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/order-items/edit/${record.id}`}>
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Order Item List</h1>
                <div className='flex gap-2'>
                    <Input
                        placeholder="Search orderItem..."
                        prefix={<SearchOutlined />}
                        className="border p-1 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link href="/admin/order-items/create">
                        <Button type="primary" icon={<PlusOutlined />}>
                            New
                        </Button>
                    </Link>
                </div>

            </div>
            <div>
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
                />
            </div>
            <Modal
                open={open}
                title={<Title level={4}><ShoppingOutlined /> Details of Order {selectedOrderItem?.order.id || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500}
            >
                {selectedOrderItem ? (
                    <Card
                        style={{
                            background: '#fff',
                            borderRadius: 10,
                            padding: 20,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {/* Thông tin chi tiết */}
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="ID">{selectedOrderItem.id}</Descriptions.Item>
                            <Descriptions.Item label="Product"> {selectedOrderItem.product.name}</Descriptions.Item>
                            <Descriptions.Item label="Size">{selectedOrderItem.size.size}</Descriptions.Item>
                            <Descriptions.Item label="Price">
                                {
                                    selectedOrderItem.price ? numeral(selectedOrderItem.price).format('0,0') + ' ₫' : 'N/A'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Quantity"> {selectedOrderItem.quantity}</Descriptions.Item>
                            <Descriptions.Item label="Total Price">
                                {
                                    numeral(selectedOrderItem.price * selectedOrderItem.quantity).format('0,0') + ' đ'
                                }
                            </Descriptions.Item>

                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

        </div>
    )
}

export default OrderItemPage