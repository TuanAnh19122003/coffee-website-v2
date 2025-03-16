"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, InputNumber, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
    id: number;
    product: { id: number; name: string };
    size: { id: number; size: string } | null;
    quantity: number;
    price: number;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser.id);
        } else {
            message.error("Vui lòng đăng nhập");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const { data } = await axios.get<CartItem[]>(
                `${process.env.NEXT_PUBLIC_API_URL}/cart?userId=${userId}`
            );
            setCartItems(data);
        } catch (error) {
            message.error("Không thể tải giỏ hàng");
        }
        setLoading(false);
    };

    const updateQuantity = async (productId: number, sizeId: number, quantity: number) => {
        if (!userId) return;
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, { userId, productId, sizeId, quantity });
            message.success("Cập nhật số lượng thành công");
            fetchCart();
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };

    const removeFromCart = async (productId: number, sizeId: number) => {
        if (!userId) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, { data: { userId, productId, sizeId } });
            message.success("Đã xóa sản phẩm");
            fetchCart();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
            render: (_: any, record: CartItem) => (
                <InputNumber min={1} value={record.quantity} onChange={(value) => updateQuantity(record.product.id, record.size?.id || 0, value!)} />
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `${Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: CartItem) => (
                <Button type="link" danger onClick={() => removeFromCart(record.product.id, record.size?.id || 0)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Giỏ hàng</h2>

            {!userId ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <p>Bạn cần đăng nhập để xem giỏ hàng.</p>
                    <Button type="primary" href="/coffee/auth/login">Đăng nhập</Button>
                </div>
            ) : (
                <>
                    <Table columns={columns} dataSource={cartItems} rowKey="id" loading={loading} pagination={false} />

                    {cartItems.length > 0 ? (
                        <>
                            <div style={{ textAlign: "right", marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
                                Tổng tiền: {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </div>
                            <Button type="primary" onClick={() => router.push("/coffee/checkout")} style={{ marginTop: "20px" }}>
                                Thanh toán
                            </Button>
                        </>
                    ) : (
                        <p style={{ textAlign: "center", marginTop: "20px" }}>Giỏ hàng của bạn đang trống.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CartPage;
