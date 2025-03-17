"use client";

import React from "react";
import { Button, Card, message } from "antd";
import { useRouter } from "next/navigation";

const PaymentCancel: React.FC = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/coffee");
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <Card title="Thanh toán bị hủy" style={{ maxWidth: 500, margin: "auto" }}>
                <p>Rất tiếc, thanh toán của bạn đã bị hủy hoặc gặp sự cố. Vui lòng thử lại sau.</p>
                <Button type="primary" onClick={handleGoHome}>
                    Trở về trang chủ
                </Button>
            </Card>
        </div>
    );
};

export default PaymentCancel;
