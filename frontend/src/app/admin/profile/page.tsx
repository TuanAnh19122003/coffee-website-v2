'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Modal, Upload, UploadFile } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { User } from '@/app/admin/interfaces/User';

function UserProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fetch current user data
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, { withCredentials: true });
                setUser(response.data.user);
                if (response.data.user.image) {
                    setFileList([
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: `${process.env.NEXT_PUBLIC_API_URL}${response.data.user.image}`,
                        },
                    ]);
                }
            } catch (error) {
                message.error('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleEdit = () => {
        setIsModalVisible(true);
    };

    const handleUpdate = async (values: User) => {
        setLoading(true);
        try {
            const formData = new FormData();
            for (let key in values) {
                formData.append(key, (values as any)[key]);
            }

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as Blob);
            }
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${user?.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Profile updated successfully!');
            setIsModalVisible(false);
            router.push('/coffee');
        } catch (error) {
            message.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto mt-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
                <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    size="middle"
                    onClick={() => router.push('/coffee')} // Redirect back to main page or dashboard
                >
                    Back
                </Button>
            </div>

            {/* Displaying user details */}
            <div className="flex items-center justify-between space-x-6 mb-6">
                <div className="w-32 h-32 overflow-hidden shadow-md">
                    {fileList.length > 0 && (
                        <img
                            src={fileList[0].url}
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>

                <div className="flex-1">
                    <div className="text-lg font-semibold">
                        {user.lastname} {user.firstname} 
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-sm">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.address}</div>

                    <Button
                        type="primary"
                        onClick={handleEdit}
                        className="mt-4"
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>

            <Modal
                title="Edit Profile"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" onFinish={handleUpdate} initialValues={user}>
                    <Form.Item label="First Name" name="firstname">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Last Name" name="lastname">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Address" name="address">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Profile Image" valuePropName="fileList" getValueFromEvent={(e: any) => e && e.fileList}>
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
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default UserProfilePage;
