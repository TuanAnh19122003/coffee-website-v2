"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message, Input, Card, Radio } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface CartItem {
    id: number;
    product: { id: number; name: string; image: string };
    size: { id: number; size: string } | null;
    quantity: number;
    price: number;
}

const CheckOut: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total_price, setTotal_price] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [shipping_address, setshipping_address] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id);
            setUserName(`${parsedUser.lastname} ${parsedUser.firstname}`);
            setPhone(parsedUser.phone);
            fetchCart(parsedUser.id);
        } else {
            message.error("Vui lòng đăng nhập");
            router.push("/coffee/auth/login");
        }
    }, []);

    const fetchCart = async (userId: number) => {
        try {
            const { data } = await axios.get<CartItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/cart?userId=${userId}`);
            setCartItems(data);
            const total = data.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
            setTotal_price(Number(total));
        } catch (error) {
            message.error("Không thể lấy thông tin giỏ hàng");
        }
    };


    const handleCheckout = async () => {
        if (!userId) return;
        if (!shipping_address.trim()) {
            message.error("Vui lòng nhập địa chỉ giao hàng");
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`, {
                userId,
                shipping_address,
                paymentMethod: "cod",
                paymentStatus: "UNPAID",
            });

            message.success("Đặt hàng thành công! Thanh toán khi nhận hàng.");
            router.push("/coffee");
        } catch (error) {
            message.error("Thanh toán thất bại");
        }
    };

    const handlePayPalSuccess = async (details: any) => {
        console.log("[PayPal Success] Payment details:", details);
        console.log("[PayPal Success] Shipping Address:", shipping_address);

        if (!total_price || Number(total_price) <= 0) {
            message.error("Tổng tiền không hợp lệ. Vui lòng kiểm tra giỏ hàng.");
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/paypal`, {
                userId,
                shipping_address,
                paymentId: details.id,
                total_price: Number(total_price),
            });
            
            message.success("Thanh toán PayPal thành công!");
            router.push("/coffee");
        } catch (error) {
            console.error("[PayPal Error] Lỗi khi lưu đơn hàng vào hệ thống:", error);
            message.error("Thanh toán PayPal thất bại");
        }
    };

    const convertToUSD = (amountVND: number) => {
        const exchangeRate = 24000;
        return (amountVND / exchangeRate).toFixed(2);
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "product",
            key: "image",
            render: (product: any) => (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`} alt={product.name} style={{ width: "60px" }} />
            ),
        },
        { title: "Sản phẩm", dataIndex: "product", key: "product", render: (_: any, record: CartItem) => record.product.name },
        { title: "Kích thước", dataIndex: "size", key: "size", render: (_: any, record: CartItem) => record.size?.size || "Không có kích thước" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `${price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
        },
    ];

    return (
        <PayPalScriptProvider options={{ clientId: "AaW6_B7NhCk0GTzeSYR0vArUcoToLwOJ9r0loSsVSqipMkuBLBjZZ3CerZqgSe2NJCZ1NZhKOn7LySm1" }}>
            <div>
                <h2>Thanh toán</h2>
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                        <Table columns={columns} dataSource={cartItems} rowKey="id" pagination={false} />
                    </div>
                    <div style={{ width: "35%" }}>
                        <Card title="Thông tin khách hàng">
                            <p><strong>Họ và tên:</strong> {userName}</p>
                            <p><strong>Số điện thoại:</strong> {phone}</p>
                            <Input
                                placeholder="Địa chỉ giao hàng"
                                value={shipping_address}
                                onChange={(e) => {
                                    setshipping_address(e.target.value);
                                    console.log("📦 [Shipping Address Updated]:", e.target.value);
                                }}
                            />
                            <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginTop: 10 }}>
                                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                                <Radio value="paypal">Thanh toán qua PayPal</Radio>
                            </Radio.Group>
                            {paymentMethod === "cod" ? (
                                <Button type="primary" onClick={handleCheckout} style={{ marginTop: 10 }}>Thanh toán</Button>
                            ) : (
                                <PayPalButtons
                                    createOrder={async (data, actions) => {
                                        const priceUSD = convertToUSD(total_price);
                                        console.log("💰 [Create PayPal Order] Total VND:", total_price, "Converted USD:", priceUSD);

                                        if (parseFloat(priceUSD) <= 0) {
                                            message.error("Tổng tiền không hợp lệ. Vui lòng kiểm tra giỏ hàng.");
                                            return Promise.reject(new Error("Tổng tiền không hợp lệ"));
                                        }

                                        return actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: "USD",
                                                        value: priceUSD,
                                                    },
                                                    description: "Thanh toán đơn hàng cà phê",
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        console.log("[PayPal Approved] Order data:", data);
                                        if (!actions.order) return;
                                        try {
                                            const details = await actions.order.capture();
                                            console.log("[PayPal Capture Success] Order details:", details);
                                            handlePayPalSuccess(details);
                                        } catch (error) {
                                            console.error("[PayPal Capture Error]:", error);
                                            message.error("Lỗi khi xác nhận thanh toán PayPal.");
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error("[PayPal Error]:", err);
                                        message.error("Có lỗi xảy ra khi thanh toán PayPal.");
                                    }}
                                />
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
};

export default CheckOut;
