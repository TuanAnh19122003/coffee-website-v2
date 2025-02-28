'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Card, Typography, Descriptions, message } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { Role } from '../interfaces/Role';

const { Title } = Typography;

const RolePage = () => {
    const [data, setData] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (roleId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa role này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`);
                    setData((prevData) => prevData.filter((role) => role.id !== roleId));
                    message.success('Role đã bị xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa user role! Vui lòng thử lại.');
                }
            },
        });
    };

    const handleViewDetails = (role: Role) => {
        setSelectedRole(role);
        setOpen(true);
    };

    const columns: TableProps<Role>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/roles/edit/${record.id}`}>
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
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card-mt2">
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Roles List</h1>
                <Link href="/admin/roles/create">
                    <Button type="primary" icon={<PlusOutlined />}>New</Button>
                </Link>
            </div>
            <Table<Role>
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                    position: ['bottomCenter'],
                }}
            />
            {/* Modal hiển thị chi tiết Role */}
            <Modal
                open={open}
                title={<Title level={4}><IdcardOutlined /> Role Details</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
            >
                {selectedRole ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="ID">{selectedRole.id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{selectedRole.name}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    );
};

export default RolePage;