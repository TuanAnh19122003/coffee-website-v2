"use client";
import { useState, useEffect } from "react";
import { Input, Space, Avatar, Dropdown, Menu, message } from "antd";
import { UserOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

import { User } from "@/app/admin/interfaces/User";
import { usePathname } from "next/navigation";

const { Search } = Input;

function Header() {
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
        {
            key: '1',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
        },
        {
            key: '3',
            icon: <UserOutlined />, // Đổi icon thành User
            label: <a href="/coffee">UsePage</a>, // Chuyển hướng đến trang user
        },        
        {
            key: '4',
            icon: <UserOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: handleLogout,
        },
    ]

    return (
        <header className="flex items-center bg-white px-4 h-16 text-black justify-between shadow-md">

            <div className="flex items-center">
                <Link href="/admin" className="no-underline">
                    <img src="/logo.jpg" alt="Logo" sizes="" className="h-16" />
                </Link>
                <span className="text-2xl font-semibold text-black">Admin Dashboard</span>
            </div>

            <div className="flex items-center gap-5">
                <div className="w-96 flex">
                    <Search placeholder="Tìm kiếm..." allowClear enterButton className="border-gray-300 focus:border-blue-500" />
                </div>
                <BellOutlined className="text-xl mr-4 cursor-pointer hover:text-gray-500 transition ease-in-out duration-300" />

                {user ? (
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.lastname} {user.firstname}</span>
                        <Dropdown menu={{ items: menuItems, style: { minWidth: "150px" } }} placement="bottomLeft">
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
        </header>
    );

}

export default Header;
