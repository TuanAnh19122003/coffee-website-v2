"use client";
import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, message, Typography } from "antd";

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { email: string }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, values);
            if (response.status === 200) {
                message.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
            <Title level={3} style={{ textAlign: "center" }}>Quên mật khẩu</Title>
            <Text>Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</Text>
            <Form onFinish={handleSubmit} layout="vertical" style={{ marginTop: 20 }}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                    <Input type="email" placeholder="Nhập email" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Gửi yêu cầu
                </Button>
            </Form>
        </Card>
    );
};

export default ForgotPassword;
