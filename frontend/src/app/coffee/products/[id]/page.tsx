"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Typography, Row, Col, Image, Spin, Button, message, Card } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/admin/interfaces/Product";
import { Product_size } from "@/app/admin/interfaces/Product_size";
import Link from "next/link";

const { Title, Text } = Typography;
const { Meta } = Card;

const ProductDetailPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSize, setSelectedSize] = useState<Product_size | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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
                        fetchRelatedProducts(response.data.category.id); // Gọi API lấy sản phẩm liên quan
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

    // Hàm lấy danh sách sản phẩm liên quan
    const fetchRelatedProducts = async (categoryId: number) => {
        try {
            const response = await axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                params: { categoryId },
            });
            setRelatedProducts(response.data.filter((p) => p.id !== Number(id))); // Loại bỏ sản phẩm đang xem
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm liên quan", error);
        }
    };

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
                        icon={<ArrowLeftOutlined /> }
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

                    <Button type="primary" icon={<ShoppingCartOutlined />} style={{ marginTop: "20px" }}>
                        Thêm vào giỏ hàng
                    </Button>
                </Col>
            </Row>

            {/* Sản phẩm liên quan */}
            {relatedProducts.length > 0 && (
                <div style={{ marginTop: "40px" }}>
                    <Title level={3}>Sản phẩm liên quan</Title>
                    <div style={{
                        display: "flex",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        gap: "20px",
                        paddingBottom: "10px"
                    }}>
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct.id} style={{ flex: "0 0 auto", width: "200px" }}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{
                                            width: "100%",
                                            height: "200px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#f5f5f5"
                                        }}>
                                            <Image
                                                src={relatedProduct.image ? `${process.env.NEXT_PUBLIC_API_URL}${relatedProduct.image}` : "/images/placeholder.png"}
                                                alt={relatedProduct.name}
                                                width={180}
                                                height={180}
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    aspectRatio: "1 / 1"
                                                }}
                                            />
                                        </div>
                                    }
                                >
                                    <Meta title={relatedProduct.name} />
                                    <br />
                                    <Link href={`/coffee/products/${relatedProduct.id}`} passHref>
                                        <Button type="link" style={{ padding: 0 }}>Xem chi tiết</Button>
                                    </Link>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProductDetailPage;
