"use client";
import React, { useState, useEffect } from "react";
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

    // Kiểm tra xem người dùng đã đăng nhập chưa
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { withCredentials: true });
                if (res.status === 200 && res.data.user) {
                    if (res.data.user.role.includes("Admin")) {
                        router.replace("/admin");
                    } else {
                        router.replace("/coffee");
                    }
                }
            } catch (error) {
                console.log("Người dùng chưa đăng nhập");
            }
        };
        checkAuth();
    }, [router]);

    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        message.loading({ content: "Đang đăng nhập...", key: "login" });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, values, { withCredentials: true });
            if (response.status >= 200 && response.status < 300) {
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
                const user = response.data.user;
                message.success({ content: "Đăng nhập thành công!", key: "login" });
                setTimeout(() => {
                    if (user.role.includes("Admin")) {
                        router.replace("/admin");
                    } else {
                        router.replace("/coffee");
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
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
                        Chưa có tài khoản? <Link href="/coffee/auth/register" className="text-blue-500 hover:underline">Đăng ký</Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;
