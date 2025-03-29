'use client';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link';
import { Button, Space, Table, Modal, Card, Typography, Descriptions, message, Input } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined, SearchOutlined } from '@ant-design/icons';
import { Special } from '../interfaces/Special';

const { Title } = Typography;

function SpecialPage() {
    const [data, setData] = useState<Special[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSpecial, setSelectedSpecial] = useState<Special | null>(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/specials`);
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

    const handleViewDetails = (category: Special) => {
        setSelectedSpecial(category);
        setOpen(true);
    };

    const handleDelete = async (categoryId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa loại sản phẩm này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/specials/${categoryId}`);
                    setData((prevData) => prevData.filter((category) => category.id !== categoryId));
                    message.success('Category đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa Category! Vui lòng thử lại.');
                }
            },
        });
    };

    const filteredData = data.filter(special =>
        special.special_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: TableProps<Special>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Special Name',
            dataIndex: 'special_name',
            key: 'special_name',
        },
        {
            title: 'discount',
            dataIndex: 'discount_percentage',
            key: 'discount_percentage',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/specials/edit/${record.id}`}>
                        <Button type="primary" size="small" icon={<EditOutlined />}>Edit</Button>
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
        <div className="card-mt2">
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Special List</h1>
                <div className='flex gap-2'>
                    <Input
                        placeholder="Search special..."
                        prefix={<SearchOutlined />}
                        className="border p-1 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link href="/admin/specials/create">
                        <Button type="primary" icon={<PlusOutlined />}>New</Button>
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

            <Modal
                open={open}
                title={<Title level={4}><IdcardOutlined /> Role Details</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
            >
                {selectedSpecial ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="ID">{selectedSpecial.id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{selectedSpecial.special_name}</Descriptions.Item>
                            <Descriptions.Item label="Discount">{selectedSpecial.discount_percentage} %</Descriptions.Item>
                            <Descriptions.Item label="Start Date">{new Date(selectedSpecial.start_date).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="End Date">{new Date(selectedSpecial.end_date).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    )
}

export default SpecialPage  