'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Col, DatePicker, Form, Input, message, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Special } from '@/app/admin/interfaces/Special';
import dayjs from 'dayjs';


function EditSpecialPage() {
    const params = useParams();
    const router = useRouter();
    const specialId = params.id;

    const [specials, setSpecialData] = useState<Special | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!specialId) return;
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/specials/${specialId}`);
                setSpecialData({
                    ...data,
                    start_date: data.start_date ? dayjs(data.start_date) : null,
                    end_date: data.end_date ? dayjs(data.end_date) : null,
                });
            } catch (error) {
                message.error('Error fetching category');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [specialId])

    const handleSubmit = async (values: Special) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/specials/${specialId}`, {
                ...values,
                start_date: values.start_date.toLocaleString(),
                end_date: values.end_date.toLocaleString(),
            });
            message.success('Khuyến mại được cập nhật thành công!');
            router.push('/admin/specials');
        } catch (error: any) {
            message.error('Error updating Special', error.message);
        } finally {
            setLoading(false);
        }
    }

    if (!specials) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/specials')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={specials}>

                    <Form.Item label='Special name' name='special_name'>
                        <Input
                            value={specials.special_name}
                            onChange={(e) => setSpecialData({ ...specials, special_name: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Discount' name='discount_percentage'>
                        <Input
                            type='number'
                            value={specials.discount_percentage}
                            onChange={(e) => setSpecialData({ ...specials, discount_percentage: Number(e.target.value) })}
                        />
                    </Form.Item>

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

        </div>
    )
}

export default EditSpecialPage