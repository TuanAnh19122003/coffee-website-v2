'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Select, DatePicker } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Order } from '../../interfaces/Order';
import { User } from '../../interfaces/User';

function CreateOrderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setUsers(user.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values: Order) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('total_price', values.total_price.toString());
        formData.append('status', values.status);
        formData.append('order_date', values.order_date.toLocaleString())
        formData.append('user', values.user ? String(values.user) : '');
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            message.success('Order created successfully');
            router.push('/admin/orders');
        } catch (error) {
            console.error(error);
            message.error('Failed to create order');
        }
        setLoading(false);
    }
    return (
        <div>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/orders')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Total Price"
                        name="total_price"
                        rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
                    >
                        <Input type='number' placeholder="total price...." />
                    </Form.Item>

                    <Form.Item
                        label="Order Date"
                        name="order_date"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày đặt đơn hàng' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label='User'
                        name='user'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn user!',
                            },
                        ]}
                    >
                        <Select>
                            {users.map((user) => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.lastname} {user.firstname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            {[
                                { value: "pending", label: "Chờ xử lý" },
                                { value: "completed", label: "Đang hoàn thành đơn" },
                                { value: "cancelled", label: "Đã hủy" },
                            ].map((status) => (
                                <Select.Option key={status.value} value={status.value}>
                                    {status.label}
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
    );
};

export default CreateOrderPage