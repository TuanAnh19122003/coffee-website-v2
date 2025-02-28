'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { User } from '../../../interfaces/User';
import { Role } from '../../../interfaces/Role';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditUserRolePage = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const params = useParams(); // Lấy params từ useParams()
    const id = params?.id; // Giữ id dưới dạng string
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return; // Nếu id chưa có, không thực hiện fetch

        const fetchData = async () => {
            try {
                const [userRes, roleRes, userRoleRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userroles/${id}`)
                ]);
                setUsers(userRes.data);
                setRoles(roleRes.data);
                form.setFieldsValue({
                    userId: userRoleRes.data.user.id,
                    roleId: userRoleRes.data.role.id,
                });
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu!');
            }
        };
        fetchData();
    }, [id, form]);

    const handleSubmit = async (values: any) => {
        if (!id) return; // Nếu không có id, không thực hiện update

        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/userroles/${id}`, values);
            message.success('Cập nhật thành công!');
            router.push('/admin/userRoles');
        } catch (error) {
            message.error('Lỗi khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b pb-3 mb-4'>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type="default" icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/userRoles')}>
                    Back
                </Button>
            </div>
            <div>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="userId" label="User" rules={[{ required: true, message: 'Vui lòng chọn user!' }]}>
                        <Select placeholder="Chọn user" disabled>
                            {users.map((user) => (
                                <Option key={user.id} value={user.id}>{`${user.lastname} ${user.firstname}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="roleId" label="Role" rules={[{ required: true, message: 'Vui lòng chọn role!' }]}>
                        <Select placeholder="Chọn role">
                            {roles.map((role) => (
                                <Option key={role.id} value={role.id}>{role.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default EditUserRolePage;
