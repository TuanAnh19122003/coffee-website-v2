'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Card, Modal, Select, DatePicker } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { Order } from '@/app/admin/interfaces/Order';
import { User } from '@/app/admin/interfaces/User';

function EditOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!orderId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setUsers(userResponse.data);
                setOrder({
                    ...response.data,
                    order_date: response.data.order_date ? dayjs(response.data.order_date) : null,
                    user: response.data.user?.id || null,
                    shipping_address: response.data.shipping_address || "", // Lấy địa chỉ giao hàng
                });
            } catch (error) {
                message.error('Error fetching order');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderId]);

    const handleSubmit = async (values: Order) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, values);
            message.success('Order updated successfully');
            router.push('/admin/orders');
        } catch (error) {
            message.error('Failed to update order');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Chỉnh sửa đơn hàng</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/orders')}>
                    Quay lại
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={{ ...order, category: order.user }}>
                    <Form.Item label='Tổng tiền' name='total_price'>
                        <Input
                            type='number'
                            value={order.total_price}
                            onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày đặt hàng"
                        name="order_date"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className="w-full" />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status">
                        <Select
                            value={order.status}
                            onChange={(value) => setOrder({ ...order, status: value })}
                        >
                            <Select.Option value="pending">Đang xử lý</Select.Option>
                            <Select.Option value="completed">Hoàn thành</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="user"
                        label="Người đặt hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
                    >
                        <Select
                            placeholder="Chọn người dùng"
                            onChange={(value) => setOrder((prev) => ({ ...prev!, user: value }))}
                            value={order.user || undefined}
                        >
                            {users.map((user) => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.lastname} {user.firstname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ giao hàng"
                        name="shipping_address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập địa chỉ giao hàng..."
                            value={order.shipping_address}
                            onChange={(e) => setOrder((prev) => ({ ...prev!, shipping_address: e.target.value }))}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={loading}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default EditOrderPage;
