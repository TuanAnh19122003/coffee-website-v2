'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Contact } from '../../interfaces/Contact';

function CreateContactPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values: Contact) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('subjectName', values.subjectName);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('note', values.note);

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            message.success('Successfully created');
            router.push('/admin/contacts');
        } catch (error) {
            message.error('Failed to create contact');
            console.error(error);
        }
        setLoading(false);
    }
    return (
        <div className="bg-white rounded-b-lg">
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/contacts')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="firstName"
                        name="firstName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên role!' }]}
                    >
                        <Input placeholder="First Name...." />
                    </Form.Item>

                    <Form.Item
                        label="lastName"
                        name="lastName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Last Name...." />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                            {
                                pattern: /@/,
                                message: 'Email phải chứa ký tự @',
                                validateTrigger: "onChange",
                            },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)$/,
                                message: 'Tên miền chỉ chứa chữ, số, dấu chấm (.) và dấu gạch ngang (-)',
                                validateTrigger: "onChange",
                            },
                            {
                                pattern: /\.[a-zA-Z]{2,}$/,
                                message: 'Tên miền phải có phần mở rộng hợp lệ (VD: .com, .vn, .org)',
                                validateTrigger: "onChange",
                            }
                        ]}
                    >
                        <Input placeholder="Email..." />
                    </Form.Item>

                    <Form.Item
                        label="PhoneNumber"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, message: 'Vui lòng nhập đúng định dạng số điện thoại!' }
                        ]}
                        validateTrigger="onChange"
                    >
                        <Input placeholder="Phone Number...." />
                    </Form.Item>

                    <Form.Item
                        label="SubjectName"
                        name="subjectName"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Subject Name...." />
                    </Form.Item>

                    <Form.Item
                        label="Note"
                        name="note"
                        rules={[{ required: false, message: 'Vui lòng nhập ghi chú!' }]}
                    >
                        <Input.TextArea placeholder="Note...." />
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

export default CreateContactPage