'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Card, Row, Col, Statistic, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const { Option } = Select;

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        dailyRevenue: 0,
        monthlyRevenue: [] as { month: string; revenue: number }[],
        dailyRevenueMonth: [] as { day: string; revenue: number }[],
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        if (!selectedMonth) return;
    
        const fetchStats = async () => {
            try {
                const [totalOrdersRes, totalRevenueRes, dailyRevenueRes, monthlyRevenueRes, dailyRevenueMonthRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/total-orders`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/total-revenue`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/daily-revenue`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/monthly-revenue`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/daily-revenue-month?month=${selectedMonth}`),
                ]);
    
                setStats({
                    totalOrders: totalOrdersRes.data ?? 0,
                    totalRevenue: totalRevenueRes.data ?? 0,
                    dailyRevenue: dailyRevenueRes.data.revenue ?? 0,
                    monthlyRevenue: Array.isArray(monthlyRevenueRes.data) ? monthlyRevenueRes.data : [],
                    dailyRevenueMonth: Array.isArray(dailyRevenueMonthRes.data) ? dailyRevenueMonthRes.data.map(item => ({
                        day: `Ngày ${item.day}`,
                        revenue: item.revenue
                    })) : [],
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };
    
        fetchStats();
    }, [selectedMonth]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card variant={'borderless'} style={{ background: '#E3F2FD' }}>
                        <Statistic title="Tổng đơn hàng" value={stats.totalOrders} />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card variant={'borderless'} style={{ background: '#C8E6C9' }}>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue}
                            formatter={(value) => `${numeral(value).format('0,0')} ₫`}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card variant={'borderless'} style={{ background: '#FFF9C4' }}>
                        <Statistic
                            title="Doanh thu hôm nay"
                            value={stats.dailyRevenue}
                            formatter={(value) => `${numeral(value).format('0,0')} ₫`}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Card variant={'borderless'} style={{ background: '#E1BEE7', height: '100%' }}>
                        {stats.monthlyRevenue.length > 0 ? (
                            stats.monthlyRevenue.map((month) => (
                                <div key={month.month} style={{ marginBottom: '8px' }}>
                                    <h3>Doanh thu theo tháng {month.month}</h3>
                                    <Statistic
                                        value={month.revenue}
                                        formatter={(value) => `${numeral(value).format('0,0')} ₫`}
                                    />
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '16px', textAlign: 'center' }}>Chưa có dữ liệu</p>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card className="mt-6 p-4">
                <h2 className="text-lg font-bold mb-4">Chọn tháng</h2>
                <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 120 }}>
                    {[...Array(12)].map((_, i) => (
                        <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
                    ))}
                </Select>
            </Card>

            <Card className="mt-6 p-4">
                <h2 className="text-lg font-bold mb-4">Doanh thu theo ngày trong tháng</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.dailyRevenueMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${numeral(value).format('0,0')} ₫`} />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AdminDashboard;
