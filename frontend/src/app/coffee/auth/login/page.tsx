"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function LoginPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        message.loading({ content: "Đang đăng nhập...", key: "login" });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, values, { withCredentials: true });
            if (response.status >= 200 && response.status < 300) {
                const user = response.data.user;
                message.success({ content: "Đăng nhập thành công!", key: "login" });
                setTimeout(() => {
                    router.replace("/coffee");
                }, 1000);
            }
        } catch (error: any) {
            message.error({ content: "Sai email hoặc mật khẩu!", key: "login" });
            return;
        }
         finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg bg-white">
                <div className="text-center mb-6">
                    <Title level={3} className="text-gray-700">Đăng Nhập</Title>
                    <Text type="secondary">Vui lòng nhập thông tin của bạn</Text>
                </div>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nhập email" size="large" />
                    </Form.Item>

                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center mt-4">
                    <Text className="text-gray-500">
                        Chưa có tài khoản? <Link href="/auth/register" className="text-blue-500 hover:underline">Đăng ký</Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;
