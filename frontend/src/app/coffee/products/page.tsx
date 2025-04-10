"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Menu, Card, Typography, Row, Col, message, Spin, Image, Button, Tag } from "antd";
import { Category } from "@/app/admin/interfaces/Category";
import { Product } from "@/app/admin/interfaces/Product";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { div } from "framer-motion/client";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const ProductsPage = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(response.data || []);
                if (response.data && response.data.length > 0) {
                    setSelectedCategory(response.data[0].id);
                }
            } catch (error) {
                message.error("Lỗi khi lấy danh mục");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = selectedCategory !== null ? { categoryId: selectedCategory } : {};
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, { params });

                console.log("Dữ liệu sản phẩm từ API:", response.data);

                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setProducts(response.data.products || []);
                }
            } catch (error) {
                message.error("Lỗi khi lấy sản phẩm");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    const handleAddToCart = async (product: any) => {
        const user = sessionStorage.getItem("user");

        if (!user) {
            message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            router.push("/coffee/auth/login");
            return;
        }

        if (!product || !product.sizes || product.sizes.length === 0) {
            message.warning("Sản phẩm không có size khả dụng!");
            return;
        }

        const selectedSize = product.sizes[0];
        const price = selectedSize.discounted_price ?? selectedSize.price;

        try {
            // console.log("Gửi dữ liệu:", {
            //     productId: product.id,
            //     sizeId: selectedSize.id,
            //     quantity: 1,
            //     price: price,
            // });

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
                {
                    productId: Number(product.id),
                    sizeId: Number(selectedSize.id),
                    quantity: 1,
                    price: price,
                },
                { withCredentials: true }
            );

            message.success("Đã thêm vào giỏ hàng!");
        } catch (error: any) {
            message.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng");
        }
    };

    return (
        <Layout>
            <Sider width={250} style={{ background: "#fff", padding: "20px" }}>
                <Title level={4}>Danh mục</Title>
                <Menu
                    mode="inline"
                    selectedKeys={selectedCategory ? [String(selectedCategory)] : []}
                    onClick={({ key }) => setSelectedCategory(Number(key))}
                    items={categories.map((category) => ({
                        key: category.id.toString(),
                        label: category.name,
                    }))}
                />
            </Sider>

            <Layout style={{ padding: "20px" }}>
                <Content>
                    <Title level={2}>Sản phẩm</Title>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Row gutter={[16, 16]}>
                            {products.length > 0 ? (
                                products.map((product) => {
                                    const { id, name, description, image, original_price, discounted_price } = product as any;
                                    const sizeS = product.sizes?.find((s: any) => s.size === "S");
                                    const sizeText = sizeS ? `${sizeS.size}` : "Không có size S";

                                    const originalPrice = original_price ?? 0;
                                    const discountedPrice = discounted_price ?? originalPrice;
                                    const discountPercent = original_price ? Math.round(((original_price - discounted_price) / original_price) * 100) : 0;

                                    return (
                                        <Col key={id} xs={24} sm={12} md={8} lg={6}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <div>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}${image}` || "/images/placeholder.png"}
                                                            alt={name}
                                                            width="100%"
                                                            height={200}
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                        {discountPercent > 0 && (
                                                            <Tag color="red" style={{ position: "absolute", top: 10, left: 10 }}>
                                                                -{discountPercent}%
                                                            </Tag>
                                                        )}
                                                    </div>
                                                }
                                                actions={[
                                                    <Button type="link" onClick={() => handleAddToCart(product)}>
                                                        <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                                                    </Button>,
                                                    <Link href={`/coffee/products/${product.id}`}>
                                                        <Button type="link">
                                                            <EyeOutlined style={{ fontSize: "20px" }} />
                                                        </Button>
                                                    </Link>,
                                                ]}
                                            >
                                                <Meta title={name} style={{ fontSize: "16px", fontWeight: "bold" }} />
                                                <Text type="secondary" style={{ fontSize: "14px" }}>
                                                    Size: {sizeText}
                                                </Text>

                                                <br />
                                                {originalPrice > 0 && discountedPrice < originalPrice ? (
                                                    <>
                                                        <Text delete style={{ color: "gray", marginRight: 8 }}>
                                                            {Number(originalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                        </Text>
                                                        <Text strong style={{ color: "red" }}>
                                                            {Number(discountedPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <Text strong>
                                                        {Number(originalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                                    </Text>
                                                )}
                                            </Card>
                                        </Col>
                                    );
                                })
                            ) : (
                                <Text>Không có sản phẩm nào</Text>
                            )}
                        </Row>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProductsPage;
