'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { UserRole } from '../../interfaces/UserRole';
import { Special } from '../../interfaces/Special';
import { Product } from '../../interfaces/Product';


function CreateProductSpecialPage() {
    const [loading, setLoading] = useState(false);
    const [specials, setSpecials] = useState<Special[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const specialRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/specials`);
                const productRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);

                setSpecials(specialRes.data);
                setProducts(productRes.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                message.error('Không thể tải danh sách special hoặc products!');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product-specials`, {
                productId: values.productId, 
                specialId: values.specialId,
            });
            message.success('Tạo product specials thành công!');
            router.push('/admin/product-specials');
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tạo product specials, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-specials')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label='Special'
                        name='specialId'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn special!',
                            },
                        ]}
                    >
                        <Select>
                            {specials.map((special) => (
                                <Select.Option key={special.id} value={special.id}>
                                    {special.special_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label='product'
                        name='productId'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn product!',
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