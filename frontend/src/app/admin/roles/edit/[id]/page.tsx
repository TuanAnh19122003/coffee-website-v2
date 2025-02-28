'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const EditRolePage = () => {
    const params = useParams();
    const router = useRouter();
    const roleId = params.id;

    const [roleName, setRoleName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!roleId) return;
        const fetchRole = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`);
                setRoleName(response.data.name);
            } catch (error) {
                message.error('Error fetching role');
            }
        };
        fetchRole();
    }, [roleId]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`, { name: roleName });
            message.success('Role updated successfully!');
            router.push('/admin/roles');
        } catch (error) {
            message.error('Error updating role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type="default" icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/roles')}>
                    Back
                </Button>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                <Form layout="vertical" onFinish={handleUpdate}>
                    <Form.Item label="Role Name">
                        <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save Changes
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default EditRolePage;
