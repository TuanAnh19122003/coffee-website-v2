"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Layout, Menu, Badge, MenuProps, message, Button, Avatar, Dropdown } from "antd";
import {
    HomeOutlined,
    InfoCircleOutlined,
    AppstoreOutlined,
    MessageOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import { User } from "@/app/admin/interfaces/User";

export const AppHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
            message.success('Đăng xuất thành công');
            setUser(null);
            router.push('/coffee/auth/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        { key: "/", label: "Home", icon: <HomeOutlined /> },
        { key: "/coffee/about", label: "About", icon: <InfoCircleOutlined /> },
        { key: "/coffee/products", label: "Products", icon: <AppstoreOutlined /> },
        { key: "/coffee/contact", label: "Contact", icon: <MessageOutlined /> },
    ];

    const isAdmin = user?.userRoles?.some(ur => ur.role.id === 1);

    const userMenuItems: MenuProps["items"] = [
        {
            key: "profile",
            label: <Link href="/profile">Profile</Link>,
            icon: <UserOutlined />,
        },
        {
            key: "settings",
            label: <Link href="/settings">Settings</Link>,
            icon: <SettingOutlined />,
        },
        ...(isAdmin ? [{
            key: "admin",
            label: <Link href="/admin/dashboard">Admin Dashboard</Link>,
            icon: <DashboardOutlined />,
        }] : []),
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

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
            <div className="flex items-center space-x-4">
                <Link href="#">
                    <Button type="text" icon={<ShoppingCartOutlined />} className="relative">
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            2
                        </span>
                    </Button>
                </Link>
                {user ? (
                    <div className="flex items-center space-x-6">
                        <span className="font-medium">{user.lastname} {user.firstname}</span>
                        <Dropdown menu={{ items: userMenuItems, style: { minWidth: "150px" } }} placement="bottomLeft">
                            <Avatar
                                src={user.image?.startsWith("http") ? user.image : `${process.env.NEXT_PUBLIC_API_URL}${user.image}`}
                                size={40}
                                icon={<UserOutlined />}
                                className="cursor-pointer"
                            />
                        </Dropdown>
                    </div>
                ) : (
                    <Link href="/coffee/auth/login">
                        <UserOutlined className="text-2xl text-gray-700 hover:text-blue-500 cursor-pointer" />
                    </Link>
                )}
            </div>
        </Layout.Header>
    );
};
