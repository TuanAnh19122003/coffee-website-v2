"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
    id: number;
    product: { id: number; name: string; image: string };
    size: { id: number; size: string } | null;
    quantity: number;
    price: number;
}

const CheckOut: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id);
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
            const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotalPrice(total);
        } catch (error) {
            message.error("Không thể lấy thông tin giỏ hàng");
        }
    };

    const handleCheckout = async () => {
        if (!userId) return;
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`, { userId });
            message.success("Thanh toán thành công!");
            router.push("/coffee");
        } catch (error) {
            message.error("Thanh toán thất bại");
        }
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "product",
            key: "image",
            render: (product: any) => (
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}` || "/images/placeholder.png"}
                    alt={product.name}
                    style={{ width: "60px" }}
                />
            ),
        },
        { title: "Sản phẩm", dataIndex: "product", key: "product", render: (_: any, record: CartItem) => record.product.name },
        {
            title: "Kích thước",
            dataIndex: "size",
            key: "size",
            render: (_: any, record: CartItem) => record.size?.size || "Không có kích thước",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `${Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
        },
    ];

    return (
        <div>
            <h2>Thanh toán</h2>
            <Table columns={columns} dataSource={cartItems} rowKey="id" pagination={false} />
            <div style={{ textAlign: "right", marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
                Tổng tiền: {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </div>
            <Button type="primary" onClick={handleCheckout} style={{ marginTop: "20px" }}>
                Xác nhận thanh toán
            </Button>
        </div>
    );
};

export default CheckOut;
