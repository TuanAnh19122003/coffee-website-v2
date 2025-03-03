"use client";
import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { motion } from "framer-motion";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ContactPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { 
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        subjectName: string;
        note: string;
    }) => {
        setLoading(true);
        message.loading({ content: "Submitting contact...", key: "contact" });

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/contacts/`,
                values
            );

            if (response.status >= 200 && response.status < 300) {
                message.success({ content: "Contact submitted successfully!", key: "contact" });
                form.resetFields();
            } else {
                message.error({ content: "Failed to submit contact, please try again.", key: "contact" });
            }
        } catch (error) {
            message.error({ content: "Submission failed, please try again.", key: "contact" });
        }

        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg flex flex-col md:flex-row"
        >
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
                <img 
                    src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg" 
                    alt="Contact Us" 
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                />

                <Title level={3} className="text-center">Contact Information</Title>
                <Paragraph className="flex items-center gap-2">
                    <MailOutlined /> support@example.com
                </Paragraph>
                <Paragraph className="flex items-center gap-2">
                    <PhoneOutlined /> +1 234 567 890
                </Paragraph>
                <Paragraph className="flex items-center gap-2">
                    <EnvironmentOutlined /> 123 Main Street, New York, USA
                </Paragraph>
            </div>

            {/* Right Section: contact Form */}
            <div className="w-full md:w-1/2 p-6">
                <Title level={2} className="text-center">Submit Contact</Title>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "First Name is required" }]}> 
                            <Input placeholder="Enter your first name" />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Last Name is required" }]}> 
                            <Input placeholder="Enter your last name" />
                        </Form.Item>
                    </div>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}> 
                        <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Phone" rules={[{ required: true, message: "Phone number is required" }]}> 
                        <Input placeholder="Enter your phone number" />
                    </Form.Item>
                    <Form.Item name="subjectName" label="Subject" rules={[{ required: true, message: "Subject is required" }]}> 
                        <Input placeholder="Enter the subject" />
                    </Form.Item>
                    <Form.Item name="note" label="Note"> 
                        <Input.TextArea rows={4} placeholder="Enter your contact" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </motion.div>
    );
}

export default ContactPage