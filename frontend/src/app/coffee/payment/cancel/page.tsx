"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "antd";
import { motion } from "framer-motion";

const PaymentCancel: React.FC = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/coffee");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-md mx-auto text-center shadow-lg rounded-2xl p-6 bg-white">
                    <h2 className="text-4xl font-bold text-red-500 mb-2">Payment Canceled</h2>
                    <p className="text-gray-600 mb-4">We’re sorry, but your payment has been canceled or encountered an issue. Please try again later.</p>
                    <Button type="primary" size="large" onClick={handleGoHome} className="mt-4 w-full">
                        Trang Chủ
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                        Need help? <a href="/coffee/contact" className="text-blue-500 font-semibold">Contact Support</a>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default PaymentCancel;