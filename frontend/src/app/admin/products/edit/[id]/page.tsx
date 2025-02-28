'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Card, Modal, Upload, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

import { Product } from '@/app/admin/interfaces/Product';
import { Category } from '@/app/admin/interfaces/Category';
function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (!productId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
                const cate = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(cate.data);
        
                setProduct({
                    ...response.data,
                    category: response.data.category?.id || null,
                });
        
                if (response.data.image) {
                    setFileList([
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: `${process.env.NEXT_PUBLIC_API_URL}${response.data.image}`,
                        },
                    ]);
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch product data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [productId]);

    const handleSubmit = async (values: Product) => {
        setLoading(true);
        try {
            const formData = new FormData();
            // Append form fields to FormData
            for (let key in values) {
                formData.append(key, (values as any)[key]);
            }
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as Blob);
            }
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Sản phẩm được cập nhật thành công!');
            router.push('/admin/products');
        } catch (error) {
            message.error('Error updating user');
        } finally {
            setLoading(false);
        }
    }


    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/products')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={{ ...product, category: product.category }}>
                    <Form.Item label='Name' name='name'>
                        <Input
                            value={product.image}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Description' name='description'>
                        <Input
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Vui lòng chọn category!' }]}
                    >
                        <Select
                            placeholder="Chọn Category"
                            onChange={(value) => setProduct((prev) => ({ ...prev!, category: value }))}
                            value={product.category || undefined}
                        >
                            {categories.map((category) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => e && e.fileList}
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh hồ sơ!' }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onPreview={(file) => {
                                setPreviewImage(file.url ?? file.thumbUrl ?? '');
                                setPreviewOpen(true);
                            }}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && <PlusOutlined />}
                        </Upload>
                        <Modal
                            open={previewOpen}
                            footer={null}
                            onCancel={() => setPreviewOpen(false)}
                            width={800}
                        >
                            <img alt="preview" src={previewImage} style={{ width: '100%' }} />
                        </Modal>
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}

export default EditProductPage