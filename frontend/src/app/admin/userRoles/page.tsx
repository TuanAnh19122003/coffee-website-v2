'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, message, Descriptions, Typography, Card } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { UserRole } from '../interfaces/UserRole';

const { Title, Text } = Typography;

const UserRolePage = () => {
    const [data, setData] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userroles`);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (userRoleId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa user role này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/userroles/${userRoleId}`);
                    setData((prevData) => prevData.filter((user) => user.id !== userRoleId));
                    message.success('User role đã được xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa user role! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userroles/${id}`);
            setSelectedUserRole(response.data);
            setModalVisible(true);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu chi tiết!');
        } finally {
            setLoading(false);
        }
    };

    const columns: TableProps<UserRole>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * 5 + index + 1,
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user, record) => (record.user ? `${record.user.lastname} ${record.user.firstname}` : 'N/A'),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => (record.role ? record.role.name : 'N/A'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/userRoles/edit/${record.id}`}>
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
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card-mt2">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <Title level={3} className="text-gray-800">User Roles List</Title>
                <Link href="/admin/userRoles/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
                </Link>
            </div>
            <Table<UserRole>
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
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
                {selectedUserRole ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID"><Text>{selectedUserRole.id}</Text></Descriptions.Item>
                            <Descriptions.Item label="User">
                                {selectedUserRole.user
                                    ? <Text>{`${selectedUserRole.user.lastname} ${selectedUserRole.user.firstname}`}</Text>
                                    : <Text type="secondary">N/A</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                {selectedUserRole.role
                                    ? <Text>{selectedUserRole.role.name}</Text>
                                    : <Text type="secondary">N/A</Text>}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    );
};

export default UserRolePage;
