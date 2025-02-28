'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Modal, Upload, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Product } from '../../interfaces/Product';
import type { UploadFile } from 'antd';
import { Category } from '../../interfaces/Category';

function CreateProductsPage() {
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Category = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(Category.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values: Product) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category ? String(values.category) : '');

        if (fileList.length > 0) {
            formData.append('image', fileList[0].originFileObj as Blob);
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('Product created successfully');
            router.push('/admin/products');
        } catch (error) {
            message.error('Failed to create product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/products')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập đúng định dạng name!' }]}
                    >
                        <Input placeholder="name...." />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: false, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input placeholder="description...." />
                    </Form.Item>

                    <Form.Item
                        label='Category'
                        name='category'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn Category!',
                            },
                        ]}
                    >
                        <Select>
                            {categories.map((category) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>

                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => e && e.fileList}
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onPreview={(file) => {
                                setPreviewImage(file.url ?? file.thumbUrl ?? '');

                                setPreviewOpen(true);
                            }}
                        >
                            {fileList.length < 1 && <PlusOutlined />}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}

export default CreateProductsPage