"use client";

import React from "react";
import { Layout, theme } from "antd";
import { AppHeader } from '@/components/user/Header';
import { AppFooter } from '@/components/user/Footer';
import { usePathname } from 'next/navigation';

const { Content } = Layout;

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <AppHeader />
            <Content style={{ padding: "24px", margin: "0", minHeight: "calc(100vh - 160px)", background: colorBgContainer, borderRadius: borderRadiusLG }}>
                {children}
            </Content>
            <AppFooter />
        </Layout>
    );
}

export default UserLayout;
