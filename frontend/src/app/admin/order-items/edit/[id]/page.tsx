'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Order } from '../../../interfaces/Order';
import { Product } from '../../../interfaces/Product';
import { Product_size } from '../../../interfaces/Product_size';
import { OrderItem } from '../../../interfaces/OrderItem';

function EditOrderItemPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { id } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [productSizes, setProductSizes] = useState<Product_size[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredSizes, setFilteredSizes] = useState<Product_size[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [orderItem, setOrderItem] = useState<OrderItem | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchOrderItem = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order-items/${id}`);
                const orderItem = res.data;
                
                // Lọc danh sách size theo sản phẩm cũ
                const sizesForProduct = productSizes.filter(size => size.product.id === orderItem.product.id);
                setFilteredSizes(sizesForProduct);
    
                // Cập nhật lại giá từ size cũ
                setSelectedPrice(orderItem.price);
    
                // Gán dữ liệu cũ vào form
                form.setFieldsValue({
                    order: orderItem.order.id,
                    product: orderItem.product.id,
                    size: orderItem.size.id,
                    price: orderItem.price,
                    quantity: orderItem.quantity
                });
            } catch (error) {
                console.error('Failed to fetch order item:', error);
            }
        };
    
        if (id) {
            fetchOrderItem();
        }
    }, [id, productSizes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes, productSizesRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-sizes`)
                ]);
    
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
                setProductSizes(productSizesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    

    const onFinish = async (data: OrderItem) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/order-items/${id}`, data);
            message.success('Order item updated successfully');
            router.push('/admin/order-items');
        } catch (error) {
            message.error('Failed to update order item');
        } finally {
            setLoading(false);
        }
    };

    const handleProductChange = (productId: number) => {
        const sizesForProduct = productSizes.filter(size => size.product.id === productId);
        setFilteredSizes(sizesForProduct);
        form.setFieldsValue({ size: null, price: null });
        setSelectedPrice(null);
    };

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
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/order-items')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Form.Item label='Order' name='order' rules={[{ required: true }]}> 
                        <Select>
                            {orders.map(order => (
                                <Select.Option key={order.id} value={order.id}>
                                    {order.user.lastname} {order.user.firstname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label='Product' name='product' rules={[{ required: true }]}> 
                        <Select onChange={handleProductChange}>
                            {products.map(product => (
                                <Select.Option key={product.id} value={product.id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label='Size' name='size' rules={[{ required: true }]}> 
                        <Select onChange={handleSizeChange} disabled={filteredSizes.length === 0}>
                            {filteredSizes.map(size => (
                                <Select.Option key={size.id} value={size.id}>
                                    {size.size} - {size.price} VND
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label='Price' name='price' rules={[{ required: true }]}> 
                        <Input type='number' readOnly value={selectedPrice ?? ''} />
                    </Form.Item>
                    
                    <Form.Item label='Quantity' name='quantity' rules={[{ required: true }]}> 
                        <Input type='number' min={1} />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={loading}> Update </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default EditOrderItemPage;
