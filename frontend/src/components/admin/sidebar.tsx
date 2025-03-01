'use client'
import React from 'react'
import { ShoppingOutlined, ReconciliationOutlined, SafetyOutlined, AppstoreOutlined, ContactsOutlined, UserOutlined, KeyOutlined, ColumnWidthOutlined, ShoppingCartOutlined, StarOutlined, TagsOutlined, OrderedListOutlined  } from "@ant-design/icons";

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
            { key: '/admin/product-sizes', icon: <ColumnWidthOutlined />, label: 'Size' },
            { key: '/admin/product-specials', icon: <StarOutlined />, label: 'Sản phẩm đặc biệt' },
        ]
    },
    {
        key: '3',
        icon: <OrderedListOutlined />,
        label: 'Quản lý đơn hàng',
        children: [
            { key: '/admin/orders', icon: <ShoppingOutlined  />, label: 'Đơn hàng' }, 
            { key: '/admin/order-items', icon: <ReconciliationOutlined  />, label: 'Chi tiết đơn hàng' },
        ]
    },
    {
        key: '/admin/contacts',
        icon: <ContactsOutlined />,
        label: 'Notifications',
        
    },
    {
        key: '4',
        icon: <UserOutlined />,
        label: 'Account',
    },
]


function Sidebar() {
    const router = useRouter();

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