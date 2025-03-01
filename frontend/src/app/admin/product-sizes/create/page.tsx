'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Modal, Upload, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Product } from '../../interfaces/Product';
import { Product_size } from '../../interfaces/Product_size';

function CreatProductSizePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                message.error('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    },[])

    const onFinish = async (values: Product_size) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('size', values.size);
        formData.append('price', values.price.toString());
        formData.append('product', values.product ? String(values.product) : '');

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes`, formData,{
                headers: {
                    'Content-Type':'application/json'
                }
            });
            message.success('Product size created successfully');
            router.push('/admin/product-sizes');
        } catch (error) {
            message.error('Failed to create product size');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-sizes')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Size"
                        name="size"
                        rules={[{ required: true, message: 'Vui lòng nhập đúng định dạng name!' }]}
                    >
                        <Input placeholder="Size...." />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: false, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input type='number' placeholder="Price...." />
                    </Form.Item>

                    <Form.Item
                        label='Product'
                        name='product'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn Product!',
                            },
                        ]}
                    >
                        <Select>
                            {products.map((product) => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>

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

export default CreatProductSizePage