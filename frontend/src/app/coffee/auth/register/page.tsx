"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;


function RegisterPage() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [generatedCode, setGeneratedCode] = useState("");

    useEffect(() => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let counter = 0;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            counter += 1;
        }
        setGeneratedCode(result);
    }, []);

    const handleSubmit = async (values: any) => {
        if (values.verificationCode !== generatedCode) {
            message.error("Incorrect verification code");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                email: values.email,
                password: values.password,
                firstname: values.firstname,
                lastname: values.lastname,
            });

            if (response.status >= 200 && response.status < 300) {
                message.success("Registration successful!");
                localStorage.setItem("registeredEmail", values.email);
                setTimeout(() => router.push("/coffee/auth/login"), 1500);
            } else {
                message.error("Registration failed!");
            }
        } catch (error) {
            message.error("An error occurred!");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <Title level={2} className="text-center">Register</Title>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: "First Name is required" }]}>
                    <Input placeholder="Enter your first name" />
                </Form.Item>

                <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: "Last Name is required" }]}>
                    <Input placeholder="Enter your last name" />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[
                    { required: true, message: "Password is required" },
                    { min: 6, message: "Password must be at least 6 characters" },
                    { pattern: /[A-Z]/, message: "Must contain an uppercase letter" },
                    { pattern: /[a-z]/, message: "Must contain a lowercase letter" },
                    { pattern: /[0-9]/, message: "Must contain a number" },
                    { pattern: /[^A-Za-z0-9]/, message: "Must contain a special character" }
                ]}>
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["password"]} hasFeedback
                    rules={[{ required: true, message: "Confirm your password" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Passwords do not match!");
                        },
                    })]}>
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Form.Item
                    name="verificationCode"
                    label="Verification Code"
                    rules={[{ required: true, message: "Enter the verification code" }]}
                >
                    <Input placeholder="Enter the verification code" />
                </Form.Item>
                <Text type="secondary">Verification Code: {generatedCode}</Text>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>Register</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage