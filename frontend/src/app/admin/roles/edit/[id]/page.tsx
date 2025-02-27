'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Card, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Role {
    id: number;
    name: string;
}

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
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa role này?');
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`);
                alert('Role đã bị xóa thành công!');
                setData((prevData) => prevData.filter((role) => role.id !== roleId));
            } catch (error) {
                alert('Lỗi khi xóa role! Vui lòng thử lại.');
            }
        }
    };

    const handleViewDetails = (role: Role) => {
        setSelectedRole(role);
        setOpen(true);
    };

    const columns: TableProps<Role>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
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
                <h1 className="h3 mb-0 text-gray-800">Roles List</h1>
                <Link href="/admin/roles/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        New
                    </Button>
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
            {/* Modal hiển thị chi tiết */}
            <Modal
                open={open}
                title={<Title level={4}><IdcardOutlined /> Role Details</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
            >
                {selectedRole ? (
                    <Card bordered={false} style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <p><Text strong>ID:</Text> {selectedRole.id}</p>
                        <p><Text strong>Name:</Text> {selectedRole.name}</p>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    );
};

export default RolePage;
