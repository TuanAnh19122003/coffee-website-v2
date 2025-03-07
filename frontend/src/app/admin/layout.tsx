'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Breadcrumb, theme } from "antd";
import Header from '@/components/admin/Header';
import Footer from '@/components/admin/Footer';
import Sidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

const { Content, Sider } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await fetch('http://localhost:5000/auth/me', {
                    credentials: 'include', // Quan trọng để gửi cookie
                });

                const data = await res.json();
                console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu nhận được

                if (data && data.role && Array.isArray(data.role)) {
                    if (data.role.includes('Admin')) {
                        setRole('Admin');
                    } else {
                        router.push('/403');
                    }
                } else {
                    console.error("Lỗi: Không tìm thấy 'role' trong dữ liệu");
                    router.push('/coffee/auth/login');
                }
            } catch (error) {
                console.error('Lỗi khi lấy role:', error);
                router.push('/login');
            }
        };

        fetchUserRole();
    }, [router]);

    const pathArray = pathname.split('/').filter((item) => item);
    const breadcrumbItems = pathArray.map((item, index) => ({
        title: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " "),
        href: "/" + pathArray.slice(0, index + 1).join("/"),
    }));

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Layout>
                <Sider width={250} style={{ background: colorBgContainer }}>
                    <Sidebar />
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
                    <Content style={{ padding: 24, margin: 0, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        {children}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
