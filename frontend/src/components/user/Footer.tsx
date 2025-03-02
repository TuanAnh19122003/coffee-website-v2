"use client";

import React from "react";
import { Layout, Typography } from "antd";
import Link from "next/link";

const { Footer } = Layout;
const { Text } = Typography;

export const AppFooter = () => {
    return (
        <Footer className="bg-white dark:bg-gray-900 shadow-sm mt-8 p-6">
            <div className="max-w-7xl mx-auto px-6">
                {/* Bản quyền */}
                <div className="flex flex-wrap justify-between items-center text-sm font-medium">
                    <Text>
                        © {new Date().getFullYear()}{" "}
                        <Link href="/" className="hover:text-blue-500 font-semibold">
                            Xưởng Cafe™
                        </Link>{" "}
                        - All rights reserved.
                    </Text>

                    {/* Menu */}
                    <div className="flex flex-wrap gap-6">
                        <Link href="/products" className="hover:text-blue-500">Products</Link>
                        <Link href="#" className="hover:text-blue-500">Privacy Policy</Link>
                        <Link href="#" className="hover:text-blue-500">Licensing</Link>
                        <Link href="#" className="hover:text-blue-500">Contact</Link>
                    </div>
                </div>
            </div>
        </Footer>
    );
};
