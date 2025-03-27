"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Form, Input, Button, Card, message, Typography } from "antd";

const { Title } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            message.error("Token không hợp lệ!");
            router.replace("/coffee/auth/login");
        }
    }, [token, router]);

    const handleSubmit = async (values: { newPassword: string }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                token,
                newPassword: values.newPassword,
            });

            if (response.status === 200) {
                message.success("Mật khẩu đã được đặt lại thành công!");
                router.push("/login");
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
            <Title level={3} style={{ textAlign: "center" }}>Đặt lại mật khẩu</Title>
            <Form onFinish={handleSubmit} layout="vertical" style={{ marginTop: 20 }}>
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Xác nhận
                </Button>
            </Form>
        </Card>
    );
};

export default ResetPassword;
