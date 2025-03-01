'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Order } from '../../interfaces/Order';
import { Product } from '../../interfaces/Product';
import { Product_size } from '../../interfaces/Product_size';
import { OrderItem } from '../../interfaces/OrderItem';

function CreateOrderItemPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [productSizes, setProductSizes] = useState<Product_size[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    
    // State lưu kích thước theo sản phẩm và giá theo kích thước
    const [filteredSizes, setFilteredSizes] = useState<Product_size[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productSizesRes, ordersRes, productsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
                ]);

                setProductSizes(productSizesRes.data);
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (data: OrderItem) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('price', data.price.toString());
            formData.append('quantity', data.quantity.toString());
            formData.append('order', data.order ? String(data.order) : '');
            formData.append('product', data.product ? String(data.product) : '');
            formData.append('size', data.size ? String(data.size) : '');

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order-items`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            message.success('Order item created successfully');
            router.push('/admin/order-items');
        } catch (error) {
            message.error('Failed to create order item');
        } finally {
            setLoading(false);
        }
    };

    // Khi chọn sản phẩm -> Lọc danh sách kích thước
    const handleProductChange = (productId: number) => {
        const sizesForProduct = productSizes.filter(size => size.product.id === productId);
        setFilteredSizes(sizesForProduct);
        form.setFieldsValue({ size: null, price: null });
        setSelectedPrice(null);
    };

    // Khi chọn kích thước -> Cập nhật giá
    const handleSizeChange = (sizeId: number) => {
        const selectedSize = productSizes.find(size => size.id === sizeId);
        if (selectedSize) {
            setSelectedPrice(selectedSize.price);
            form.setFieldsValue({ price: selectedSize.price });
        }
    };

    return (
        <div>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/order-items')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Order"
                        name="order"
                        rules={[{ required: true, message: 'Vui lòng chọn order!' }]}
                    >
                        <Select>
                            {orders.map((order) => (
                                <Select.Option key={order.id} value={order.id}>
                                    {order.user.lastname} {order.user.firstname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Product"
                        name="product"
                        rules={[{ required: true, message: 'Vui lòng chọn product!' }]}
                    >
                        <Select onChange={handleProductChange}>
                            {products.map((product) => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Size"
                        name="size"
                        rules={[{ required: true, message: 'Vui lòng chọn size!' }]}
                    >
                        <Select onChange={handleSizeChange} disabled={filteredSizes.length === 0}>
                            {filteredSizes.map((size) => (
                                <Select.Option key={size.id} value={size.id}>
                                    {size.size} - {size.price} VND
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <Input type='number' placeholder="Total price..." value={selectedPrice ?? ''} readOnly />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <Input type='number' placeholder="Enter quantity..." min={1} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default CreateOrderItemPage;
