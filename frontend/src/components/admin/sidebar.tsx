'use client'
import React from 'react'
import { LaptopOutlined, SafetyOutlined, AppstoreOutlined, NotificationOutlined, UserOutlined, KeyOutlined, ColumnWidthOutlined, ShoppingCartOutlined, StarOutlined, TagsOutlined  } from "@ant-design/icons";

import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import path from 'path';

const menuItems = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: 'Quản lý người dùng',
        children: [
            { key: '/admin/roles', icon: <SafetyOutlined />, label: 'Quyền' },
            { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng'},
            { key: '/admin/userRoles', icon: <KeyOutlined />, label: 'Phân quyền' },
        ]
    },
    {
        key: '2',
        icon: <AppstoreOutlined />,
        label: 'Quản lý Sản phẩm',
        children: [
            { key: '/admin/categories', icon: <TagsOutlined />, label: 'Loại sản phẩm' }, 
            { key: '/admin/products', icon: <ShoppingCartOutlined />, label: 'Sản phẩm' },
            { key: '/admin/sizes', icon: <ColumnWidthOutlined />, label: 'Size' },
            { key: '/admin/special-products', icon: <StarOutlined />, label: 'Sản phẩm đặc biệt' },
        ]
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