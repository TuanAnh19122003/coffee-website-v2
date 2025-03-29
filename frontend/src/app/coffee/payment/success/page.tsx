"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "antd";
import { motion } from "framer-motion";

const PaymentSuccess: React.FC = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/coffee");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-md mx-auto text-center shadow-lg rounded-2xl p-6 bg-white">
                    <h2 className="text-4xl font-bold text-blue-500 mb-2">Thank you !</h2>
                    <p className="text-gray-600 mb-4">Thanks for subscribing to our newsletter. <br/> You should receive a confirmation email soon.</p>
                    <Button type="primary" size="large" onClick={handleGoHome} className="mt-4 w-full">
                        Trang Chủ
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                        Tiếp tục mua sản phẩm ? <a href="/coffee/products" className="text-blue-500 font-semibold">Click here</a>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;