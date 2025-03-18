'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Space, Table, Modal, Card, Typography, Descriptions, message } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ContactsOutlined } from '@ant-design/icons';
import { Contact } from '../interfaces/Contact';

const { Title } = Typography;
function ContactPage() {
    const [data, setData] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts`);
                setData(response.data);
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const columns: TableProps<Contact>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'lastname' + 'firstname',
            key: 'fullname',
            render: (text, record) => (
                <span>{record.lastName} {record.firstName}</span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
            key: 'subjectName',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/contacts/edit/${record.id}`}>
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

    const handleDelete = async (contactId: number) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa role này?',
            onOk: async () => {
                try {
                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`);
                    setData((prevData) => prevData.filter((contact) => contact.id !== contactId));
                    message.success('Contact đã bị xóa thành công!');
                } catch (error) {
                    message.error('Lỗi khi xóa contact Vui lòng thử lại.');
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

    const handleViewDetails = (contact: Contact) => {
        setSelectedContact(contact);
        setOpen(true);
    };

    return (
        <div className="card-mt2">
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Contacts List</h1>
                <Link href="/admin/contacts/create">
                    <Button type="primary" icon={<PlusOutlined />}>New</Button>
                </Link>
            </div>
            <Table<Contact>
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

            <Modal
                open={open}
                title={<Title level={4}><ContactsOutlined  /> Details Contact of {`${selectedContact?.lastName} ${selectedContact?.firstName }` || ''}</Title>}
                footer={null}
                onCancel={() => setOpen(false)}
                centered
            >
                {selectedContact ? (
                    <Card variant='outlined' style={{ background: '#f9f9f9', borderRadius: 10, padding: 20 }}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="ID">{selectedContact.id}</Descriptions.Item>
                            <Descriptions.Item label="Full Name">{selectedContact.lastName} {selectedContact.firstName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{selectedContact.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{selectedContact.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Subject Name">{selectedContact.subjectName}</Descriptions.Item>
                            <Descriptions.Item label="Note">{selectedContact.note}</Descriptions.Item>
                            <Descriptions.Item label="Created At">{new Date(selectedContact.createdAt).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Updated At">{new Date(selectedContact.updatedAt).toLocaleString()}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
        </div>
    )
}

export default ContactPage