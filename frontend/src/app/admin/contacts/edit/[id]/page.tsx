'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Form, Input, message, Card } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { Contact } from '../../../interfaces/Contact';
function EditContactPage() {
    const params = useParams();
    const router = useRouter();
    const contactId = params.id;

    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!contactId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`);
                setContact(response.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch contact');
            }
            setLoading(false);
        };
        fetchData();
    }, [contactId]);

    const handleSubmit = async (values: Contact) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`, values);
            message.success('Contact updated successfully');
            router.push('/admin/contacts');
        } catch (error) {
            console.error(error);
            message.error('Failed to update contact');
        }
        setLoading(false);
    }
    
    if (!contact) return <div>Loading...</div>;
    
    return (
<div className='bg-white rounded-b-lg'>
            <div className='flex items-center justify-between border-b-2 pb-3 mb-4 '>
                <h1 className='text-lg font-semibold text-gray-800'>Edit</h1>
                <Button type='default' icon={<ArrowLeftOutlined />} size='middle' onClick={() => router.push('/admin/contacts')}>
                    Back
                </Button>
            </div>
            <div>
                <Form layout='vertical' onFinish={handleSubmit} initialValues={contact}>
                    <Form.Item label='First Name' name='firstName'>
                        <Input
                            value={contact.firstName}
                            onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Last Name' name='lastName'>
                        <Input
                            value={contact.lastName}
                            onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Phone Number' name='phoneNumber'>
                        <Input
                            value={contact.phoneNumber}
                            onChange={(e) => setContact({ ...contact, phoneNumber: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Email' name='email'>
                        <Input
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='Subject Name' name='subjectName'>
                        <Input
                            value={contact.subjectName}
                            onChange={(e) => setContact({ ...contact, subjectName: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label='note' name='note'>
                        <Input.TextArea
                            value={contact.note}
                            onChange={(e) => setContact({ ...contact, note: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}

export default EditContactPage