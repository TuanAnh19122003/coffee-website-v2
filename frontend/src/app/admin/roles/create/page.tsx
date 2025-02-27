'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card } from 'antd';

const CreateRolePage = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: { name: string }) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/roles`, values);
            message.success('successfully created');
            router.push('/admin/roles');
        } catch (error) {
            message.error('Lỗi khi thêm role, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Card title="Create" variant="outlined" className="w-full max-w-lg shadow-lg">
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên role!' }]}
                    >
                        <Input placeholder="Role Name...." />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );

};

export default CreateRolePage;
