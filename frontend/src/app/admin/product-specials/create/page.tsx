'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Modal, Upload, Select, DatePicker, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Product } from '../../interfaces/Product';
import { Product_special } from '../../interfaces/Product_special';


function CreateProductSpecialPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values: Product_special) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('special_name', values.special_name);
        formData.append('discount_percentage', values.discount_percentage.toString());
        formData.append('start_date', values.start_date.toLocaleString());
        formData.append('end_date', values.end_date.toLocaleString());
        formData.append('product', values.product ? String(values.product) : '');
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product-specials`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            message.success('Product special created successfully!');
            router.push('/admin/product-specials');
        } catch (error) {
            message.error('Error creating product special');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-specials')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Special Name"
                        name="special_name"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung khuyến mãi' }]}
                    >
                        <Input placeholder="special name...." />
                    </Form.Item>

                    <Form.Item
                        label="Discount"
                        name="discount_percentage"
                        rules={[{ required: false, message: 'Vui lòng nhập giảm giá!' }]}
                    >
                        <Input type='number' placeholder="Discount...." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Start Date"
                                name="start_date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu khuyến mãi' }]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc khuyến mãi' }]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

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

export default CreateProductSpecialPage