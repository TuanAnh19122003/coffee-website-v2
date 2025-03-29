"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { LockOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            message.error("Token không hợp lệ!");
            router.replace("/coffee/auth/login");
        }
    }, [token, router]);

    const handleSubmit = async (values: { newPassword: string; confirmPassword: string; captcha: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Mật khẩu nhập lại không khớp!");
            return;
        }

        if (captchaInput !== captcha) {
            message.error("Mã xác nhận không đúng!");
            setCaptcha(generateCaptcha());
            return;
        }


        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                token,
                newPassword: values.newPassword,
                captcha: values.captcha,
            });

            if (response.status === 200) {
                message.success("Mật khẩu đã được đặt lại thành công!");
                router.push("/coffee/auth/login");
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f6f9" }}>
            <Card style={{ width: 400, padding: 20, borderRadius: 10, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                    <LockOutlined style={{ fontSize: 36, color: "#1890ff" }} />
                </div>
                <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>Đặt lại mật khẩu</Title>
                <Text style={{ display: "block", textAlign: "center", marginBottom: 20, color: "#666" }}>
                    Nhập mật khẩu mới để hoàn tất quá trình đặt lại mật khẩu.
                </Text>
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Password is required" },
                            { min: 6, message: "Password must be at least 6 characters" },
                            { pattern: /[A-Z]/, message: "Must contain an uppercase letter" },
                            { pattern: /[a-z]/, message: "Must contain a lowercase letter" },
                            { pattern: /[0-9]/, message: "Must contain a number" },
                            { pattern: /[^A-Za-z0-9]/, message: "Must contain a special character" }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["newPassword"]} hasFeedback
                        rules={[{ required: true, message: "Confirm your password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("Passwords do not match!");
                            },
                        })]}>
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                    <Form.Item label="Mã xác nhận">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "bold", background: "#eef", padding: "5px 10px", borderRadius: "5px" }}>{captcha}</span>
                            <Button icon={<ReloadOutlined />} onClick={() => setCaptcha(generateCaptcha())} />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="captchaInput"
                        rules={[{ required: true, message: "Vui lòng nhập mã xác nhận!" }]}
                    >
                        <Input placeholder="Nhập mã captcha" onChange={(e) => setCaptchaInput(e.target.value)} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Xác nhận đặt lại mật khẩu
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;