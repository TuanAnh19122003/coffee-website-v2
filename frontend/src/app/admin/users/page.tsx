'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Card, Typography, Col, Row } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { User } from '../interfaces/User';

const { Title, Text } = Typography;

const UserPage = () => {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [error, setError]);

    const handleDelete = async (userId: number) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa user này?');
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
                alert('User has been successfully deleted!');
                setData((prevData) => prevData.filter((user) => user.id !== userId));
            } catch (error) {
                alert('Lỗi khi xóa user! Vui lòng thử lại.');
            }
        }
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const columns: TableProps<User>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => (
                image ? (
                    <img style={{ width: '100px', height: '100px' }} src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`} alt="User Image" />
                ) : (
                    <Text type="secondary">No Image</Text>
                )
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'lastname' + 'firstname',
            key: 'fullname',
            render: (text, record) => (
                <span>{record.lastname} {record.firstname}</span>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space size="middle">
                    <Link href={`/admin/users/edit/${record.id}`}>
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
        <div className="card-mt2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Users List</h1>
                <Link href="/admin/users/create">
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
                }}
            />
            {/* Modal hiển thị chi tiết */}
            <Modal
                open={open}
                title={<Title level={4}><IdcardOutlined /> Role Details</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
            >
                {selectedUser ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Row gutter={16}>
                            <Col span={11}>
                                {selectedUser.image ? (
                                    <img
                                        style={{
                                            width: '150%', // Ảnh chiếm toàn bộ chiều rộng của cột
                                            height: '200px',
                                            borderRadius: '8px',
                                        }}
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedUser.image}`}
                                        alt="User Image"
                                    />
                                ) : (
                                    <Text type="secondary">No Image</Text>
                                )}
                            </Col>
                            <Col span={13}>
                                <p><Text strong>ID:</Text> {selectedUser.id}</p>
                                <p><Text strong>Email:</Text> {selectedUser.email}</p>
                                <p><Text strong>Full Name:</Text> {selectedUser.lastname} {selectedUser.firstname}</p>
                                <p><Text strong>Phone:</Text> {selectedUser.phone}</p>
                                <p><Text strong>Address:</Text> {selectedUser.address}</p>
                                <p><Text strong>Created At:</Text> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                                <p><Text strong>Updated At:</Text> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
                            </Col>
                        </Row>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

        </div>
    )
}

export default UserPage