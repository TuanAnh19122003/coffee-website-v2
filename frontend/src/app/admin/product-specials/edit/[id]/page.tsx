'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Select, DatePicker, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Product } from '@/app/admin/interfaces/Product';
import { Product_special } from '@/app/admin/interfaces/Product_special';

function EditProductSpecialPage() {
    const params = useParams();
    const router = useRouter();
    const productSpecialId = params.id;

    const [productSpecial, setProductSpecial] = useState<Product_special | null>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!productSpecialId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${productSpecialId}`);
                const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(productResponse.data);

                setProductSpecial({
                    ...data,
                    product: data.product?.id || null,
                    start_date: data.start_date ? dayjs(data.start_date) : null,
                    end_date: data.end_date ? dayjs(data.end_date) : null,
                });
            } catch (error) {
                message.error('Lỗi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productSpecialId]);

    const handleSubmit = async (values: Product_special) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${productSpecialId}`, {
                ...values,
                start_date: values.start_date.toLocaleString(),
                end_date: values.end_date.toLocaleString(),
            });
            message.success('Product special updated successfully');
            router.push('/admin/product-specials');
        } catch (error) {
            message.error('Failed to update product special');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!productSpecial) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white rounded-b-lg p-4'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Edit Product Special</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-specials')}>
                    Back
                </Button>
            </div>
            <Form layout='vertical' onFinish={handleSubmit} initialValues={productSpecial}>
                <Form.Item label='Name' name='special_name' rules={[{ required: true, message: 'Vui lòng nhập size' }]}>
                    <Input
                        value={productSpecial.special_name}
                        onChange={(e) => setProductSpecial({ ...productSpecial, special_name: e.target.value })}
                    />
                </Form.Item>

                <Form.Item label='Discount' name='discount_percentage' rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                    <Input
                        type="number"
                        value={productSpecial.discount_percentage}
                        onChange={(e) => setProductSpecial({ ...productSpecial, discount_percentage: Number(e.target.value) })}
                    />
                </Form.Item>

                <Form.Item name="product" label="Product" rules={[{ required: true, message: 'Vui lòng chọn product!' }]}>
                    <Select placeholder="Chọn Product">
                        {products.map((product) => (
                            <Select.Option key={product.id} value={product.id}>
                                {product.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Start Date & End Date trên cùng một hàng */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Start Date"
                            name="start_date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="End Date"
                            name="end_date"
                            dependencies={['start_date']}
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue('start_date');
                                        if (!startDate || !value || value.isAfter(startDate)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('End Date phải lớn hơn Start Date!'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default EditProductSpecialPage;
