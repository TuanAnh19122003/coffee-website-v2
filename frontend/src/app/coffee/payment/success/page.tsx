"use client";

import React from "react";
import { Button, Card, message } from "antd";
import { useRouter } from "next/navigation";

const PaymentSuccess: React.FC = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/coffee");
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <Card title="Thanh toán thành công!" style={{ maxWidth: 500, margin: "auto" }}>
                <p>Cảm ơn bạn đã thanh toán thành công!</p>
                <Button type="primary" onClick={handleGoHome}>
                    Trở về trang chủ
                </Button>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
