"use client";

import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";

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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f7fa" }}>
            <Card style={{ maxWidth: 400, width: "100%", padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Title level={3} style={{ color: "#1890ff" }}>Quên mật khẩu?</Title>
                <Text type="secondary">Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</Text>
                <Form onFinish={handleSubmit} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                        <Input prefix={<MailOutlined />} type="email" placeholder="Nhập email" size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        Gửi yêu cầu
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
