'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, message, Descriptions, Typography, Card } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { Product_special } from '../interfaces/Product_special';

const { Title, Text } = Typography;


function ProductSpecialPage() {
    const [data, setData] = useState<Product_special[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5)

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductSpecial, setSelectedProductSpecial] = useState<Product_special | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-specials`);
                console.log('Dữ liệu API:', response.data);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    const handleDelete = async (userRoleId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm đặc biệt này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${userRoleId}`);
                    setData((prevData) => prevData.filter((user) => user.id !== userRoleId));
                    message.success('Sản phẩm đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa sản phẩm đặt biệt! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${id}`);
            setSelectedProductSpecial(response.data);
            setModalVisible(true);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu chi tiết!');
        } finally {
            setLoading(false);
        }
    };

    const columns: TableProps<Product_special>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (product, record) => (record.product ? `${record.product.name}` : 'N/A'),
        },
        {
            title: 'Special',
            dataIndex: 'special',
            key: 'special',
            render: (special, record) => (record.special ? record.special.special_name : 'N/A'),
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
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record.id)}>
                        Detail
                    </Button>
                </Space>
            ),
        },
    ]

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card-mt2">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <Title level={3} className="text-gray-800">Product Special List</Title>
                <Link href="/admin/product-specials/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
                </Link>
            </div>
            <Table<Product_special>
                columns={columns}
                dataSource={data}
                rowKey="id"
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

            {/* Modal Chi Tiết */}
            <Modal
                title={<Title level={4}><IdcardOutlined /> Chi Tiết User Role</Title>}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                centered
            >
                {selectedProductSpecial ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID"><Text>{selectedProductSpecial.id}</Text></Descriptions.Item>
                            <Descriptions.Item label="User">
                                {selectedProductSpecial.product
                                    ? <Text>{`${selectedProductSpecial.product.name}`}</Text>
                                    : <Text type="secondary">N/A</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {selectedProductSpecial.special
                                    ? <Text>{selectedProductSpecial.special.special_name}</Text>
                                    : <Text type="secondary">N/A</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Date">{new Date(selectedProductSpecial.special.start_date).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="End Date">{new Date(selectedProductSpecial.special.end_date).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    )
}

export default ProductSpecialPage