
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../lib/axios";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [dailySalesData, setDailySalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axiosInstance.get("/analytics");

        console.log("Analytics response:", response.data);

        setAnalyticsData(
          response.data.analyticsData || {
            users: 0,
            products: 0,
            totalSales: 0,
            totalRevenue: 0,
          }
        );

        setDailySalesData(response.data.dailySalesData || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={Number(analyticsData.users || 0).toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />

        <AnalyticsCard
          title="Total Products"
          value={Number(analyticsData.products || 0).toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-green-700"
        />

        <AnalyticsCard
          title="Total Sales"
          value={Number(analyticsData.totalSales || 0).toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-cyan-700"
        />

        <AnalyticsCard
          title="Total Revenue"
          value={`$${Number(
            analyticsData.totalRevenue || 0
          ).toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        />
      </div>

      {/* Sales Chart */}
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          Sales Overview
        </h2>

        {dailySalesData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={dailySalesData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
              />

              <XAxis
                dataKey="date"
                stroke="#D1D5DB"
                tick={{ fill: "#D1D5DB" }}
              />

              <YAxis
                yAxisId="left"
                stroke="#D1D5DB"
                tick={{ fill: "#D1D5DB" }}
                allowDecimals={false}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#D1D5DB"
                tick={{ fill: "#D1D5DB" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Legend />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                name="Sales"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-emerald-300 text-sm mb-1 font-semibold">
          {title}
        </p>

        <h3 className="text-white text-3xl font-bold">
          {value}
        </h3>
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />

    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
