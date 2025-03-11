'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin, Avatar, Row, Col, Typography, Button, Divider, Input, Form, message, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { User } from '@/app/admin/interfaces/User';

const { Title, Text } = Typography;
function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [newImage, setNewImage] = useState<RcFile | null>(null);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { withCredentials: true })
            .then(response => {
                console.log('User data from backend:', response.data); // Log dữ liệu trả về từ BE
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setLoading(false);
            });
    }, []);
    

    const handleEdit = () => {
        console.log('User data:', user);  // Kiểm tra dữ liệu người dùng
        setEditing(true);
        if (user) {
            form.setFieldsValue({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                password: '',
            });
        }
    };
    
    

    const handleImageChange = (file: RcFile) => {
        setNewImage(file);
        message.success('Image selected.');
        return false;
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const formData = new FormData();
            formData.append('firstname', values.firstname);
            formData.append('lastname', values.lastname);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('address', values.address);

            if (values.password) {
                formData.append('password', values.password);
            }

            if (newImage) {
                formData.append('image', newImage);
            }

            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, formData, {
                withCredentials: true,
            })
                .then(response => {
                    setUser(response.data.user);
                    setEditing(false);
                    setNewImage(null);
                    message.success('Profile updated successfully!');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error updating profile:', error);
                    message.error('Failed to update profile!');
                });
        });
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setNewImage(null);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '50px 20px', backgroundColor: '#f7f7f7' }}>
            <Row justify="center">
                <Col span={24} xl={14}>
                    <Card
                        title="User Information"
                        style={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '20px' }}
                        hoverable
                    >
                        <Row gutter={16} align="middle">
                            <Col span={24} sm={8} style={{ textAlign: 'center' }}>
                                <Avatar
                                    size={240}
                                    shape="square"
                                    src={newImage ? URL.createObjectURL(newImage) : (user?.image ? `${process.env.NEXT_PUBLIC_API_URL}${user.image}` : <UserOutlined />)}
                                    style={{ marginBottom: '20px' }}
                                />

                                {editing && (
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={handleImageChange}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />}>Select Image</Button>
                                    </Upload>
                                )}
                            </Col>

                            <Col span={24} sm={16}>
                                <Title level={3}>{user?.lastname} {user?.firstname}</Title>
                                <Divider />
                                {!editing ? (
                                    <div style={{ marginBottom: '15px' }}>
                                        <Text style={{ fontSize: '16px' }}><strong>Email:</strong> {user?.email}</Text>
                                        <br />
                                        <Text style={{ fontSize: '16px' }}><strong>Phone:</strong> {user?.phone}</Text>
                                        <br />
                                        <Text style={{ fontSize: '16px' }}><strong>Address:</strong> {user?.address}</Text>
                                        <br />
                                    </div>
                                ) : (
                                    <Form form={form} layout="vertical">
                                        <Form.Item label="First Name" name="firstname" rules={[{ message: 'Please enter your first name' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Last Name" name="lastname" rules={[{ message: 'Please enter your last name' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address' }]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item label="New Password" name="password">
                                            <Input.Password placeholder="Leave blank to keep current password" />
                                        </Form.Item>
                                    </Form>
                                )}

                                <div style={{ marginTop: '20px' }}>
                                    {editing ? (
                                        <div>
                                            <Button type="default" block onClick={handleCancelEdit} style={{ fontSize: '16px', marginBottom: '10px' }}>
                                                Cancel Edit
                                            </Button>
                                            <Button type="primary" block onClick={handleSave} style={{ fontSize: '16px' }}>
                                                Save Changes
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button type="default" block onClick={handleEdit} style={{ fontSize: '16px' }}>
                                            Edit Information
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage