'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Card, Modal, Upload } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

import { User } from '../../../interfaces/User';

function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
                setUser(response.data);
                if (response.data.image) {
                    setFileList([
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: `${process.env.NEXT_PUBLIC_API_URL}${response.data.image}`,
                        },
                    ]);
                }
            } catch (error) {
                message.error('Error fetching user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleUpdate = async (values: User) => {
        setLoading(true);
        try {
            const formData = new FormData();
            // Append form fields to FormData
            for (let key in values) {
                formData.append(key, (values as any)[key]);
            }

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as Blob);
            }
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('User updated successfully!');
            router.push('/admin/users');
        } catch (error) {
            message.error('Error updating user');
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/users')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleUpdate} initialValues={user}>
                    <Form.Item label='First Name' name='firstname'>
                        <Input
                            value={user.firstname}
                            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Last Name' name='lastname'>
                        <Input
                            value={user.lastname}
                            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Email' name='email'>
                        <Input
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Password' name='password'>
                        <Input
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            type='password'
                        />
                    </Form.Item>

                    <Form.Item label='Phone' name='phone'>
                        <Input
                            value={user.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Address' name='address'>
                        <Input
                            value={user.address}
                            onChange={(e) => setUser({ ...user, address: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Image"
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
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && <PlusOutlined />}
                        </Upload>
                        <Modal
                            open={previewOpen}
                            footer={null}
                            onCancel={() => setPreviewOpen(false)}
                            width={800}
                        >
                            <img alt="preview" src={previewImage} style={{ width: '100%' }} />
                        </Modal>
                    </Form.Item>

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

export default EditUserPage