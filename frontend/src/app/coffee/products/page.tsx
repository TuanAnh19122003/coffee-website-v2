"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Card, Spin, Typography, Layout, Menu, Row, Col, Empty, Pagination, Button, Image, message } from "antd";

import { Product } from "@/app/admin/interfaces/Product";
import { Category } from "@/app/admin/interfaces/Category";
import Sidebar from "@/components/admin/Sidebar";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";

const { Meta } = Card;

function ProcutsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                console.log("Procut: ", response.data);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                message.error("Error fetching products");
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                message.error("Error fetching categories");
            }
        }
        fetchCategories();
    }, [])
    return (
        <Layout>
            <Content>
                <Title level={2}>Products</Title>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        title={product.name}
                        hoverable
                        style={{ marginBottom: 16 }}
                        cover={<img alt="example" style={{ width:'200' }} src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}` || "/images/placeholder.png"} />}
                    >
                        <Typography.Text type="secondary">
                            Category: {categories.find(c => c.id === product.category.id)?.name || "N/A"}
                            <br />
                            Name: ${product.name}
                            <br />
                            Description: {product.description}
                        </Typography.Text>
                    </Card>
                ))}
            </Content>
        </Layout>
    )
}

export default ProcutsPage