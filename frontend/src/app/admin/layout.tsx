'use client'
import React from 'react'
import { Layout, Breadcrumb, theme } from "antd";
import Header from '@/components/admin/Header'
import Footer from '@/components/admin/Footer'
import Sidebar from '@/components/admin/Sidebar'
import '@ant-design/v5-patch-for-react-19';

const { Content, Sider } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Sidebar />
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Breadcrumb items={[{ title: "Home" }, { title: "List" }, { title: "App" }]} style={{ margin: "16px 0" }} />
                    <Content style={{ padding: 24, margin: 0, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        {children}
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </Layout>
    )
}

export default AdminLayout