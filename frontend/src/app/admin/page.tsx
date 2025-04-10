'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Card, Row, Col, Statistic, Select } from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

import {
    ShoppingCart,
    DollarSign,
    CalendarDays,
    BarChart3,
    LineChart as LineChartIcon
} from 'lucide-react';

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
        const fetchStats = async () => {
            try {
                const [
                    totalOrdersRes,
                    totalRevenueRes,
                    dailyRevenueRes,
                    monthlyRevenueRes,
                    dailyRevenueMonthRes,
                ] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/total-orders`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/total-revenue`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/daily-revenue`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/monthly-revenue`),
                    axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/orders/stats/daily-revenue-month?month=${selectedMonth}`
                    ),
                ]);

                setStats({
                    totalOrders: totalOrdersRes.data ?? 0,
                    totalRevenue: totalRevenueRes.data ?? 0,
                    dailyRevenue: dailyRevenueRes.data.revenue ?? 0,
                    monthlyRevenue: Array.isArray(monthlyRevenueRes.data) ? monthlyRevenueRes.data : [],
                    dailyRevenueMonth: Array.isArray(dailyRevenueMonthRes.data)
                        ? dailyRevenueMonthRes.data.map((item) => ({
                            day: `Ngày ${item.day}`,
                            revenue: item.revenue,
                        }))
                        : [],
                });
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        };

        fetchStats();
    }, [selectedMonth]);

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={28} className="text-blue-500" />
                <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            </div>

            <Row gutter={[24, 24]}>
                {[
                    {
                        title: 'Tổng đơn hàng',
                        value: stats.totalOrders,
                        icon: <ShoppingCart size={24} className="text-blue-600" />,
                        bg: 'bg-blue-50',
                        iconBg: 'bg-blue-100',
                        textColor: 'text-blue-800',
                    },
                    {
                        title: 'Tổng doanh thu',
                        value: numeral(stats.totalRevenue).format('0,0') + ' ₫',
                        icon: <DollarSign size={24} className="text-green-600" />,
                        bg: 'bg-green-50',
                        iconBg: 'bg-green-100',
                        textColor: 'text-green-800',
                    },
                    {
                        title: 'Doanh thu hôm nay',
                        value: numeral(stats.dailyRevenue).format('0,0') + ' ₫',
                        icon: <CalendarDays size={24} className="text-yellow-600" />,
                        bg: 'bg-yellow-50',
                        iconBg: 'bg-yellow-100',
                        textColor: 'text-yellow-800',
                    },
                ].map((item, i) => (
                    <Col xs={24} sm={12} md={6} key={i}>
                        <Card className={`mt-10 rounded-2xl shadow-sm ${item.bg} p-4 h-full`}>
                            <div className="flex items-center gap-4 h-full">
                                <div className={`${item.iconBg} p-3 rounded-full`}>{item.icon}</div>
                                <div>
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}

                <Col xs={24} sm={12} md={6}>
                    <Card className="mt-10 rounded-2xl shadow-sm bg-purple-50 p-4 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                <BarChart3 size={20} className="text-purple-500" />
                                Doanh thu theo tháng
                            </p>
                            {stats.monthlyRevenue.length > 0 ? (
                                <div className="space-y-1 max-h-[110px] overflow-y-auto pr-1">
                                    {stats.monthlyRevenue.slice(0, 4).map((month) => (
                                        <div key={month.month} className="flex justify-between text-sm text-gray-700">
                                            <span>Tháng {month.month}</span>
                                            <span className="font-semibold text-purple-700">
                                                {numeral(month.revenue).format('0,0')} ₫
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>


            <div className="mt-10 space-y-10">
                <Card className="rounded-2xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                        <CalendarDays size={22} className="text-gray-500" />
                        Chọn tháng
                    </h2>

                    <Select
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        style={{ width: 150 }}
                        size="large"
                    >
                        {[...Array(12)].map((_, i) => (
                            <Option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                            </Option>
                        ))}
                    </Select>
                </Card>

                <div className="mt-10 space-y-10">
                    <Card className="rounded-2xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <LineChartIcon size={24} />
                            Doanh thu theo ngày trong tháng
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.dailyRevenueMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => `${numeral(value).format('0,0')} ₫`} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4CAF50"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
