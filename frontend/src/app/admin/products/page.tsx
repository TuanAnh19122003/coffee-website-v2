'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Typography, message, Card, Descriptions, Input } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import { Product } from '../interfaces/Product';


const { Title, Text } = Typography;

function ProductsPage() {
    const [data, setData] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5)
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                console.log("Product data:", response.data);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                console.log("Categories API Response:", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };
        fetchCategories();
    }, []);



    const handleDelete = async (productId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
                    setData((prevData) => prevData.filter((product) => Number(product.id) !== productId));
                    message.success('Sản phẩm đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa sản phẩm! Vui lòng thử lại.');
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

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        console.log("Selected Product:", product);
        console.log("Category ID của sản phẩm:", product.category?.id);
        setOpen(true);
    };

    const filteredData = data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: TableProps<Product>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                image ? (
                    <img style={{ width: '100px', height: '100px' }} src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`} alt="Product Image" />
                ) : (
                    <Text type="secondary">No Image</Text>
                )
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
        },

        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category?.name || 'N/A',
            filters: categories.map((cat) => ({ text: cat.name, value: cat.id })),
            onFilter: (value, record) => record.category?.id === value,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/products/edit/${record.id}`}>
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='card-mt2'>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h1 className='text-lg font-semibold text-gray-800'>Product List</h1>
                <div className='flex gap-2'>
                    <Input
                        placeholder="Search product..."
                        prefix={<SearchOutlined />}
                        className="border p-1 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link href="/admin/products/create">
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
            />
            {/* Modal hiển thị chi tiết */}
            <Modal
                open={open}
                title={<Title level={4}><ShoppingOutlined /> Details of Product {selectedProduct?.name || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
                width={500}
            >
                {selectedProduct ? (
                    <Card
                        style={{
                            background: '#fff',
                            borderRadius: 10,
                            padding: 20,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {/* Ảnh lớn ở trên */}
                        {selectedProduct.image ? (
                            <img
                                style={{
                                    width: '100%',
                                    height: '250px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    marginBottom: '16px',
                                }}
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedProduct.image}`}
                                alt="User Image"
                            />
                        ) : (
                            <Text type="secondary">No Image</Text>
                        )}

                        {/* Thông tin chi tiết */}
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="ID">{selectedProduct.id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{selectedProduct.name}</Descriptions.Item>
                            <Descriptions.Item label="Description">{selectedProduct.description}</Descriptions.Item>
                            <Descriptions.Item label="Category">
                                {selectedProduct?.category?.name || 'N/A'}
                            </Descriptions.Item>

                            <Descriptions.Item label="Created At">{new Date(selectedProduct.createdAt).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Updated At">{new Date(selectedProduct.updatedAt).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

        </div>
    );
}

export default ProductsPage;
