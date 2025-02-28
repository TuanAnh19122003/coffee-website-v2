"use client";
import React from "react";
import { Input, Space, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Search } = Input;

function Header() {
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
            icon: <BellOutlined />,
            label: 'Thông báo',
        },
        {
            key: '4',
            icon: <UserOutlined />,
            label: 'Đăng xuất',
            danger: true
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

                <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md transition ease-in-out duration-300">
                        <Avatar size="large" src="/anh-cv.jpg" className="hover:opacity-80 transition duration-200" />
                        <span className="font-medium hidden sm:inline text-black">Nguyễn Văn A</span>
                    </div>
                </Dropdown>
            </div>
        </header>
    );

}

export default Header;
