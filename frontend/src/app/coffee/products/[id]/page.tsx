"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Typography, Row, Col, Image, Spin, Button, message } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/admin/interfaces/Product";
import { Product_size } from "@/app/admin/interfaces/Product_size";

const { Title, Text } = Typography;

const ProductDetailPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSize, setSelectedSize] = useState<Product_size | null>(null);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchProductDetail = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get<Product>(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
                    if (response.data) {
                        setProduct(response.data);
                        if (response.data.sizes.length > 0) {
                            setSelectedSize(response.data.sizes[0]);
                        }
                    } else {
                        message.error("Không tìm thấy sản phẩm");
                    }
                } catch (error) {
                    message.error("Lỗi khi lấy thông tin sản phẩm");
                } finally {
                    setLoading(false);
                }
            };
            fetchProductDetail();
        }
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "auto", marginTop: "100px" }} />;
    }

    if (!product) {
        return <Text>Không tìm thấy sản phẩm</Text>;
    }

    return (
        <Layout style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
            <Row gutter={[32, 32]} align="middle" justify="center">
                <Col xs={24} md={10} style={{ textAlign: "center" }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        style={{ marginBottom: "20px", textAlign: "left", display: "block" }}
                    >
                        Quay lại
                    </Button>
                    <Image
                        src={product.image ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}` : "/images/placeholder.png"}
                        alt={product.name}
                        width={350}
                        height={350}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        fallback="/images/placeholder.png"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Title level={2}>{product.name}</Title>
                    {selectedSize && (
                        <div style={{ marginBottom: "10px" }}>
                            {selectedSize.discounted_price ? (
                                <>
                                    <Text strong style={{ fontSize: "18px", color: "gray", textDecoration: "line-through" }}>
                                        {Number(selectedSize.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </Text>
                                    <br />
                                    <Text strong style={{ fontSize: "22px", color: "red" }}>
                                        {Number(selectedSize.discounted_price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </Text>
                                </>
                            ) : (
                                <Text strong style={{ fontSize: "22px", color: "red" }}>
                                    {Number(selectedSize.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </Text>
                            )}
                        </div>
                    )}

                    <Text type="secondary">Chọn size: </Text>
                    <div style={{ margin: "10px 0" }}>
                        {product.sizes.map((size) => (
                            <Button
                                key={size.size}
                                type={selectedSize?.size === size.size ? "primary" : "default"}
                                style={{ margin: "5px" }}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size.size}
                            </Button>
                        ))}
                    </div>

                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        style={{ marginTop: "20px", width: "100%" }}
                        onClick={() => {
                            if (!selectedSize) {
                                message.warning("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
                                return;
                            }
                            console.log(`Thêm vào giỏ hàng: ${product.name} - Size: ${selectedSize.size} - Giá: ${selectedSize.discounted_price || selectedSize.price}`);
                        }}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Col>
            </Row>
        </Layout>
    );
};

export default ProductDetailPage;
