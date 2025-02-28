'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Category } from '@/app/admin/interfaces/Category';

function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id;

    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!categoryId) return;
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`);
                setCategoryName(response.data.name);
            } catch (error) {
                message.error('Error fetching category');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [categoryId]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, { name: categoryName });
            message.success('Category updated successfully');
            router.push('/admin/categories');
        } catch (error) {
            message.error('Error updating category');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type="default" icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/categories')}>
                    Back
                </Button>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Category Name">
                        <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save Changes
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default EditCategoryPage