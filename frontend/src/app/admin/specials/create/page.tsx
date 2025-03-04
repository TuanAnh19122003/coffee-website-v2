'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, DatePicker, Col, Row } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Special } from '../../interfaces/Special';

function CreateSpecialPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: Special) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('special_name', values.special_name);
        formData.append('discount_percentage', values.discount_percentage.toString());
        formData.append('start_date', values.start_date.toLocaleString());
        formData.append('end_date', values.end_date.toLocaleString());
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/specials`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                message.success('Special created successfully');
                router.push('/admin/specials');
            } else {
                message.error('Failed to create special');
            }
        } catch (error) {
            message.error('Failed to create special');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/categories')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Special name"
                        name="special_name"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung khuyến mại!' }]}
                    >
                        <Input placeholder="special name...." />
                    </Form.Item>

                    <Form.Item
                        label="Discount"
                        name="discount_percentage"
                        rules={[{ required: false, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input type='number' placeholder="discount_percentage...." />
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

export default CreateSpecialPage