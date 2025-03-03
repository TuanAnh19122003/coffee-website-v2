"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Layout, Menu, Badge } from "antd";
import {
    HomeOutlined,
    InfoCircleOutlined,
    AppstoreOutlined,
    MessageOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from "@ant-design/icons";

export const AppHeader = () => {
    const pathname = usePathname();

    const menuItems = [
        { key: "/", label: "Home", icon: <HomeOutlined /> },
        { key: "/coffee/about", label: "About", icon: <InfoCircleOutlined /> },
        { key: "/coffee/products", label: "Products", icon: <AppstoreOutlined /> },
        { key: "/coffee/contact", label: "Contact", icon: <MessageOutlined /> },
    ];

    const currentKey = menuItems.find((item) => pathname.startsWith(item.key))?.key || "/";

    return (
        <Layout.Header className="flex justify-between items-center !bg-white shadow-lg px-6 border-b border-gray-200">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
                <Image src="/Logo.png" width={50} height={50} alt="Logo" />
                <span className="text-2xl font-semibold text-black">Xưởng Cafe</span>
            </Link>

            {/* Menu */}
            <Menu
                mode="horizontal"
                selectedKeys={[pathname]}
                className="flex-1 justify-center bg-transparent border-none"
                items={menuItems.map((item) => ({
                    ...item,
                    label: <Link href={item.key}>{item.label}</Link>,
                }))}
            />

            {/* Login & Cart */}
            <div className="flex items-center space-x-6">
                <Link href="/cart">
                    <Badge count={2} size="small">
                        <ShoppingCartOutlined className="text-2xl text-gray-700 hover:text-blue-500 cursor-pointer" />
                    </Badge>
                </Link>
                <Link href="/coffee/auth/login">
                    <UserOutlined className="text-2xl text-gray-700 hover:text-blue-500 cursor-pointer" />
                </Link>
            </div>
        </Layout.Header>
    );
};
