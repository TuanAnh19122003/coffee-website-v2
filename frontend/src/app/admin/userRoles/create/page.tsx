'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { UserRole } from '../../interfaces/UserRole';
import { User } from '../../interfaces/User';
import { Role } from '../../interfaces/Role';

function CreateUserRolePage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roleRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                console.log('Roles:', roleRes.data);
                console.log('Users:', userRes.data);
    
                setRoles(roleRes.data);
                setUser(userRes.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                message.error('Không thể tải danh sách users hoặc roles!');
            }
        };
        fetchData();
    }, []);
    

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userroles`, {
                roleId: values.roleId,  // Đổi lại key cho đúng
                userId: values.userId,
            });
            message.success('Tạo role thành công!');
            router.push('/admin/userRoles');
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tạo role, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Create</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/userRoles')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label='Role'
                        name='roleId'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn role!',
                            },
                        ]}
                    >
                        <Select>
                            {roles.map((role) => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label='User'
                        name='userId'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn user!',
                            },
                        ]}
                    >
                        <Select>
                            {user.map((user) => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.lastname} {user.firstname}
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
    )
}

export default CreateUserRolePage