'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Card, Modal, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { Product } from '@/app/admin/interfaces/Product';
import { Product_size } from '@/app/admin/interfaces/Product_size';

function EditProductSizePage() {
    const params = useParams();
    const router = useRouter();
    const productSizeId = params.id;
    const [productSize, setProductSize] = useState<Product_size | null>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!productSizeId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes/${productSizeId}`);
                const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(productResponse.data);
                setProductSize({
                    ...response.data,
                    product: response.data.product?.id || null,
                });
            } catch (error) {
                message.error('Error fetching product size data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    },[productSizeId])

    const handleSubmit = async (values: Product_size) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes/${productSizeId}`, values);
            message.success('Product size updated successfully');
            router.push('/admin/product-sizes');
        } catch (error) {
            message.error('Failed to update product size');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (!productSize) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-sizes')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={{ ...productSize, category: productSize.product }}>

                    <Form.Item label='Size' name='size'>
                        <Input
                            value={productSize.size}
                            onChange={(e) => setProductSize({ ...productSize, size: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Price' name='price'>
                        <Input
                            value={productSize.price}
                            onChange={(e) => setProductSize({ ...productSize, price: Number(e.target.value)})}
                        />
                    </Form.Item>
                    <Form.Item
                        name="product"
                        label="Product"
                        rules={[{ required: true, message: 'Vui lòng chọn product!' }]}
                    >
                        <Select
                            placeholder="Chọn Product"
                            onChange={(value) => setProductSize((prev) => ({ ...prev!, product: value }))}
                            value={productSize.product || undefined}
                        >
                            {products.map((product) => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
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

export default EditProductSizePage