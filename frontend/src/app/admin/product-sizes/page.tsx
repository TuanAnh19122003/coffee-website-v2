'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Product_size } from '../interfaces/Product_size';
import numeral from 'numeral';


const { Title, Text } = Typography;

function ProductSizePage() {
    const [data, setData] = useState<Product_size[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedProductSize, setSelectedProductSize] = useState<Product_size | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes`);
                //console.log(response.data)
                setData(response.data);
            } catch (error: any) {
                message.error('Product size not found: ', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (productId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa Size của sản phẩm này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes/${productId}`);
                    setData((prevData) => prevData.filter((product) => product.id !== productId));
                    message.success('Size của Sản phẩm đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa size sản phẩm! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetails = (product_size: Product_size) => {
        setSelectedProductSize(product_size);
        console.log("Selected Product:", product_size);
        console.log("Category ID của sản phẩm:", product_size.product?.id);
        setOpen(true);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: TableProps<Product_size>['columns'] = [
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
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
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
                    <Link href={`/admin/product-sizes/edit/${record.id}`}>
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
                <h1 className="h3 mb-0 text-gray-800">Product Size List</h1>
                <Link href="/admin/product-sizes/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
                </Link>
            </div>
            <div>
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
            </div>
            <Modal
                open={open}
                title={<Title level={4}><ShoppingOutlined  /> Details of Product {selectedProductSize?.product.name || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500} // Đặt chiều rộng cố định
            >
                {selectedProductSize ? (
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
                            <Descriptions.Item label="ID">{selectedProductSize.id}</Descriptions.Item>
                            <Descriptions.Item label="Size">{selectedProductSize.size}</Descriptions.Item>
                            <Descriptions.Item label="Price">
                                {
                                    selectedProductSize.price? numeral(selectedProductSize.price).format('0,0') + ' ₫' : 'N/A'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Product"> {selectedProductSize.product.name}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

        </div>
    )
}

export default ProductSizePage