'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Product_special } from '../interfaces/Product_special';
import numeral from 'numeral';


const { Title, Text } = Typography;

function producrSpecialPage() {
    const [data, setData] = useState<Product_special[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedProductSpecial, setSelectedProductSpecial] = useState<Product_special | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-specials`);
                setData(response.data);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (product_specId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa khuyến mãi sản phẩm này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes/${product_specId}`);
                    setData((prevData) => prevData.filter((product_special) => product_special.id !== product_specId));
                    message.success('Khuyến mãiSản phẩm đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa khuyến mãi sản phẩm! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetails = (product_special: Product_special) => {
        setSelectedProductSpecial(product_special);
        setOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: TableProps<Product_special>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
        },
        {
            title: 'Title',
            dataIndex: 'special_name',
            key: 'special_name',
        },
        {
            title: 'Discount',
            dataIndex: 'discount_percentage',
            key: 'discount_percentage',
            render: (price) => numeral(price).format('0,0') + ' %',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (product) => product?.name || 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/product-specials/edit/${record.id}`}>
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
                <h1 className="h3 mb-0 text-gray-800">Product Special List</h1>
                <Link href="/admin/product-specials/create">
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
            {/* Modal hiển thị chi tiết Product Special */}
            <Modal
                open={open}
                title={<Title level={4}><ShoppingOutlined /> Details of Product {selectedProductSpecial?.product.name || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500} // Đặt chiều rộng cố định
            >
                {selectedProductSpecial ? (
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
                            <Descriptions.Item label="ID">{selectedProductSpecial.id}</Descriptions.Item>
                            <Descriptions.Item label="Special Name">{selectedProductSpecial.special_name}</Descriptions.Item>
                            <Descriptions.Item label="Discount">
                                {
                                    selectedProductSpecial.discount_percentage ? numeral(selectedProductSpecial.discount_percentage).format('0,0') + ' %' : 'N/A'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Product"> {selectedProductSpecial.product.name}</Descriptions.Item>
                            <Descriptions.Item label="Start Date">{new Date(selectedProductSpecial.start_date).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="End Date">{new Date(selectedProductSpecial.end_date).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    )
}

export default producrSpecialPage