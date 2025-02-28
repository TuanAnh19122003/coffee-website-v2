'use client'
import React from 'react'
import { LaptopOutlined, SafetyOutlined, NotificationOutlined, UserOutlined, KeyOutlined  } from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import path from 'path';

const menuItems = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: 'Phân quyền người dùng',
        children: [
            { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng'},
            { key: '/admin/roles', icon: <SafetyOutlined />, label: 'Quyền' },
            { key: '1.3', icon: <KeyOutlined />, label: 'Phân quyền' },
        ]
    },
    {
        key: '2',
        icon: <LaptopOutlined />,
        label: 'Dashboard',
    },
    {
        key: '3',
        icon: <NotificationOutlined />,
        label: 'Notifications',
    },
    {
        key: '4',
        icon: <UserOutlined />,
        label: 'Account',
    },
    {
        key: '5',
        icon: <LaptopOutlined />,
        label: 'Settings',
    },
    {
        key: '6',
        icon: <NotificationOutlined />,
        label: 'Notices',
    },
]


function Sidebar() {
    const router = useRouter();

    // ✅ Xử lý khi click vào menu
    const handleMenuClick: MenuProps["onClick"] = (e) => {
        router.push(e.key);
    };
    
    return (
        <aside>
            <Menu mode="inline" style={{ height: "100%", borderRight: 0 }} items={menuItems} onClick={handleMenuClick} />
        </aside>
    )
}

export default Sidebar