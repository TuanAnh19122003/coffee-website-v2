'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { Special } from '../../../interfaces/Special';
import { Product } from '../../../interfaces/Product';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

function EditProductSpecialPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [specials, setSpecials] = useState<Special[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return; // Nếu id chưa có, không thực hiện fetch

        const fetchData = async () => {
            try {
                const [specialRes, productRes, product_specialRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/specials`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${id}`)
                ]);
                setSpecials(specialRes.data);
                setProducts(productRes.data);
                form.setFieldsValue({
                    productId: product_specialRes.data.product.id,
                    specialId: product_specialRes.data.special.id,
                });
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu!');
            }
        };
        fetchData();
    }, [id, form]);

    const handleSubmit = async (values: any) => {
        if (!id) return; // Nếu không có id, không thực hiện update

        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product-specials/${id}`, values);
            message.success('Cập nhật thành công!');
            router.push('/admin/product-specials');
        } catch (error) {
            message.error('Lỗi khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type="default" icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/product-specials')}>
                    Back
                </Button>
            </div>
            <div>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Vui lòng chọn product!' }]}>
                        <Select placeholder="Chọn product">
                            {products.map((product) => (
                                <Option key={product.id} value={product.id}>{`${product.name}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="specialId" label="Special" rules={[{ required: true, message: 'Vui lòng chọn special!' }]}>
                        <Select placeholder="Chọn special">
                            {specials.map((special) => (
                                <Option key={special.id} value={special.id}>{special.special_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditProductSpecialPage