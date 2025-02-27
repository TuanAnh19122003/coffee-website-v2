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
        <header className="flex items-center bg-[#001529] px-4 h-16 text-white justify-between">

            <div className="text-3xl">
                <Link href="/admin" className="no-underline">
                    Admin Panel
                </Link>
            </div>

            <div className="w-96 flex">
                <Search placeholder="Tìm kiếm..." allowClear enterButton />
            </div>


            <div className="flex item-center gap-2">
                <BellOutlined className="text-xl mr-4 cursor-pointer" />

                <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                    <span className="flex items-center gap-2 cursor-pointer">
                        <Avatar size="large" src="/anh-cv.jpg" />
                        <span className="text-white font-medium">Nguyễn Văn A</span>
                    </span>
                </Dropdown>
            </div>
        </header>
    );
}

export default Header;
