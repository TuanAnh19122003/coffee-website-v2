'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Card, Modal, Upload } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { User } from '../../interfaces/User';
import type { UploadFile } from 'antd';

const CreateUserPage = () => {
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const router = useRouter();

    const onFinish = async (values: User) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('firstname', values.firstname);
            formData.append('lastname', values.lastname);
            formData.append('phone', values.phone);
            formData.append('address', values.address);

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as Blob);
            }

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('User created successfully');
            router.push('/admin/users');
        } catch (error) {
            message.error('Failed to create user');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/users')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout="vertical" onFinish={onFinish}>
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
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 8, message: 'Mật khẩu phải ít nhất 8 ký tự!' },
                            { max: 20, message: 'Mật khẩu phải nhiều nhất 20 ký tự!' },
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, message: 'Mật khẩu phải bao gồm chữ hoa, chữ thư��ng, số và ký tự đặc biệt!' },
                        ]}
                    >
                        <Input.Password placeholder="Password...." />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstname"
                        rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                    >
                        <Input placeholder="First Name...." />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastname"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Last Name...." />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ!' }]}
                    >
                        <Input placeholder="Phone...." />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Address...." />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => e && e.fileList}
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh hồ sơ!' }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            onPreview={(file) => {
                                setPreviewImage(file.url ?? file.thumbUrl ?? '');

                                setPreviewOpen(true);
                            }}
                        >
                            {fileList.length < 1 && <PlusOutlined />}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Create
                        </Button>

                    </Form.Item>
                </Form>

            </div>

            <Modal
                open={previewOpen}
                title="Preview Image"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}

export default CreateUserPage;
